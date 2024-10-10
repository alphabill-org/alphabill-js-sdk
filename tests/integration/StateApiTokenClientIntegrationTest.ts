import crypto from 'crypto';
import { randomBytes } from '@noble/hashes/utils';
import { CborCodecNode } from '../../src/codec/cbor/CborCodecNode.js';
import { IUnitId } from '../../src/IUnitId.js';
import { NonFungibleTokenType } from '../../src/NonFungibleTokenType.js';
import { DefaultSigningService } from '../../src/signing/DefaultSigningService.js';
import { createMoneyClient, createTokenClient, http } from '../../src/StateApiClientFactory.js';
import { SystemIdentifier } from '../../src/SystemIdentifier.js';
import { BurnFungibleTokenAttributes } from '../../src/transaction/attribute/BurnFungibleTokenAttributes.js';
import { CreateFungibleTokenAttributes } from '../../src/transaction/attribute/CreateFungibleTokenAttributes.js';
import { CreateNonFungibleTokenAttributes } from '../../src/transaction/attribute/CreateNonFungibleTokenAttributes.js';
import { TransferFeeCreditAttributes } from '../../src/transaction/attribute/TransferFeeCreditAttributes.js';
import { FeeCreditRecordUnitIdFactory } from '../../src/transaction/FeeCreditRecordUnitIdFactory.js';
import { NonFungibleTokenData } from '../../src/transaction/NonFungibleTokenData.js';
import { AlwaysTruePredicate } from '../../src/transaction/predicate/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../src/transaction/predicate/PayToPublicKeyHashPredicate.js';
import { TokenIcon } from '../../src/transaction/TokenIcon.js';
import { TokenUnitIdFactory } from '../../src/transaction/TokenUnitIdFactory.js';
import { TransactionPayload } from '../../src/transaction/TransactionPayload.js';
import { UnitIdWithType } from '../../src/transaction/UnitIdWithType.js';
import { UnitType } from '../../src/transaction/UnitType.js';
import { TransactionRecordWithProof } from '../../src/TransactionRecordWithProof.js';
import { Bill } from '../../src/unit/Bill.js';
import { FeeCreditRecord } from '../../src/unit/FeeCreditRecord.js';
import { FungibleToken } from '../../src/unit/FungibleToken.js';
import { FungibleTokenType } from '../../src/unit/FungibleTokenType.js';
import { NonFungibleToken } from '../../src/unit/NonFungibleToken.js';
import { UnitId } from '../../src/UnitId.js';
import { Base16Converter } from '../../src/util/Base16Converter.js';
import config from './config/config.js';
import { createMetadata, waitTransactionProof } from './utils/TestUtils.js';

describe('Token Client Integration Tests', () => {
  const cborCodec = new CborCodecNode();
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const tokenUnitIdFactory = new TokenUnitIdFactory(cborCodec);
  const feeCreditRecordUnitIdFactory = new FeeCreditRecordUnitIdFactory();

  const tokenClient = createTokenClient({
    transport: http(config.tokenPartitionUrl, new CborCodecNode()),
    tokenUnitIdFactory,
  });

  let feeCreditRecordId: UnitIdWithType; // can no longer be static as hash contains timeout

  it('Add fee credit', async () => {
    const moneyClient = createMoneyClient({
      transport: http(config.moneyPartitionUrl, new CborCodecNode()),
      feeCreditRecordUnitIdFactory,
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
    const ownerPredicate = await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey);

    console.log('Transferring to fee credit...');
    const transferToFeeCreditHash = await moneyClient.transferToFeeCredit(
      {
        bill: bill,
        amount: amountToFeeCredit,
        systemIdentifier: SystemIdentifier.TOKEN_PARTITION,
        feeCreditRecordParams: {
          ownerPredicate: ownerPredicate,
          unitType: UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD,
        },
        latestAdditionTime: round + 60n,
      },
      createMetadata(round),
    );
    const proof: TransactionRecordWithProof<TransferFeeCreditAttributes> = await waitTransactionProof(
      moneyClient,
      transferToFeeCreditHash,
    );
    console.log('Transfer to fee credit successful');

    const attr = proof.transactionRecord.transactionOrder.payload as TransactionPayload<TransferFeeCreditAttributes>;
    feeCreditRecordId = new UnitIdWithType(
      attr.attributes.targetUnitId.bytes,
      UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD,
    );
    const feeCreditRecord: FeeCreditRecord | null = await tokenClient.getUnit(feeCreditRecordId, false);

    console.log('Adding fee credit');
    const addFeeCreditHash = await tokenClient.addFeeCredit(
      {
        ownerPredicate: ownerPredicate,
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
      const tokenType = (await tokenClient.getUnit(tokenTypeUnitId, false)) as FungibleTokenType;
      expect(tokenType).not.toBeNull();
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

      const burnProof: TransactionRecordWithProof<BurnFungibleTokenAttributes> = await waitTransactionProof(
        tokenClient,
        burnFungibleTokenHash,
      );
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

    it('Lock and unlock', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = (await tokenClient.getUnit(tokenUnitId, false)) as FungibleToken;

      console.log('Locking fungible token...');
      const lockFungibleTokenHash = await tokenClient.lockToken(
        {
          status: 5n,
          unit: { unitId: token.unitId, counter: token.counter },
          invariantPredicateSignatures: [new Uint8Array()],
        },
        createMetadata(round, feeCreditRecordId),
      );
      await waitTransactionProof(tokenClient, lockFungibleTokenHash);
      console.log('Fungible token lock successful');

      console.log('Unlocking fungible token...');
      const unlockFungibleTokenHash = await tokenClient.unlockToken(
        {
          unit: { unitId: token.unitId, counter: token.counter + 1n },
          invariantPredicateSignatures: [new Uint8Array()],
        },
        createMetadata(round, feeCreditRecordId),
      );
      await waitTransactionProof(tokenClient, unlockFungibleTokenHash);
      console.log('Fungible token unlock successful');
    }, 20000);
  });

  describe('Non-fungible Token Integration Tests', () => {
    const tokenTypeUnitId = new UnitIdWithType(randomBytes(12), UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN_TYPE);
    let tokenUnitId: IUnitId;

    it('Create token type and token', async () => {
      const round = await tokenClient.getRoundNumber();
      console.log('Creating non-fungible token type...');
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
      const tokenType = (await tokenClient.getUnit(tokenTypeUnitId, false)) as NonFungibleTokenType;
      expect(tokenType).not.toBeNull();
      console.log('Creating non-fungible token type successful');

      console.log('Creating non-fungible token...');
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
      console.log('Creating non-fungible token successful');
    }, 20000);

    it('Update', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = (await tokenClient.getUnit(tokenUnitId, false)) as NonFungibleToken;
      expect(token).not.toBeNull();

      console.log('Updating non-fungible token...');
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
    }, 20000);

    it('Transfer', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = (await tokenClient.getUnit(tokenUnitId, false)) as NonFungibleToken;
      expect(token).not.toBeNull();

      console.log('Transferring non-fungible token...');
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
