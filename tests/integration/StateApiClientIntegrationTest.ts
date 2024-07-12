import crypto from 'crypto';
import { numberToBytesBE } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import { Bill } from '../../src/Bill.js';
import { CborCodecNode } from '../../src/codec/cbor/CborCodecNode.js';
import { FeeCreditRecord } from '../../src/FeeCreditRecord.js';
import { FungibleToken } from '../../src/FungibleToken.js';
import { IUnit } from '../../src/IUnit.js';
import { IUnitId } from '../../src/IUnitId.js';
import { NonFungibleToken } from '../../src/NonFungibleToken.js';
import { DefaultSigningService } from '../../src/signing/DefaultSigningService.js';
import { StateApiClient } from '../../src/StateApiClient.js';
import { createMoneyClient, createTokenClient, http } from '../../src/StateApiClientFactory.js';
import { SystemIdentifier } from '../../src/SystemIdentifier.js';
import { AlwaysTruePredicate } from '../../src/transaction/AlwaysTruePredicate.js';
import { BurnFungibleTokenAttributes } from '../../src/transaction/BurnFungibleTokenAttributes.js';
import { CloseFeeCreditAttributes } from '../../src/transaction/CloseFeeCreditAttributes.js';
import { CreateFungibleTokenAttributes } from '../../src/transaction/CreateFungibleTokenAttributes.js';
import { CreateNonFungibleTokenAttributes } from '../../src/transaction/CreateNonFungibleTokenAttributes.js';
import { ITransactionClientMetadata } from '../../src/transaction/ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from '../../src/transaction/ITransactionPayloadAttributes.js';
import { NonFungibleTokenData } from '../../src/transaction/NonFungibleTokenData.js';
import { PayToPublicKeyHashPredicate } from '../../src/transaction/PayToPublicKeyHashPredicate.js';
import { TokenIcon } from '../../src/transaction/TokenIcon.js';
import { TransactionOrderFactory } from '../../src/transaction/TransactionOrderFactory.js';
import { TransactionPayload } from '../../src/transaction/TransactionPayload.js';
import { TransferBillToDustCollectorAttributes } from '../../src/transaction/TransferBillToDustCollectorAttributes.js';
import { TransferFeeCreditAttributes } from '../../src/transaction/TransferFeeCreditAttributes.js';
import { UnitIdWithType } from '../../src/transaction/UnitIdWithType.js';
import { UnitType } from '../../src/transaction/UnitType.js';
import { TransactionRecordWithProof } from '../../src/TransactionRecordWithProof.js';
import { UnitId } from '../../src/UnitId.js';
import { Base16Converter } from '../../src/util/Base16Converter.js';
import config from './config/config.js';

describe('State Api Client Integration tests', () => {
  const cborCodec = new CborCodecNode();
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

  describe('Money Client Integration Tests', () => {
    const moneyClient = createMoneyClient({
      transport: http(config.moneyPartitionUrl, new CborCodecNode()),
      transactionOrderFactory,
    });

    let feeCreditRecordId: UnitIdWithType; // can no longer be static as hash contains timeout

    it('Get round number and get block', async () => {
      const round = await moneyClient.getRoundNumber();
      expect(round).not.toBeNull();
      const block = await moneyClient.getBlock(round);
      expect(block).not.toBeNull();
      expect(block.length).not.toBe(0);
    });

    it('Get units by owner ID and get unit', async () => {
      const moneyUnitIds: IUnitId[] = await moneyClient.getUnitsByOwnerId(signingService.publicKey);
      expect(moneyUnitIds.length).toBeGreaterThan(0);
      const moneyUnit = (await moneyClient.getUnit(moneyUnitIds[0], true)) as IUnit;
      expect(moneyUnit.counter).not.toBeNull();
    });

    it('Add fee credit', async () => {
      const unitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(unitIds.length).toBeGreaterThan(0);

      const bill = (await moneyClient.getUnit(unitIds[0], false)) as Bill;
      expect(bill).not.toBeNull();
      const round = await moneyClient.getRoundNumber();
      const feeCreditRecordIdBytes = await calculateFeeCreditRecordId(round);
      feeCreditRecordId = new UnitIdWithType(feeCreditRecordIdBytes, UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD);
      const feeCreditRecord = (await moneyClient.getUnit(feeCreditRecordId, false)) as FeeCreditRecord;

      const amountToFeeCredit = 100n;
      expect(bill.value).toBeGreaterThan(amountToFeeCredit);

      console.log('Transferring to fee credit...');
      const transferToFeeCreditHash = await moneyClient.transferToFeeCredit(
        {
          bill: bill,
          amount: amountToFeeCredit,
          systemIdentifier: SystemIdentifier.MONEY_PARTITION,
          feeCreditRecord: feeCreditRecord || { unitId: feeCreditRecordId, counter: 0n },
          latestAdditionTime: round + 60n,
        },
        createMetadata(round),
      );

      const proof: TransactionRecordWithProof<TransactionPayload<TransferFeeCreditAttributes>> =
        await waitTransactionProof(moneyClient, transferToFeeCreditHash);
      console.log('Transfer to fee credit successful');

      console.log('Adding fee credit');
      const addFeeCreditHash = await moneyClient.addFeeCredit(
        {
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          proof,
          feeCreditRecord: { unitId: feeCreditRecordId },
        },
        createMetadata(round),
      );

      await waitTransactionProof(moneyClient, addFeeCreditHash);
      console.log('Adding fee credit successful');
    }, 20000);

    it('Lock and unlock fee credit', async () => {
      const feeCreditRecord = (await moneyClient.getUnit(feeCreditRecordId, false)) as FeeCreditRecord;
      expect(feeCreditRecord.locked).toBe(false);
      const round = await moneyClient.getRoundNumber();

      console.log('Locking fee credit...');
      const lockHash = await moneyClient.lockFeeCredit(
        {
          status: 5n,
          unit: feeCreditRecord,
        },
        createMetadata(round),
      );

      await waitTransactionProof(moneyClient, lockHash);
      console.log('Locking fee credit successful');
      const feeCreditAfterLock = (await moneyClient.getUnit(feeCreditRecordId, false)) as FeeCreditRecord;
      expect(feeCreditAfterLock.locked).toBe(true);

      console.log('Unlocking fee credit...');
      const unlockHash = await moneyClient.unlockFeeCredit(
        {
          unit: feeCreditAfterLock,
        },
        createMetadata(round),
      );

      await waitTransactionProof(moneyClient, unlockHash);
      console.log('Unlocking fee credit successful');
      const feeCreditAfterUnlock = (await moneyClient.getUnit(feeCreditRecordId, false)) as FeeCreditRecord;
      expect(feeCreditAfterUnlock.locked).toBe(false);
    }, 20000);

    it('Lock and unlock bill', async () => {
      const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(billUnitIds.length).toBeGreaterThan(0);

      const round = await moneyClient.getRoundNumber();
      const bill = (await moneyClient.getUnit(billUnitIds[0], false)) as Bill;
      expect(bill).not.toBeNull();

      console.log('Locking bill...');
      const lockHash = await moneyClient.lockBill(
        {
          status: 5n,
          unit: bill,
        },
        createMetadata(round, feeCreditRecordId),
      );
      await waitTransactionProof(moneyClient, lockHash);
      console.log('Locking bill successful');

      console.log('Unlocking bill...');
      const lockedBill = (await moneyClient.getUnit(bill.unitId, false)) as Bill;
      expect(lockedBill).not.toBeNull();
      expect(lockedBill.counter).not.toEqual(bill.counter);
      const unlockHash = await moneyClient.unlockBill(
        {
          unit: lockedBill,
        },
        createMetadata(round, feeCreditRecordId),
      );
      await waitTransactionProof(moneyClient, unlockHash);
      console.log('Unlocking bill successful');
    }, 20000);

    it('Split and transfer bill', async () => {
      const round = await moneyClient.getRoundNumber();
      const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(billUnitIds.length).toBeGreaterThan(0);
      const billUnitId = billUnitIds[0];
      let bill = (await moneyClient.getUnit(billUnitId, false)) as Bill;
      expect(bill).not.toBeNull();

      console.log('Splitting bill...');
      const splitBillHash = await moneyClient.splitBill(
        {
          splits: [
            {
              value: 10n,
              ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
            },
          ],
          bill: bill,
        },
        createMetadata(round, feeCreditRecordId),
      );
      await waitTransactionProof(moneyClient, splitBillHash);
      console.log('Splitting bill successful');

      bill = (await moneyClient.getUnit(billUnitId, false)) as Bill;
      expect(bill.value).toBeGreaterThan(0);

      const targetBillUnitId = billUnitIds
        .filter((id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA && id.bytes !== bill.unitId.bytes)
        .at(0) as IUnitId;
      const targetBill = (await moneyClient.getUnit(targetBillUnitId, false)) as Bill;

      console.log('Transferring bill...');
      const transferBillHash = await moneyClient.transferBill(
        {
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          bill: targetBill,
        },
        createMetadata(round, feeCreditRecordId),
      );
      await waitTransactionProof(moneyClient, transferBillHash);
      console.log('Transferring bill successful');
    }, 20000);

    it('Transfer and swap bill with dust collector', async () => {
      const round = await moneyClient.getRoundNumber();
      const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(billUnitIds.length).toBeGreaterThan(0);
      const bill = (await moneyClient.getUnit(billUnitIds[0], false)) as Bill;
      expect(bill).not.toBeNull();

      const targetBillUnitId = billUnitIds
        .filter((id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA && id.bytes !== bill.unitId.bytes)
        .at(0) as IUnitId;
      const targetBill = (await moneyClient.getUnit(targetBillUnitId, false)) as Bill;
      expect(targetBill).not.toBeNull();

      console.log('Transferring bill to dust collector...');
      const swapBillHash = await moneyClient.transferBillToDustCollector(
        {
          bill: bill,
          targetBill: targetBill,
        },
        createMetadata(round, feeCreditRecordId),
      );
      const transactionProof: TransactionRecordWithProof<TransactionPayload<TransferBillToDustCollectorAttributes>> =
        await waitTransactionProof(moneyClient, swapBillHash);
      console.log('Transferring bill to dust collector successful');

      console.log('Swapping bill with dust collector...');
      await moneyClient.swapBillsWithDustCollector(
        {
          bill: targetBill,
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          proofs: [transactionProof],
        },
        createMetadata(round, feeCreditRecordId),
      );

      await waitTransactionProof(moneyClient, swapBillHash);
      console.log('Swapping bill successful');
    }, 20000);

    it('Close and reclaim fee credit', async () => {
      const round = await moneyClient.getRoundNumber();
      const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(billUnitIds.length).toBeGreaterThan(0);
      const billUnitId = billUnitIds[0];
      let bill = (await moneyClient.getUnit(billUnitId, false)) as Bill;
      expect(bill).not.toBeNull();

      const feeCreditRecord = (await moneyClient.getUnit(feeCreditRecordId, false)) as FeeCreditRecord;
      console.log('Closing fee credit...');
      const closeFeeCreditHash = await moneyClient.closeFeeCredit(
        {
          amount: bill.value,
          bill: bill,
          feeCreditRecord: feeCreditRecord,
        },
        createMetadata(round),
      );
      const proof: TransactionRecordWithProof<TransactionPayload<CloseFeeCreditAttributes>> =
        await waitTransactionProof(moneyClient, closeFeeCreditHash);
      console.log('Closing fee credit successful');

      bill = (await moneyClient.getUnit(billUnitId, false)) as Bill;
      console.log('Reclaiming fee credit...');
      const reclaimFeeCreditHash = await moneyClient.reclaimFeeCredit(
        {
          proof: proof,
          bill: bill,
        },
        createMetadata(round),
      );
      await waitTransactionProof(moneyClient, reclaimFeeCreditHash);
      console.log('Reclaiming fee credit successful');
    }, 20000);
  });

  describe('Token Client Integration Tests', () => {
    const tokenClient = createTokenClient({
      transport: http(config.tokenPartitionUrl, new CborCodecNode()),
      transactionOrderFactory,
    });

    let feeCreditRecordId: UnitIdWithType; // can no longer be static as hash contains timeout

    it('Add fee credit', async () => {
      const moneyClient = createMoneyClient({
        transport: http(config.moneyPartitionUrl, new CborCodecNode()),
        transactionOrderFactory,
      });

      const unitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(unitIds.length).toBeGreaterThan(0);

      const bill = (await moneyClient.getUnit(unitIds[0], false)) as Bill;
      expect(bill).not.toBeNull();
      const amountToFeeCredit = 100n;
      expect(bill.value).toBeGreaterThan(amountToFeeCredit);

      const round = await tokenClient.getRoundNumber();
      const feeCreditRecordIdBytes = await calculateFeeCreditRecordId(round);
      feeCreditRecordId = new UnitIdWithType(feeCreditRecordIdBytes, UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD);
      const feeCreditRecord = (await tokenClient.getUnit(feeCreditRecordId, false)) as FeeCreditRecord;

      console.log('Transferring to fee credit...');
      const transferToFeeCreditHash = await moneyClient.transferToFeeCredit(
        {
          bill: bill,
          amount: amountToFeeCredit,
          systemIdentifier: SystemIdentifier.TOKEN_PARTITION,
          feeCreditRecord: feeCreditRecord || { unitId: feeCreditRecordId, counter: null },
          latestAdditionTime: round + 60n,
        },
        createMetadata(round),
      );
      const proof: TransactionRecordWithProof<TransactionPayload<TransferFeeCreditAttributes>> =
        await waitTransactionProof(moneyClient, transferToFeeCreditHash);
      console.log('Transfer to fee credit successful');

      console.log('Adding fee credit');
      const addFeeCreditHash = await tokenClient.addFeeCredit(
        {
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          proof,
          feeCreditRecord: feeCreditRecord || { unitId: feeCreditRecordId },
        },
        createMetadata(round),
      );

      await waitTransactionProof(tokenClient, addFeeCreditHash);
      console.log('Adding fee credit successful');
    }, 20000);

    describe('Fungible Token Integration Tests', () => {
      const tokenTypeUnitId = new UnitIdWithType(randomBytes(12), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE);
      let tokenUnitId: IUnitId;

      it('Create token type and token', async () => {
        const round = await tokenClient.getRoundNumber();
        console.log('Creating fungible token type...');
        const createFungibleTokenTypeHash = await tokenClient.createFungibleTokenType(
          {
            type: { unitId: tokenTypeUnitId },
            symbol: 'E',
            name: 'Big money come',
            icon: new TokenIcon('image/png', new Uint8Array()),
            parentTypeId: null,
            decimalPlaces: 8,
            subTypeCreationPredicate: new AlwaysTruePredicate(),
            tokenCreationPredicate: new AlwaysTruePredicate(),
            invariantPredicate: new AlwaysTruePredicate(),
            subTypeCreationPredicateSignatures: null,
          },
          createMetadata(round, feeCreditRecordId),
        );
        await waitTransactionProof(tokenClient, createFungibleTokenTypeHash);
        console.log('Creating fungible token type successful');

        console.log('Creating fungible token...');
        const createFungibleTokenHash = await tokenClient.createFungibleToken(
          {
            ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
            type: { unitId: tokenTypeUnitId },
            value: 10n,
            nonce: 0n,
            tokenCreationPredicateSignatures: [new Uint8Array()],
          },
          createMetadata(round, feeCreditRecordId),
        );
        const createFungibleTokenProof = await waitTransactionProof(tokenClient, createFungibleTokenHash);
        const attr = createFungibleTokenProof.transactionRecord.transactionOrder
          .payload as TransactionPayload<CreateFungibleTokenAttributes>;
        tokenUnitId = attr.unitId;
        console.log('Creating fungible token successful');
      }, 20000);

      it('Split, burn and join', async () => {
        const round = await tokenClient.getRoundNumber();
        const token = (await tokenClient.getUnit(tokenUnitId, false)) as FungibleToken;
        console.log('Splitting fungible token...');
        const splitFungibleTokenHash = await tokenClient.splitFungibleToken(
          {
            token: token,
            ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
            amount: 3n,
            nonce: null,
            type: { unitId: tokenTypeUnitId },
            invariantPredicateSignatures: [new Uint8Array()],
          },
          createMetadata(round, feeCreditRecordId),
        );
        await waitTransactionProof(tokenClient, splitFungibleTokenHash);
        console.log('Fungible token split successful');

        const splitBillProof = await waitTransactionProof(tokenClient, splitFungibleTokenHash);
        const splitTokenId = splitBillProof.transactionRecord.serverMetadata.targetUnits
          .map((bytes) => UnitId.fromBytes(bytes))
          .find(
            (id) =>
              id.type.toBase16() === UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN &&
              Base16Converter.encode(id.bytes) !== Base16Converter.encode(token.unitId.bytes),
          ) as IUnitId;
        const splitToken = (await tokenClient.getUnit(splitTokenId, false)) as FungibleToken;
        const originalTokenAfterSplit = (await tokenClient.getUnit(tokenUnitId, false)) as FungibleToken;

        console.log('Burning fungible token...');
        const burnFungibleTokenHash = await tokenClient.burnFungibleToken(
          {
            token: splitToken,
            targetToken: originalTokenAfterSplit,
            type: { unitId: tokenTypeUnitId },
            invariantPredicateSignatures: [new Uint8Array()],
          },
          createMetadata(round, feeCreditRecordId),
        );
        await waitTransactionProof(tokenClient, burnFungibleTokenHash);
        console.log('Fungible token burn successful');

        const burnProof: TransactionRecordWithProof<TransactionPayload<BurnFungibleTokenAttributes>> =
          await waitTransactionProof(tokenClient, burnFungibleTokenHash);
        console.log('Joining fungible token...');
        const joinFungibleTokenHash = await tokenClient.joinFungibleTokens(
          {
            proofs: [burnProof],
            token: originalTokenAfterSplit,
            invariantPredicateSignatures: [new Uint8Array()],
          },
          createMetadata(round, feeCreditRecordId),
        );
        await waitTransactionProof(tokenClient, joinFungibleTokenHash);
        console.log('Fungible token join successful');
      }, 20000);

      it('Transfer', async () => {
        const round = await tokenClient.getRoundNumber();
        const token = (await tokenClient.getUnit(tokenUnitId, false)) as FungibleToken;

        console.log('Transferring fungible token...');
        const transferFungibleTokenHash = await tokenClient.transferFungibleToken(
          {
            token: token,
            ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
            nonce: null,
            type: { unitId: tokenTypeUnitId },
            invariantPredicateSignatures: [new Uint8Array()],
          },
          createMetadata(round, feeCreditRecordId),
        );

        await waitTransactionProof(tokenClient, transferFungibleTokenHash);
        console.log('Fungible token transfer successful');
      }, 20000);
    });

    describe('Non Fungible Token Integration Tests', () => {
      const tokenTypeUnitId = new UnitIdWithType(randomBytes(12), UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN_TYPE);
      let tokenUnitId: IUnitId;

      it('Create token type and token', async () => {
        const round = await tokenClient.getRoundNumber();
        console.log('Creating non fungible token type...');
        const createNonFungibleTokenTypeHash = await tokenClient.createNonFungibleTokenType(
          {
            type: { unitId: tokenTypeUnitId },
            symbol: 'E',
            name: 'Token Name',
            icon: { type: 'image/png', data: new Uint8Array() },
            parentTypeId: null,
            subTypeCreationPredicate: new AlwaysTruePredicate(),
            tokenCreationPredicate: new AlwaysTruePredicate(),
            invariantPredicate: new AlwaysTruePredicate(),
            dataUpdatePredicate: new AlwaysTruePredicate(),
            subTypeCreationPredicateSignatures: null,
          },
          createMetadata(round, feeCreditRecordId),
        );
        await waitTransactionProof(tokenClient, createNonFungibleTokenTypeHash);
        console.log('Creating non fungible token type successful');

        console.log('Creating non fungible token...');
        const createNonFungibleTokenHash = await tokenClient.createNonFungibleToken(
          {
            ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
            type: { unitId: tokenTypeUnitId },
            name: 'My token',
            uri: 'http://guardtime.com',
            data: await NonFungibleTokenData.create(cborCodec, [
              'user variables as primitives',
              10000,
              [true, new Uint8Array()],
            ]),
            dataUpdatePredicate: new AlwaysTruePredicate(),
            nonce: 0n,
            tokenCreationPredicateSignatures: [new Uint8Array()],
          },
          createMetadata(round, feeCreditRecordId),
        );
        const createNonFungibleTokenProof = await waitTransactionProof(tokenClient, createNonFungibleTokenHash);
        const attr = createNonFungibleTokenProof.transactionRecord.transactionOrder
          .payload as TransactionPayload<CreateNonFungibleTokenAttributes>;
        tokenUnitId = attr.unitId;
        console.log('Creating non fungible token successful');
      }, 20000);

      it('Update and transfer', async () => {
        const round = await tokenClient.getRoundNumber();
        let token = (await tokenClient.getUnit(tokenUnitId, false)) as NonFungibleToken;
        expect(token).not.toBeNull();

        console.log('Updating non fungible token...');
        const updateNonFungibleTokenHash = await tokenClient.updateNonFungibleToken(
          {
            token: token,
            data: await NonFungibleTokenData.create(cborCodec, [crypto.getRandomValues(new Uint8Array(32))]),
            dataUpdateSignatures: [new Uint8Array(), new Uint8Array()],
          },
          createMetadata(round, feeCreditRecordId),
        );
        await waitTransactionProof(tokenClient, updateNonFungibleTokenHash);
        console.log('Updating non token fungible token successful');

        token = (await tokenClient.getUnit(tokenUnitId, false)) as NonFungibleToken;

        console.log('Transferring non fungible token...');
        const transferNonFungibleTokenHash = await tokenClient.transferNonFungibleToken(
          {
            token: token,
            counter: token.counter,
            ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
            nonce: null,
            type: { unitId: tokenTypeUnitId },
            invariantPredicateSignatures: [new Uint8Array()],
          },
          createMetadata(round, feeCreditRecordId),
        );
        await waitTransactionProof(tokenClient, transferNonFungibleTokenHash);
        console.log('Transferring non token fungible token successful');
      }, 20000);
    });
  });

  /**
   * Wait for a transaction proof to be available.
   * @param {StateApiClient} client State API client.
   * @param {Uint8Array} transactionHash Transaction hash.
   * @param {number} [timeout=10000] Timeout in milliseconds.
   * @param {number} [interval=1000] Interval in milliseconds for polling.
   * @returns {Promise<TransactionRecordWithProof>} Transaction proof.
   * @throws {string} Timeout.
   */
  function waitTransactionProof<T extends ITransactionPayloadAttributes>(
    client: StateApiClient,
    transactionHash: Uint8Array,
    timeout = 10000,
    interval = 1000,
  ): Promise<TransactionRecordWithProof<TransactionPayload<T>>> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const poller = async (): Promise<void> => {
        const proof = await client.getTransactionProof(transactionHash);
        if (proof !== null) {
          return resolve(proof as TransactionRecordWithProof<TransactionPayload<T>>);
        }

        if (Date.now() > start + timeout) {
          return reject('Timeout');
        }

        setTimeout(poller, interval);
      };

      poller();
    });
  }

  function createMetadata(round: bigint, feeCreditRecordId?: UnitIdWithType): ITransactionClientMetadata {
    return {
      maxTransactionFee: 5n,
      timeout: round + 60n,
      feeCreditRecordId: feeCreditRecordId ?? null,
      referenceNumber: new Uint8Array(),
    };
  }

  async function calculateFeeCreditRecordId(round: bigint): Promise<Uint8Array> {
    const ownerPredicate = await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey);
    return sha256
      .create()
      .update(ownerPredicate.bytes)
      .update(numberToBytesBE(round + 60n, 8))
      .digest();
  }
});
