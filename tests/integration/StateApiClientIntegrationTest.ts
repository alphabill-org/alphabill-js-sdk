import crypto from 'crypto';
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

    const moneyFeeCreditRecordId = new UnitIdWithType(
      sha256(signingService.publicKey),
      UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD,
    );
    let moneyFeeCreditRecord: FeeCreditRecord | null;

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
      const moneyUnit: IUnit | null = await moneyClient.getUnit(moneyUnitIds[0], true);
      expect(moneyUnit?.backlink).not.toBeNull();
    });

    it('Add fee credit', async () => {
      const feeCreditRecord = await moneyClient.getUnit(moneyFeeCreditRecordId, false);
      if (feeCreditRecord != null) {
        console.log('Fee credit already exists, skipping...');
        moneyFeeCreditRecord = feeCreditRecord as FeeCreditRecord;
        return;
      }

      const unitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(unitIds.length).toBeGreaterThan(0);

      const bill = await moneyClient.getUnit(unitIds[0], false);
      expect(bill).not.toBeNull();
      const round = await moneyClient.getRoundNumber();

      console.log('Transferring to fee credit...');
      let transactionHash = await moneyClient.transferToFeeCredit(
        {
          bill: bill!,
          amount: BigInt(100),
          systemIdentifier: SystemIdentifier.MONEY_PARTITION,
          feeCreditRecord: { unitId: moneyFeeCreditRecordId, backlink: null },
          earliestAdditionTime: round,
          latestAdditionTime: round + BigInt(60),
        },
        {
          maxTransactionFee: BigInt(5),
          timeout: round + BigInt(60),
          feeCreditRecordId: null,
        },
      );

      const proof: TransactionRecordWithProof<TransactionPayload<TransferFeeCreditAttributes>> =
        await waitTransactionProof(moneyClient, transactionHash);
      console.log('Transfer to fee credit successful');

      console.log('Adding fee credit');
      transactionHash = await moneyClient.addFeeCredit(
        {
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          proof,
          feeCreditRecord: { unitId: moneyFeeCreditRecordId },
        },
        {
          maxTransactionFee: BigInt(5),
          timeout: round + BigInt(60),
          feeCreditRecordId: null,
        },
      );

      await waitTransactionProof(moneyClient, transactionHash);
      console.log('Adding fee credit successful');
      moneyFeeCreditRecord = await moneyClient.getUnit(moneyFeeCreditRecordId, false);
    }, 20000);

    it('Lock and unlock fee credit', async () => {
      const round = await moneyClient.getRoundNumber();

      console.log('Locking fee credit...');
      const lockHash = await moneyClient.lockFeeCredit(
        {
          status: 5n,
          unit: moneyFeeCreditRecord!,
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: null,
        },
      );

      await waitTransactionProof(moneyClient, lockHash);
      console.log('Locking fee credit successful');
      const feeCreditAfterLock: FeeCreditRecord | null = await moneyClient.getUnit(moneyFeeCreditRecordId, false);
      expect(feeCreditAfterLock?.locked).toBe(true);

      console.log('Unlocking fee credit...');
      const unlockHash = await moneyClient.unlockFeeCredit(
        {
          unit: feeCreditAfterLock!,
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: null,
        },
      );

      await waitTransactionProof(moneyClient, unlockHash);
      console.log('Unlocking fee credit successful');
      const feeCreditAfterUnlock: FeeCreditRecord | null = await moneyClient.getUnit(moneyFeeCreditRecordId, false);
      expect(feeCreditAfterUnlock?.locked).toBe(false);
    }, 20000);

    it('Close and reclaim fee credit', async () => {
      const round = await moneyClient.getRoundNumber();
      const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(billUnitIds.length).toBeGreaterThan(0);
      const bill: IUnit | null = await moneyClient.getUnit(billUnitIds[0], false);
      expect(bill).not.toBeNull();

      console.log('Closing fee credit...');
      let transactionHash = await moneyClient.closeFeeCredit(
        {
          amount: 1n,
          bill: bill!,
          feeCreditRecord: moneyFeeCreditRecord!,
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: null,
        },
      );
      const proof: TransactionRecordWithProof<TransactionPayload<CloseFeeCreditAttributes>> =
        await waitTransactionProof(moneyClient, transactionHash);
      console.log('Closing fee credit successful');

      console.log('Reclaiming fee credit...');
      transactionHash = await moneyClient.reclaimFeeCredit(
        {
          proof: proof!,
          bill: bill!,
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: null,
        },
      );
      console.log('Reclaiming fee credit successful');
    }, 20000);

    it('Split, swap and transfer bill', async () => {
      const round = await moneyClient.getRoundNumber();
      const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(billUnitIds.length).toBeGreaterThan(0);
      const bill: Bill | null = await moneyClient.getUnit(billUnitIds[0], false);
      expect(bill).not.toBeNull();

      console.log('Splitting bill...');
      const splitBillHash = await moneyClient.splitBill(
        {
          splits: [
            {
              value: bill!.value - 1n,
              ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
            },
            {
              value: 1n,
              ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
            },
          ],
          bill: bill!,
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: moneyFeeCreditRecordId,
        },
      );
      await waitTransactionProof(moneyClient, splitBillHash);
      console.log('Splitting bill successful');

      const targetBillUnitId: IUnitId | undefined = billUnitIds
        .filter((id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA && id.bytes !== bill!.unitId.bytes)
        .at(0);
      const targetBill: Bill | null = await moneyClient.getUnit(targetBillUnitId!, false);

      console.log('Swapping bill...');
      const swapBillHash = await moneyClient.transferBillToDustCollector(
        {
          bill: bill!,
          targetBill: targetBill!,
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: moneyFeeCreditRecordId,
        },
      );
      const transactionProof: TransactionRecordWithProof<TransactionPayload<TransferBillToDustCollectorAttributes>> =
        await waitTransactionProof(moneyClient, swapBillHash);
      await moneyClient.swapBillsWithDustCollector(
        {
          bill: targetBill!,
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          proofs: [transactionProof],
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 100n,
          feeCreditRecordId: moneyFeeCreditRecordId,
        },
      );

      await waitTransactionProof(moneyClient, swapBillHash);
      console.log('Swapping bill successful');

      console.log('Transferring bill...');
      const transferBillHash = await moneyClient.transferBill(
        {
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          bill: bill!,
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: moneyFeeCreditRecordId,
        },
      );

      await waitTransactionProof(moneyClient, transferBillHash);
      console.log('Transferring bill successful');
    }, 20000);

    it('Lock and unlock bill', async () => {
      const billUnitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(billUnitIds.length).toBeGreaterThan(0);

      const round = await moneyClient.getRoundNumber();
      const bill = await moneyClient.getUnit(billUnitIds[0], false);
      expect(bill).not.toBeNull();

      console.log('Locking bill...');
      const lockHash = await moneyClient.lockBill(
        {
          status: 5n,
          unit: bill!,
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: moneyFeeCreditRecordId,
        },
      );
      await waitTransactionProof(moneyClient, lockHash);
      console.log('Locking bill successful');

      console.log('Unlocking bill...');
      const lockedBill = await moneyClient.getUnit(bill!.unitId, false);
      expect(lockedBill).not.toBeNull();
      expect(lockedBill!.backlink).not.toEqual(bill!.backlink);
      const unlockHash = await moneyClient.unlockBill(
        {
          unit: lockedBill!,
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: moneyFeeCreditRecordId,
        },
      );
      await waitTransactionProof(moneyClient, unlockHash);
      console.log('Unlocking bill successful');
    }, 20000);
  });

  describe('Token Client Integration Tests', () => {
    const tokenClient = createTokenClient({
      transport: http(config.tokenPartitionUrl, new CborCodecNode()),
      transactionOrderFactory,
    });

    // needed just to add fee credit so that this test can be run separately
    const moneyClient = createMoneyClient({
      transport: http(config.moneyPartitionUrl, new CborCodecNode()),
      transactionOrderFactory,
    });

    const tokenFeeCreditRecordId = new UnitIdWithType(
      sha256(signingService.publicKey),
      UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD,
    );

    const fttUnitId = new UnitIdWithType(randomBytes(12), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE);
    const nfttUnitId = new UnitIdWithType(randomBytes(12), UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN_TYPE);
    const ftUnitId = new UnitIdWithType(randomBytes(12), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN);
    const nftUnitId = new UnitIdWithType(randomBytes(12), UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN);

    it('Get units by owner ID and get unit', async () => {
      const tokenUnitIds: IUnitId[] = await tokenClient.getUnitsByOwnerId(signingService.publicKey);
      expect(tokenUnitIds.length).toBeGreaterThan(0);
      const tokenUnit: IUnit | null = await tokenClient.getUnit(tokenUnitIds[0], true);
      expect(tokenUnit?.backlink).not.toBeNull();
    });

    it('Add fee credit', async () => {
      const feeCreditRecord = await tokenClient.getUnit(tokenFeeCreditRecordId, false);
      if (feeCreditRecord != null) {
        console.log('Fee credit already exists, skipping...');
        return;
      }

      const unitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
        (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
      );
      expect(unitIds.length).toBeGreaterThan(0);

      const bill = await moneyClient.getUnit(unitIds[0], false);
      expect(bill).not.toBeNull();
      const round = await moneyClient.getRoundNumber();

      console.log('Transferring to fee credit...');
      let transactionHash = await moneyClient.transferToFeeCredit(
        {
          bill: bill!,
          amount: BigInt(100),
          systemIdentifier: SystemIdentifier.MONEY_PARTITION,
          feeCreditRecord: { unitId: tokenFeeCreditRecordId, backlink: null },
          earliestAdditionTime: round,
          latestAdditionTime: round + BigInt(60),
        },
        {
          maxTransactionFee: BigInt(5),
          timeout: round + BigInt(60),
          feeCreditRecordId: null,
        },
      );

      const proof: TransactionRecordWithProof<TransactionPayload<TransferFeeCreditAttributes>> =
        await waitTransactionProof(moneyClient, transactionHash);
      console.log('Transfer to fee credit successful');

      console.log('Adding fee credit');
      transactionHash = await tokenClient.addFeeCredit(
        {
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          proof,
          feeCreditRecord: { unitId: tokenFeeCreditRecordId },
        },
        {
          maxTransactionFee: BigInt(5),
          timeout: round + BigInt(60),
          feeCreditRecordId: null,
        },
      );

      await waitTransactionProof(tokenClient, transactionHash);
      console.log('Adding fee credit successful');
    }, 20000);

    it('Create fungible token type and fungible token', async () => {
      const round = await tokenClient.getRoundNumber();
      console.log('Creating fungible token type...');
      const createFungibleTokenTypeHash = await tokenClient.createFungibleTokenType(
        {
          type: { unitId: fttUnitId },
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
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: tokenFeeCreditRecordId,
        },
      );
      await waitTransactionProof(tokenClient, createFungibleTokenTypeHash);
      console.log('Creating fungible token type successful');

      console.log('Creating fungible token...');
      const createFungibleTokenHash = await tokenClient.sendTransaction(
        await transactionOrderFactory.createTransaction(
          TransactionPayload.create(
            SystemIdentifier.TOKEN_PARTITION,
            ftUnitId,
            new CreateFungibleTokenAttributes(
              await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
              fttUnitId,
              10n,
              [new Uint8Array()],
            ),
            {
              maxTransactionFee: 5n,
              timeout: round + 60n,
              feeCreditRecordId: tokenFeeCreditRecordId,
            },
          ),
        ),
      );
      await waitTransactionProof(tokenClient, createFungibleTokenHash);
      console.log('Creating fungible token successful');
    }, 20000);

    it('Split, burn and join fungible token', async () => {
      const round = await tokenClient.getRoundNumber();
      const token: FungibleToken | null = await tokenClient.getUnit(ftUnitId, false);
      console.log('Splitting fungible token...');
      const splitFungibleTokenHash = await tokenClient.splitFungibleToken(
        {
          token: token!,
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          amount: 3n,
          nonce: null,
          type: { unitId: fttUnitId },
          invariantPredicateSignatures: [new Uint8Array()],
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: tokenFeeCreditRecordId,
        },
      );
      await waitTransactionProof(tokenClient, splitFungibleTokenHash);
      console.log('Fungible token split successful');

      const splitBillProof = await waitTransactionProof(tokenClient, splitFungibleTokenHash);
      const splitTokenId = splitBillProof.transactionRecord.serverMetadata.targetUnits
        .map((bytes) => UnitId.fromBytes(bytes))
        .find(
          (id) =>
            id.type.toBase16() === UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN &&
            Base16Converter.encode(id.bytes) !== Base16Converter.encode(token!.unitId.bytes),
        );
      const splitToken: FungibleToken | null = await tokenClient.getUnit(splitTokenId!, false);
      const originalTokenAfterSplit = await tokenClient.getUnit(ftUnitId, false);

      console.log('Burning fungible token...');
      const burnFungibleTokenHash = await tokenClient.burnFungibleToken(
        {
          token: splitToken!,
          targetToken: originalTokenAfterSplit!,
          type: { unitId: fttUnitId },
          invariantPredicateSignatures: [new Uint8Array()],
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: tokenFeeCreditRecordId,
        },
      );
      await waitTransactionProof(tokenClient, burnFungibleTokenHash);
      console.log('Fungible token burn successful');

      const burnProof: TransactionRecordWithProof<TransactionPayload<BurnFungibleTokenAttributes>> =
        await waitTransactionProof(tokenClient, burnFungibleTokenHash);
      console.log('Joining fungible token...');
      const joinFungibleTokenHash = await tokenClient.joinFungibleTokens(
        {
          proofs: [burnProof],
          token: originalTokenAfterSplit!,
          invariantPredicateSignatures: [new Uint8Array()],
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: tokenFeeCreditRecordId,
        },
      );
      await waitTransactionProof(tokenClient, joinFungibleTokenHash);
      console.log('Fungible token join successful');
    }, 20000);

    it('Transfer fungible token', async () => {
      const round = await tokenClient.getRoundNumber();
      const token: FungibleToken | null = await tokenClient.getUnit(ftUnitId, false);

      console.log('Transferring fungible token...');
      const transferFungibleTokenHash = await tokenClient.transferFungibleToken(
        {
          token: token!,
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          nonce: null,
          type: { unitId: fttUnitId },
          invariantPredicateSignatures: [new Uint8Array()],
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: tokenFeeCreditRecordId,
        },
      );

      await waitTransactionProof(tokenClient, transferFungibleTokenHash);
      console.log('Fungible token transfer successful');
    }, 20000);

    it('Create non fungible token type and non fungible token', async () => {
      const round = await tokenClient.getRoundNumber();
      console.log('Creating non fungible token type...');
      const createNonFungibleTokenTypeHash = await tokenClient.createNonFungibleTokenType(
        {
          type: { unitId: nfttUnitId },
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
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: tokenFeeCreditRecordId,
        },
      );
      await waitTransactionProof(tokenClient, createNonFungibleTokenTypeHash);
      console.log('Creating non fungible token type successful');

      console.log('Creating non fungible token...');
      const createNonFungibleTokenHash = await tokenClient.createNonFungibleToken(
        {
          token: { unitId: nftUnitId },
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          type: { unitId: nfttUnitId },
          name: 'My token',
          uri: 'http://guardtime.com',
          data: await NonFungibleTokenData.create(cborCodec, [
            'user variables as primitives',
            10000,
            [true, new Uint8Array()],
          ]),
          dataUpdatePredicate: new AlwaysTruePredicate(),
          tokenCreationPredicateSignatures: [new Uint8Array()],
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: tokenFeeCreditRecordId,
        },
      );
      await waitTransactionProof(tokenClient, createNonFungibleTokenHash);
      console.log('Creating non fungible token successful');
    }, 20000);

    it('Update and transfer non fungible token', async () => {
      const round = await tokenClient.getRoundNumber();
      const token: NonFungibleToken | null = await tokenClient.getUnit(ftUnitId, false);
      expect(token).not.toBeNull();

      console.log('Updating non fungible token...');
      const updateNonFungibleTokenHash = await tokenClient.updateNonFungibleToken(
        {
          token: token!,
          data: await NonFungibleTokenData.create(cborCodec, [crypto.getRandomValues(new Uint8Array(32))]),
          dataUpdateSignatures: [new Uint8Array(), new Uint8Array()],
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: tokenFeeCreditRecordId,
        },
      );
      await waitTransactionProof(tokenClient, updateNonFungibleTokenHash);
      console.log('Updating non token fungible token successful');

      console.log('Transferring non fungible token...');
      const transferNonFungibleTokenHash = await tokenClient.transferNonFungibleToken(
        {
          token: token!,
          backlink: token!.backlink,
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          nonce: null,
          type: { unitId: nfttUnitId },
          invariantPredicateSignatures: [new Uint8Array()],
        },
        {
          maxTransactionFee: 5n,
          timeout: round + 60n,
          feeCreditRecordId: tokenFeeCreditRecordId,
        },
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
export function waitTransactionProof<T extends ITransactionPayloadAttributes>(
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
        // @ts-expect-error FIXME
        return resolve(proof);
      }

      if (Date.now() > start + timeout) {
        return reject('Timeout');
      }

      setTimeout(poller, interval);
    };

    poller();
  });
}
