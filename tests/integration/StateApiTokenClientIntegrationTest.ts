import crypto from 'crypto';
import assert from 'node:assert';
import { randomBytes } from '@noble/hashes/utils';
import { CborCodecNode } from '../../src/codec/cbor/CborCodecNode.js';
import { IUnitId } from '../../src/IUnitId.js';
import { DefaultSigningService } from '../../src/signing/DefaultSigningService.js';
import { createMoneyClient, createTokenClient, http } from '../../src/StateApiClientFactory.js';
import { SystemIdentifier } from '../../src/SystemIdentifier.js';
import { MoneyPartitionUnitType } from '../../src/transaction/MoneyPartitionUnitType.js';
import { NonFungibleTokenData } from '../../src/transaction/NonFungibleTokenData.js';
import { UnsignedAddFeeCreditTransactionOrder } from '../../src/transaction/order/UnsignedAddFeeCreditTransactionOrder.js';
import { UnsignedBurnFungibleTokenTransactionOrder } from '../../src/transaction/order/UnsignedBurnFungibleTokenTransactionOrder.js';
import { UnsignedCreateFungibleTokenTransactionOrder } from '../../src/transaction/order/UnsignedCreateFungibleTokenTransactionOrder.js';
import { UnsignedCreateFungibleTokenTypeTransactionOrder } from '../../src/transaction/order/UnsignedCreateFungibleTokenTypeTransactionOrder.js';
import { UnsignedCreateNonFungibleTokenTransactionOrder } from '../../src/transaction/order/UnsignedCreateNonFungibleTokenTransactionOrder.js';
import { UnsignedCreateNonFungibleTokenTypeTransactionOrder } from '../../src/transaction/order/UnsignedCreateNonFungibleTokenTypeTransactionOrder.js';
import { UnsignedJoinFungibleTokenTransactionOrder } from '../../src/transaction/order/UnsignedJoinFungibleTokenTransactionOrder.js';
import { UnsignedLockTokenTransactionOrder } from '../../src/transaction/order/UnsignedLockTokenTransactionOrder.js';
import { UnsignedSplitFungibleTokenTransactionOrder } from '../../src/transaction/order/UnsignedSplitFungibleTokenTransactionOrder.js';
import { UnsignedTransferFeeCreditTransactionOrder } from '../../src/transaction/order/UnsignedTransferFeeCreditTransactionOrder.js';
import { UnsignedTransferFungibleTokenTransactionOrder } from '../../src/transaction/order/UnsignedTransferFungibleTokenTransactionOrder.js';
import { UnsignedTransferNonFungibletokenTransactionOrder } from '../../src/transaction/order/UnsignedTransferNonFungibletokenTransactionOrder.js';
import { UnsignedUnlockTokenTransactionOrder } from '../../src/transaction/order/UnsignedUnlockTokenTransactionOrder.js';
import { UnsignedUpdateNonFungibleTokenTransactionOrder } from '../../src/transaction/order/UnsignedUpdateNonFungibleTokenTransactionOrder.js';
import { AlwaysTruePredicate } from '../../src/transaction/predicate/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../src/transaction/predicate/PayToPublicKeyHashPredicate.js';
import { AddFeeCreditTransactionRecordWithProof } from '../../src/transaction/record/AddFeeCreditTransactionRecordWithProof.js';
import { BurnFungibleTokenTransactionRecordWithProof } from '../../src/transaction/record/BurnFungibleTokenTransactionRecordWithProof.js';
import { CreateFungibleTokenTransactionRecordWithProof } from '../../src/transaction/record/CreateFungibleTokenTransactionRecordWithProof.js';
import { CreateFungibleTokenTypeTransactionRecordWithProof } from '../../src/transaction/record/CreateFungibleTokenTypeTransactionRecordWithProof.js';
import { CreateNonFungibleTokenTransactionRecordWithProof } from '../../src/transaction/record/CreateNonFungibleTokenTransactionRecordWithProof.js';
import { CreateNonFungibleTokenTypeTransactionRecordWithProof } from '../../src/transaction/record/CreateNonFungibleTokenTypeTransactionRecordWithProof.js';
import { JoinFungibleTokenTransactionRecordWithProof } from '../../src/transaction/record/JoinFungibleTokenTransactionRecordWithProof.js';
import { LockTokenTransactionRecordWithProof } from '../../src/transaction/record/LockTokenTransactionRecordWithProof.js';
import { SplitFungibleTokenTransactionRecordWithProof } from '../../src/transaction/record/SplitFungibleTokenTransactionRecordWithProof.js';
import { TransferFeeCreditTransactionRecordWithProof } from '../../src/transaction/record/TransferFeeCreditTransactionRecordWithProof.js';
import { TransferFungibleTokenTransactionRecordWithProof } from '../../src/transaction/record/TransferFungibleTokenTransactionRecordWithProof.js';
import { TransferNonFungibleTokenTransactionRecordWithProof } from '../../src/transaction/record/TransferNonFungibleTokenTransactionRecordWithProof.js';
import { UnlockTokenTransactionRecordWithProof } from '../../src/transaction/record/UnlockTokenTransactionRecordWithProof.js';
import { UpdateNonFungibleTokenTransactionRecordWithProof } from '../../src/transaction/record/UpdateNonFungibleTokenTransactionRecordWithProof.js';
import { TokenIcon } from '../../src/transaction/TokenIcon.js';
import { TokenPartitionUnitType } from '../../src/transaction/TokenPartitionUnitType.js';
import { UnitIdWithType } from '../../src/transaction/UnitIdWithType.js';
import { Bill } from '../../src/unit/Bill.js';
import { FeeCreditRecord } from '../../src/unit/FeeCreditRecord.js';
import { FungibleToken } from '../../src/unit/FungibleToken.js';
import { FungibleTokenType } from '../../src/unit/FungibleTokenType.js';
import { NonFungibleToken } from '../../src/unit/NonFungibleToken.js';
import { NonFungibleTokenType } from '../../src/unit/NonFungibleTokenType.js';
import { UnitId } from '../../src/UnitId.js';
import { Base16Converter } from '../../src/util/Base16Converter.js';
import config from './config/config.js';
import { createTransactionData } from './utils/TestUtils.js';

describe('Token Client Integration Tests', () => {
  const cborCodec = new CborCodecNode();
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));

  const tokenClient = createTokenClient({
    transport: http(config.tokenPartitionUrl, new CborCodecNode()),
  });

  let feeCreditRecordId: UnitIdWithType; // can no longer be static as hash contains timeout

  it('Add fee credit', async () => {
    const moneyClient = createMoneyClient({
      transport: http(config.moneyPartitionUrl, new CborCodecNode()),
    });

    const unitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === Base16Converter.encode(new Uint8Array([MoneyPartitionUnitType.BILL])),
    );
    expect(unitIds.length).toBeGreaterThan(0);

    const bill = await moneyClient.getUnit(unitIds[0], false, Bill);
    assert(bill, 'No bill found.');

    const amountToFeeCredit = 100n;
    expect(bill.value).toBeGreaterThan(amountToFeeCredit);

    const round = await tokenClient.getRoundNumber();
    const ownerPredicate = await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey);

    console.log('Transferring to fee credit...');
    const transferFeeCreditTransactionOrder = await UnsignedTransferFeeCreditTransactionOrder.create(
      {
        amount: amountToFeeCredit,
        targetSystemIdentifier: SystemIdentifier.TOKEN_PARTITION,
        latestAdditionTime: round + 60n,
        feeCreditRecord: {
          ownerPredicate: ownerPredicate,
          unitType: TokenPartitionUnitType.FEE_CREDIT_RECORD,
        },
        bill,
        ...createTransactionData(round),
      },
      cborCodec,
    ).then((transactionOrder) => transactionOrder.sign(signingService, signingService));

    const transferFeeCreditHash = await moneyClient.sendTransaction(transferFeeCreditTransactionOrder);

    const proof = await moneyClient.waitTransactionProof(
      transferFeeCreditHash,
      TransferFeeCreditTransactionRecordWithProof,
    );

    console.log('Transfer to fee credit successful');
    feeCreditRecordId = new UnitIdWithType(
      transferFeeCreditTransactionOrder.payload.attributes.targetUnitId.bytes,
      TokenPartitionUnitType.FEE_CREDIT_RECORD,
    );
    const feeCreditRecord = await tokenClient.getUnit(feeCreditRecordId, false, FeeCreditRecord);

    console.log('Adding fee credit');
    const addFeeCreditTransactionOrder = await UnsignedAddFeeCreditTransactionOrder.create(
      {
        ownerPredicate: ownerPredicate,
        proof,
        feeCreditRecord: feeCreditRecord || { unitId: feeCreditRecordId },
        ...createTransactionData(round),
      },
      cborCodec,
    ).then((transactionOrder) => transactionOrder.sign(signingService, signingService));

    const addFeeCreditHash = await moneyClient.sendTransaction(addFeeCreditTransactionOrder);

    await tokenClient.waitTransactionProof(addFeeCreditHash, AddFeeCreditTransactionRecordWithProof);
    console.log('Adding fee credit successful');
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
          tokenCreationPredicate: new AlwaysTruePredicate(),
          tokenTypeOwnerPredicate: new AlwaysTruePredicate(),
          ...createTransactionData(round),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(signingService, [signingService]));

      const createFungibleTokenTypeHash = await tokenClient.sendTransaction(createFungibleTokenTypeTransactionOrder);

      await tokenClient.waitTransactionProof(
        createFungibleTokenTypeHash,
        CreateFungibleTokenTypeTransactionRecordWithProof,
      );
      const tokenType = await tokenClient.getUnit(tokenTypeUnitId, false, FungibleTokenType);
      expect(tokenType).not.toBeNull();
      console.log('Creating fungible token type successful');

      console.log('Creating fungible token...');
      const createFungibleTokenTransactionOrder = await UnsignedCreateFungibleTokenTransactionOrder.create(
        {
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          type: { unitId: tokenTypeUnitId },
          value: 10n,
          nonce: 0n,
          ...createTransactionData(round),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(signingService, signingService));

      const createFungibleTokenHash = await tokenClient.sendTransaction(createFungibleTokenTransactionOrder);

      const createFungibleTokenProof = await tokenClient.waitTransactionProof(
        createFungibleTokenHash,
        CreateFungibleTokenTransactionRecordWithProof,
      );
      tokenUnitId = createFungibleTokenProof.transactionRecord.transactionOrder.payload.unitId;
      console.log('Creating fungible token successful');
    }, 20000);

    it('Split, burn and join', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = await tokenClient.getUnit(tokenUnitId, false, FungibleToken);
      console.log('Splitting fungible token...');
      const splitFungibleTokenTransactionOrder = await UnsignedSplitFungibleTokenTransactionOrder.create(
        {
          token: token!,
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          amount: 3n,
          type: { unitId: tokenTypeUnitId },
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(signingService, signingService, [signingService]));

      const splitFungibleTokenHash = await tokenClient.sendTransaction(splitFungibleTokenTransactionOrder);

      const splitBillProof = await tokenClient.waitTransactionProof(
        splitFungibleTokenHash,
        SplitFungibleTokenTransactionRecordWithProof,
      );
      console.log('Fungible token split successful');

      const splitTokenId = splitBillProof.transactionRecord.serverMetadata.targetUnits
        .map((bytes) => UnitId.fromBytes(bytes))
        .find(
          (id) =>
            id.type.toBase16() === Base16Converter.encode(new Uint8Array([TokenPartitionUnitType.FUNGIBLE_TOKEN])) &&
            Base16Converter.encode(id.bytes) !== Base16Converter.encode(token!.unitId.bytes),
        ) as IUnitId;
      const splitToken = await tokenClient.getUnit(splitTokenId, false, FungibleToken);
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
        ).then((transactionOrder) => transactionOrder.sign(signingService, signingService, [signingService])),
      );

      const burnProof = await tokenClient.waitTransactionProof(
        burnFungibleTokenHash,
        BurnFungibleTokenTransactionRecordWithProof,
      );
      console.log('Fungible token burn successful');

      console.log('Joining fungible token...');
      const joinFungibleTokenTransactionOrder = await UnsignedJoinFungibleTokenTransactionOrder.create(
        {
          token: originalTokenAfterSplit!,
          proofs: [burnProof],
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(signingService, signingService, [signingService]));

      const joinFungibleTokenHash = await tokenClient.sendTransaction(joinFungibleTokenTransactionOrder);

      await tokenClient.waitTransactionProof(joinFungibleTokenHash, JoinFungibleTokenTransactionRecordWithProof);
      console.log('Fungible token join successful');
    }, 20000);

    it('Transfer', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = await tokenClient.getUnit(tokenUnitId, false, FungibleToken);

      console.log('Transferring fungible token...');
      const transferFungibleTokenTransactionOrder = await UnsignedTransferFungibleTokenTransactionOrder.create(
        {
          token: token!,
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          type: { unitId: tokenTypeUnitId },
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(signingService, signingService, [signingService]));

      const transferFungibleTokenHash = await tokenClient.sendTransaction(transferFungibleTokenTransactionOrder);

      await tokenClient.waitTransactionProof(
        transferFungibleTokenHash,
        TransferFungibleTokenTransactionRecordWithProof,
      );
      console.log('Fungible token transfer successful');
    }, 20000);

    it('Lock and unlock', async () => {
      const round = await tokenClient.getRoundNumber();
      const token = await tokenClient.getUnit(tokenUnitId, false, FungibleToken);

      console.log('Locking fungible token...');
      const lockFungibleTokenTransactionOrder = await UnsignedLockTokenTransactionOrder.create(
        {
          status: 5n,
          token: token!,
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(signingService, signingService));

      const lockFungibleTokenHash = await tokenClient.sendTransaction(lockFungibleTokenTransactionOrder);

      await tokenClient.waitTransactionProof(lockFungibleTokenHash, LockTokenTransactionRecordWithProof);
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
      ).then((transactionOrder) => transactionOrder.sign(signingService, signingService));

      const unlockFungibleTokenHash = await tokenClient.sendTransaction(unlockFungibleTokenTransactionOrder);

      await tokenClient.waitTransactionProof(unlockFungibleTokenHash, UnlockTokenTransactionRecordWithProof);
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
            tokenCreationPredicate: new AlwaysTruePredicate(),
            tokenTypeOwnerPredicate: new AlwaysTruePredicate(),
            dataUpdatePredicate: new AlwaysTruePredicate(),
            ...createTransactionData(round, feeCreditRecordId),
          },
          cborCodec,
        ).then((transactionOrder) => transactionOrder.sign(signingService, [signingService]));

      const createNonFungibleTokenTypeHash = await tokenClient.sendTransaction(
        createNonFungibleTokenTypeTransactionOrder,
      );

      await tokenClient.waitTransactionProof(
        createNonFungibleTokenTypeHash,
        CreateNonFungibleTokenTypeTransactionRecordWithProof,
      );
      const tokenType = await tokenClient.getUnit(tokenTypeUnitId, false, NonFungibleTokenType);
      expect(tokenType).not.toBeNull();
      console.log('Creating non-fungible token type successful');

      console.log('Creating non-fungible token...');
      const createNonFungibleTokenTransactionOrder = await UnsignedCreateNonFungibleTokenTransactionOrder.create(
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
          ...createTransactionData(round, feeCreditRecordId),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(signingService, signingService));

      const createNonFungibleTokenHash = await tokenClient.sendTransaction(createNonFungibleTokenTransactionOrder);

      const createNonFungibleTokenProof = await tokenClient.waitTransactionProof(
        createNonFungibleTokenHash,
        CreateNonFungibleTokenTransactionRecordWithProof,
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
      ).then((transactionOrder) => transactionOrder.sign(signingService, signingService, [signingService]));

      const updateNonFungibleTokenHash = await tokenClient.sendTransaction(updateNonFungibleTokenTransactionOrder);

      await tokenClient.waitTransactionProof(
        updateNonFungibleTokenHash,
        UpdateNonFungibleTokenTransactionRecordWithProof,
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
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          nonce: null,
          type: { unitId: tokenTypeUnitId },
          ...createTransactionData(round),
        },
        cborCodec,
      ).then((transactionOrder) => transactionOrder.sign(signingService, signingService, [signingService]));

      const transferNonFungibleTokenHash = await tokenClient.sendTransaction(transferNonFungibleTokenTransactionOrder);

      await tokenClient.waitTransactionProof(
        transferNonFungibleTokenHash,
        TransferNonFungibleTokenTransactionRecordWithProof,
      );
      console.log('Transferring non token fungible token successful');
    }, 20000);
  });
});
