import crypto from 'crypto';
import { randomBytes } from '@noble/hashes/utils';
import { CborCodecNode } from '../../../src/codec/cbor/CborCodecNode.js';
import { AddFeeCreditTransactionRecordWithProof } from '../../../src/fees/transactions/records/AddFeeCreditTransactionRecordWithProof.js';
import { IUnitId } from '../../../src/IUnitId.js';
import { DefaultSigningService } from '../../../src/signing/DefaultSigningService.js';
import { createMoneyClient, createTokenClient, http } from '../../../src/StateApiClientFactory.js';
import { SystemIdentifier } from '../../../src/SystemIdentifier.js';
import { FungibleToken } from '../../../src/tokens/FungibleToken.js';
import { FungibleTokenType } from '../../../src/tokens/FungibleTokenType.js';
import { NonFungibleToken } from '../../../src/tokens/NonFungibleToken.js';
import { NonFungibleTokenData } from '../../../src/tokens/NonFungibleTokenData.js';
import { NonFungibleTokenType } from '../../../src/tokens/NonFungibleTokenType.js';
import { TokenIcon } from '../../../src/tokens/TokenIcon.js';
import { TokenPartitionUnitType } from '../../../src/tokens/TokenPartitionUnitType.js';
import { BurnFungibleTokenTransactionRecordWithProof } from '../../../src/tokens/transactions/BurnFungibleTokenTransactionRecordWithProof.js';
import { CreateFungibleTokenTransactionRecordWithProof } from '../../../src/tokens/transactions/CreateFungibleTokenTransactionRecordWithProof.js';
import { CreateFungibleTokenTypeTransactionRecordWithProof } from '../../../src/tokens/transactions/CreateFungibleTokenTypeTransactionRecordWithProof.js';
import { CreateNonFungibleTokenTransactionRecordWithProof } from '../../../src/tokens/transactions/CreateNonFungibleTokenTransactionRecordWithProof.js';
import { CreateNonFungibleTokenTypeTransactionRecordWithProof } from '../../../src/tokens/transactions/CreateNonFungibleTokenTypeTransactionRecordWithProof.js';
import { JoinFungibleTokenTransactionRecordWithProof } from '../../../src/tokens/transactions/JoinFungibleTokenTransactionRecordWithProof.js';
import { LockTokenTransactionRecordWithProof } from '../../../src/tokens/transactions/LockTokenTransactionRecordWithProof.js';
import { SplitFungibleTokenTransactionRecordWithProof } from '../../../src/tokens/transactions/SplitFungibleTokenTransactionRecordWithProof.js';
import { TransferFungibleTokenTransactionRecordWithProof } from '../../../src/tokens/transactions/TransferFungibleTokenTransactionRecordWithProof.js';
import { TransferNonFungibleTokenTransactionRecordWithProof } from '../../../src/tokens/transactions/TransferNonFungibleTokenTransactionRecordWithProof.js';
import { UnlockTokenTransactionRecordWithProof } from '../../../src/tokens/transactions/UnlockTokenTransactionRecordWithProof.js';
import { UnsignedBurnFungibleTokenTransactionOrder } from '../../../src/tokens/transactions/UnsignedBurnFungibleTokenTransactionOrder.js';
import { UnsignedCreateFungibleTokenTransactionOrder } from '../../../src/tokens/transactions/UnsignedCreateFungibleTokenTransactionOrder.js';
import { UnsignedCreateFungibleTokenTypeTransactionOrder } from '../../../src/tokens/transactions/UnsignedCreateFungibleTokenTypeTransactionOrder.js';
import { UnsignedCreateNonFungibleTokenTransactionOrder } from '../../../src/tokens/transactions/UnsignedCreateNonFungibleTokenTransactionOrder.js';
import { UnsignedCreateNonFungibleTokenTypeTransactionOrder } from '../../../src/tokens/transactions/UnsignedCreateNonFungibleTokenTypeTransactionOrder.js';
import { UnsignedJoinFungibleTokenTransactionOrder } from '../../../src/tokens/transactions/UnsignedJoinFungibleTokenTransactionOrder.js';
import { UnsignedLockTokenTransactionOrder } from '../../../src/tokens/transactions/UnsignedLockTokenTransactionOrder.js';
import { UnsignedSplitFungibleTokenTransactionOrder } from '../../../src/tokens/transactions/UnsignedSplitFungibleTokenTransactionOrder.js';
import { UnsignedTransferFungibleTokenTransactionOrder } from '../../../src/tokens/transactions/UnsignedTransferFungibleTokenTransactionOrder.js';
import { UnsignedTransferNonFungibletokenTransactionOrder } from '../../../src/tokens/transactions/UnsignedTransferNonFungibletokenTransactionOrder.js';
import { UnsignedUnlockTokenTransactionOrder } from '../../../src/tokens/transactions/UnsignedUnlockTokenTransactionOrder.js';
import { UnsignedUpdateNonFungibleTokenTransactionOrder } from '../../../src/tokens/transactions/UnsignedUpdateNonFungibleTokenTransactionOrder.js';
import { UpdateNonFungibleTokenTransactionRecordWithProof } from '../../../src/tokens/transactions/UpdateNonFungibleTokenTransactionRecordWithProof.js';
import { AlwaysTruePredicate } from '../../../src/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../../src/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { AlwaysTrueProofFactory } from '../../../src/transaction/proofs/AlwaysTrueProofFactory.js';
import { PayToPublicKeyHashProofFactory } from '../../../src/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../../src/transaction/record/TransactionStatus.js';
import { UnitIdWithType } from '../../../src/transaction/UnitIdWithType.js';
import { areUint8ArraysEqual } from '../../../src/util/ArrayUtils.js';
import { Base16Converter } from '../../../src/util/Base16Converter.js';
import config from '../config/config.js';
import { addFeeCredit, createTransactionData } from '../utils/TestUtils.js';

describe('Token Client Integration Tests', () => {
  const cborCodec = new CborCodecNode();
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const proofFactory = new PayToPublicKeyHashProofFactory(signingService, cborCodec);
  const alwaysTrueProofFactory = new AlwaysTrueProofFactory(cborCodec);
  const ownerPredicate = PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey);

  const tokenClient = createTokenClient({
    transport: http(config.tokenPartitionUrl, new CborCodecNode()),
  });

  let feeCreditRecordId: IUnitId; // can no longer be static as hash contains timeout

  it('Add fee credit', async () => {
    const moneyClient = createMoneyClient({
      transport: http(config.moneyPartitionUrl, new CborCodecNode()),
    });

    const addFeeCreditHash = await addFeeCredit(
      moneyClient,
      tokenClient,
      SystemIdentifier.TOKEN_PARTITION,
      signingService.publicKey,
      cborCodec,
      proofFactory,
    );

    const proof = await tokenClient.waitTransactionProof(addFeeCreditHash, AddFeeCreditTransactionRecordWithProof);
    expect(proof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Adding fee credit successful');
    feeCreditRecordId = proof.transactionRecord.transactionOrder.payload.unitId;
  }, 20000);

  describe('Fungible Token Integration Tests', () => {
    const tokenTypeUnitId = new UnitIdWithType(randomBytes(12), TokenPartitionUnitType.FUNGIBLE_TOKEN_TYPE);
    let tokenUnitId: IUnitId;

    it('Create token type and token', async () => {
      const round = await tokenClient.getRoundNumber();
      console.log('Creating fungible token type...');

      const createFungibleTokenTypeTransactionOrder = await UnsignedCreateFungibleTokenTypeTransactionOrder.create(
        {
          type: { unitId: tokenTypeUnitId },
          symbol: 'E',
          name: 'Big money come',
          icon: new TokenIcon('image/png', new Uint8Array()),
          parentTypeId: null,
          decimalPlaces: 8,
          subTypeCreationPredicate: new AlwaysTruePredicate(),
          tokenMintingPredicate: new AlwaysTruePredicate(),
          tokenTypeOwnerPredicate: new AlwaysTruePredicate(),
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(proofFactory, []));

      const createFungibleTokenTypeHash = await tokenClient.sendTransaction(createFungibleTokenTypeTransactionOrder);

      const createFungibleTokenTypeProof = await tokenClient.waitTransactionProof(
        createFungibleTokenTypeHash,
        CreateFungibleTokenTypeTransactionRecordWithProof,
      );
      expect(createFungibleTokenTypeProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );

      const tokenType = await tokenClient.getUnit(tokenTypeUnitId, false, FungibleTokenType);
      expect(tokenType).not.toBeNull();
      console.log('Creating fungible token type successful');

      console.log('Creating fungible token...');
      const createFungibleTokenTransactionOrder = await UnsignedCreateFungibleTokenTransactionOrder.create(
        {
          ownerPredicate: await ownerPredicate,
          type: { unitId: tokenTypeUnitId },
          value: 10n,
          nonce: 0n,
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(alwaysTrueProofFactory, proofFactory));

      const createFungibleTokenHash = await tokenClient.sendTransaction(createFungibleTokenTransactionOrder);
      const createFungibleTokenProof = await tokenClient.waitTransactionProof(
        createFungibleTokenHash,
        CreateFungibleTokenTransactionRecordWithProof,
      );

      expect(createFungibleTokenProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );

      tokenUnitId = createFungibleTokenProof.transactionRecord.transactionOrder.payload.unitId;

      console.log('Creating fungible token successful');
    }, 20000);

    it('Split, burn and join', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = await tokenClient.getUnit(tokenUnitId, false, FungibleToken);
      expect(token).not.toBeNull();

      console.log('Splitting fungible token...');
      const splitFungibleTokenTransactionOrder = await UnsignedSplitFungibleTokenTransactionOrder.create(
        {
          token: token!,
          ownerPredicate: await ownerPredicate,
          amount: 3n,
          type: { unitId: tokenTypeUnitId },
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(proofFactory, proofFactory, [alwaysTrueProofFactory]));

      const splitFungibleTokenHash = await tokenClient.sendTransaction(splitFungibleTokenTransactionOrder);

      const splitBillProof = await tokenClient.waitTransactionProof(
        splitFungibleTokenHash,
        SplitFungibleTokenTransactionRecordWithProof,
      );
      expect(splitBillProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
      console.log('Fungible token split successful');

      const splitTokenId = splitBillProof.transactionRecord.serverMetadata.targetUnits.find(
        (id) =>
          areUint8ArraysEqual(id.type, TokenPartitionUnitType.FUNGIBLE_TOKEN) &&
          Base16Converter.encode(id.bytes) !== Base16Converter.encode(token!.unitId.bytes),
      );
      expect(splitTokenId).not.toBeFalsy();

      const splitToken = await tokenClient.getUnit(splitTokenId!, false, FungibleToken);
      const originalTokenAfterSplit = await tokenClient.getUnit(tokenUnitId, false, FungibleToken);

      console.log('Burning fungible token...');
      const burnFungibleTokenHash = await tokenClient.sendTransaction(
        await UnsignedBurnFungibleTokenTransactionOrder.create(
          {
            type: { unitId: tokenTypeUnitId },
            token: splitToken!,
            targetToken: originalTokenAfterSplit!,
            ...createTransactionData(round, feeCreditRecordId),
          },
          cborCodec,
        ).then((transactionOrder) => transactionOrder.sign(proofFactory, proofFactory, [alwaysTrueProofFactory])),
      );

      const burnProof = await tokenClient.waitTransactionProof(
        burnFungibleTokenHash,
        BurnFungibleTokenTransactionRecordWithProof,
      );
      expect(burnProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
      console.log('Fungible token burn successful');

      console.log('Joining fungible token...');
      const joinFungibleTokenTransactionOrder = await UnsignedJoinFungibleTokenTransactionOrder.create(
        {
          token: originalTokenAfterSplit!,
          proofs: [burnProof],
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(proofFactory, proofFactory, [alwaysTrueProofFactory]));

      const joinFungibleTokenHash = await tokenClient.sendTransaction(joinFungibleTokenTransactionOrder);

      const joinProof = await tokenClient.waitTransactionProof(
        joinFungibleTokenHash,
        JoinFungibleTokenTransactionRecordWithProof,
      );
      expect(joinProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
      console.log('Fungible token join successful');
    }, 20000);

    it('Transfer', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = await tokenClient.getUnit(tokenUnitId, false, FungibleToken);
      expect(token).not.toBeNull();

      console.log('Transferring fungible token...');
      const transferFungibleTokenTransactionOrder = await UnsignedTransferFungibleTokenTransactionOrder.create(
        {
          token: token!,
          ownerPredicate: await ownerPredicate,
          type: { unitId: tokenTypeUnitId },
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(proofFactory, proofFactory, [alwaysTrueProofFactory]));

      const transferFungibleTokenHash = await tokenClient.sendTransaction(transferFungibleTokenTransactionOrder);

      const transferProof = await tokenClient.waitTransactionProof(
        transferFungibleTokenHash,
        TransferFungibleTokenTransactionRecordWithProof,
      );
      expect(transferProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
      console.log('Fungible token transfer successful');
    }, 20000);

    it('Lock and unlock', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = await tokenClient.getUnit(tokenUnitId, false, FungibleToken);
      expect(token).not.toBeNull();

      console.log('Locking fungible token...');
      const lockFungibleTokenTransactionOrder = await UnsignedLockTokenTransactionOrder.create(
        {
          status: 5n,
          token: token!,
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(proofFactory, proofFactory));

      const lockFungibleTokenHash = await tokenClient.sendTransaction(lockFungibleTokenTransactionOrder);

      const lockProof = await tokenClient.waitTransactionProof(
        lockFungibleTokenHash,
        LockTokenTransactionRecordWithProof,
      );
      expect(lockProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
      console.log('Fungible token lock successful');

      console.log('Unlocking fungible token...');
      const unlockFungibleTokenTransactionOrder = await UnsignedUnlockTokenTransactionOrder.create(
        {
          token: {
            unitId: token!.unitId,
            counter: token!.counter + 1n,
          },
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(proofFactory, proofFactory));

      const unlockFungibleTokenHash = await tokenClient.sendTransaction(unlockFungibleTokenTransactionOrder);

      const unlockProof = await tokenClient.waitTransactionProof(
        unlockFungibleTokenHash,
        UnlockTokenTransactionRecordWithProof,
      );
      expect(unlockProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
      console.log('Fungible token unlock successful');
    }, 20000);
  });

  describe('Non-fungible Token Integration Tests', () => {
    const tokenTypeUnitId = new UnitIdWithType(randomBytes(12), TokenPartitionUnitType.NON_FUNGIBLE_TOKEN_TYPE);
    let tokenUnitId: IUnitId;

    it('Create token type and token', async () => {
      const round = await tokenClient.getRoundNumber();
      console.log('Creating non-fungible token type...');
      const createNonFungibleTokenTypeTransactionOrder =
        await UnsignedCreateNonFungibleTokenTypeTransactionOrder.create(
          {
            type: { unitId: tokenTypeUnitId },
            symbol: 'E',
            name: 'Token Name',
            icon: { type: 'image/png', data: new Uint8Array() },
            parentTypeId: null,
            subTypeCreationPredicate: new AlwaysTruePredicate(),
            tokenMintingPredicate: new AlwaysTruePredicate(),
            tokenTypeOwnerPredicate: new AlwaysTruePredicate(),
            dataUpdatePredicate: new AlwaysTruePredicate(),
            ...createTransactionData(round, feeCreditRecordId),
          },
          cborCodec,
        ).then((transactionOrder) => transactionOrder.sign(proofFactory, []));

      const createNonFungibleTokenTypeHash = await tokenClient.sendTransaction(
        createNonFungibleTokenTypeTransactionOrder,
      );

      const createNonFungibleTokenTypeProof = await tokenClient.waitTransactionProof(
        createNonFungibleTokenTypeHash,
        CreateNonFungibleTokenTypeTransactionRecordWithProof,
      );
      expect(createNonFungibleTokenTypeProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );
      const tokenType = await tokenClient.getUnit(tokenTypeUnitId, false, NonFungibleTokenType);
      expect(tokenType).not.toBeNull();
      console.log('Creating non-fungible token type successful');

      console.log('Creating non-fungible token...');
      const createNonFungibleTokenTransactionOrder = await UnsignedCreateNonFungibleTokenTransactionOrder.create(
        {
          ownerPredicate: await ownerPredicate,
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
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(alwaysTrueProofFactory, proofFactory));

      const createNonFungibleTokenHash = await tokenClient.sendTransaction(createNonFungibleTokenTransactionOrder);

      const createNonFungibleTokenProof = await tokenClient.waitTransactionProof(
        createNonFungibleTokenHash,
        CreateNonFungibleTokenTransactionRecordWithProof,
      );
      expect(createNonFungibleTokenProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );
      tokenUnitId = createNonFungibleTokenProof.transactionRecord.transactionOrder.payload.unitId;
      console.log('Creating non-fungible token successful');
    }, 20000);

    it('Update', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = await tokenClient.getUnit(tokenUnitId, false, NonFungibleToken);
      expect(token).not.toBeNull();

      console.log('Updating non-fungible token...');
      const updateNonFungibleTokenTransactionOrder = await UnsignedUpdateNonFungibleTokenTransactionOrder.create(
        {
          token: token!,
          data: await NonFungibleTokenData.create(cborCodec, [crypto.getRandomValues(new Uint8Array(32))]),
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) =>
        transactionOrder.sign(alwaysTrueProofFactory, proofFactory, [alwaysTrueProofFactory]),
      );

      const updateNonFungibleTokenHash = await tokenClient.sendTransaction(updateNonFungibleTokenTransactionOrder);

      const updateNonFungibleTokenProof = await tokenClient.waitTransactionProof(
        updateNonFungibleTokenHash,
        UpdateNonFungibleTokenTransactionRecordWithProof,
      );

      expect(updateNonFungibleTokenProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );
      console.log('Updating non token fungible token successful');
    }, 20000);

    it('Transfer', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = await tokenClient.getUnit(tokenUnitId, false, NonFungibleToken);
      expect(token).not.toBeNull();

      console.log('Transferring non-fungible token...');
      const transferNonFungibleTokenTransactionOrder = await UnsignedTransferNonFungibletokenTransactionOrder.create(
        {
          token: token!,
          counter: token!.counter,
          ownerPredicate: await ownerPredicate,
          nonce: null,
          type: { unitId: tokenTypeUnitId },
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(proofFactory, proofFactory, [alwaysTrueProofFactory]));

      const transferNonFungibleTokenHash = await tokenClient.sendTransaction(transferNonFungibleTokenTransactionOrder);

      const transferNonFungibleTokenProof = await tokenClient.waitTransactionProof(
        transferNonFungibleTokenHash,
        TransferNonFungibleTokenTransactionRecordWithProof,
      );
      expect(transferNonFungibleTokenProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );
      console.log('Transferring non token fungible token successful');
    }, 20000);
  });
});
