import { randomBytes } from '@noble/hashes/utils';
import { CborEncoder } from '../../../src/codec/cbor/CborEncoder.js';
import { AddFeeCredit } from '../../../src/fees/transactions/AddFeeCredit.js';
import { IUnitId } from '../../../src/IUnitId.js';
import { DefaultSigningService } from '../../../src/signing/DefaultSigningService.js';
import { createMoneyClient, createTokenClient, http } from '../../../src/StateApiClientFactory.js';
import { FungibleToken } from '../../../src/tokens/FungibleToken.js';
import { FungibleTokenType } from '../../../src/tokens/FungibleTokenType.js';
import { NonFungibleToken } from '../../../src/tokens/NonFungibleToken.js';
import { NonFungibleTokenData } from '../../../src/tokens/NonFungibleTokenData.js';
import { NonFungibleTokenType } from '../../../src/tokens/NonFungibleTokenType.js';
import { TokenIcon } from '../../../src/tokens/TokenIcon.js';
import { TokenPartitionUnitType } from '../../../src/tokens/TokenPartitionUnitType.js';
import { BurnFungibleToken } from '../../../src/tokens/transactions/BurnFungibleToken.js';
import { CreateFungibleToken } from '../../../src/tokens/transactions/CreateFungibleToken.js';
import { CreateFungibleTokenType } from '../../../src/tokens/transactions/CreateFungibleTokenType.js';
import { CreateNonFungibleToken } from '../../../src/tokens/transactions/CreateNonFungibleToken.js';
import { CreateNonFungibleTokenType } from '../../../src/tokens/transactions/CreateNonFungibleTokenType.js';
import { JoinFungibleToken } from '../../../src/tokens/transactions/JoinFungibleToken.js';
import { SplitFungibleToken } from '../../../src/tokens/transactions/SplitFungibleToken.js';
import { TransferFungibleToken } from '../../../src/tokens/transactions/TransferFungibleToken.js';
import { TransferNonFungibleToken } from '../../../src/tokens/transactions/TransferNonFungibleToken.js';
import { UpdateNonFungibleToken } from '../../../src/tokens/transactions/UpdateNonFungibleToken.js';
import { UnitIdWithType } from '../../../src/tokens/UnitIdWithType.js';
import { AlwaysFalsePredicate } from '../../../src/transaction/predicates/AlwaysFalsePredicate.js';
import { AlwaysTruePredicate } from '../../../src/transaction/predicates/AlwaysTruePredicate.js';
import { PayToPublicKeyHashPredicate } from '../../../src/transaction/predicates/PayToPublicKeyHashPredicate.js';
import { AlwaysTrueProofFactory } from '../../../src/transaction/proofs/AlwaysTrueProofFactory.js';
import { PayToPublicKeyHashProofFactory } from '../../../src/transaction/proofs/PayToPublicKeyHashProofFactory.js';
import { TransactionStatus } from '../../../src/transaction/record/TransactionStatus.js';
import { UnitId } from '../../../src/UnitId.js';
import { Base16Converter } from '../../../src/util/Base16Converter.js';
import { Base64Converter } from '../../../src/util/Base64Converter.js';
import config from '../config/config.js';
import { addFeeCredit, createTransactionData } from '../utils/TestUtils.js';

describe('Token Client Integration Tests', () => {
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const proofFactory = new PayToPublicKeyHashProofFactory(signingService);
  const alwaysTrueProofFactory = new AlwaysTrueProofFactory();
  const ownerPredicate = PayToPublicKeyHashPredicate.create(signingService.publicKey);
  const networkIdentifier = config.networkIdentifier;
  const partitionIdentifier = config.tokenPartitionIdentifier;
  const moneyPartitionIdentifier = config.moneyPartitionIdentifier;

  const tokenClient = createTokenClient({
    transport: http(config.tokenPartitionUrl),
  });

  let feeCreditRecordId: IUnitId; // can no longer be static as hash contains timeout

  it('Add fee credit', async () => {
    const moneyClient = createMoneyClient({
      transport: http(config.moneyPartitionUrl),
    });

    const addFeeCreditHash = await addFeeCredit(
      moneyClient,
      tokenClient,
      partitionIdentifier,
      networkIdentifier,
      moneyPartitionIdentifier,
      signingService.publicKey,
      proofFactory,
    );

    const proof = await tokenClient.waitTransactionProof(addFeeCreditHash, AddFeeCredit);
    expect(proof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
    console.log('Adding fee credit successful');
    feeCreditRecordId = proof.transactionRecord.transactionOrder.payload.unitId;
  }, 20000);

  describe('Fungible Token Integration Tests', () => {
    const tokenTypeUnitId = new UnitIdWithType(randomBytes(12), TokenPartitionUnitType.FUNGIBLE_TOKEN_TYPE);
    let tokenUnitId: IUnitId;

    it('Create token type and token', async () => {
      const round = (await tokenClient.getRoundInfo()).roundNumber;
      console.log('Creating fungible token type...');

      const createFungibleTokenTypeTransactionOrder = await CreateFungibleTokenType.create({
        typeId: tokenTypeUnitId,
        symbol: 'E',
        name: 'Big money come',
        icon: new TokenIcon(
          'image/png',
          Base64Converter.decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/edZ1a0AAAAASUVORK5CYII=',
          ),
        ),
        parentTypeId: null,
        decimalPlaces: 8,
        subTypeCreationPredicate: new AlwaysFalsePredicate(),
        tokenMintingPredicate: new AlwaysTruePredicate(),
        tokenTypeOwnerPredicate: new AlwaysTruePredicate(),
        ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
      }).sign(proofFactory, []);

      const createFungibleTokenTypeHash = await tokenClient.sendTransaction(createFungibleTokenTypeTransactionOrder);

      const createFungibleTokenTypeProof = await tokenClient.waitTransactionProof(
        createFungibleTokenTypeHash,
        CreateFungibleTokenType,
      );
      expect(createFungibleTokenTypeProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );

      const tokenType = await tokenClient.getUnit(tokenTypeUnitId, false, FungibleTokenType);
      expect(tokenType).not.toBeNull();
      console.log('Creating fungible token type successful');

      console.log('Creating fungible token...');
      const createFungibleTokenTransactionOrder = await CreateFungibleToken.create({
        ownerPredicate: ownerPredicate,
        typeId: tokenTypeUnitId,
        value: 10n,
        nonce: 0n,
        ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
      }).sign(alwaysTrueProofFactory, proofFactory);

      const createFungibleTokenHash = await tokenClient.sendTransaction(createFungibleTokenTransactionOrder);
      const createFungibleTokenProof = await tokenClient.waitTransactionProof(
        createFungibleTokenHash,
        CreateFungibleToken,
      );

      expect(createFungibleTokenProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );

      tokenUnitId = createFungibleTokenProof.transactionRecord.transactionOrder.payload.unitId;

      console.log('Creating fungible token successful');
    }, 20000);

    it('Split, burn and join', async () => {
      const round = (await tokenClient.getRoundInfo()).roundNumber;
      const token = await tokenClient.getUnit(tokenUnitId, false, FungibleToken);
      expect(token).not.toBeNull();

      console.log('Splitting fungible token...');
      const splitFungibleTokenTransactionOrder = await SplitFungibleToken.create({
        token: token!,
        ownerPredicate: ownerPredicate,
        amount: 3n,
        ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
      }).sign(proofFactory, proofFactory, [alwaysTrueProofFactory]);

      const splitFungibleTokenHash = await tokenClient.sendTransaction(splitFungibleTokenTransactionOrder);

      const splitBillProof = await tokenClient.waitTransactionProof(splitFungibleTokenHash, SplitFungibleToken);
      expect(splitBillProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
      console.log('Fungible token split successful');

      const splitTokenId = splitBillProof.transactionRecord.serverMetadata.targetUnitIds.find(
        (id: IUnitId) => !UnitId.equals(id, token!.unitId),
      );
      expect(splitTokenId).not.toBeNull();

      const splitToken = await tokenClient.getUnit(splitTokenId!, false, FungibleToken);
      const originalTokenAfterSplit = await tokenClient.getUnit(tokenUnitId, false, FungibleToken);

      console.log('Burning fungible token...');
      const burnFungibleTokenHash = await tokenClient.sendTransaction(
        await BurnFungibleToken.create({
          token: splitToken!,
          targetToken: originalTokenAfterSplit!,
          ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
        }).sign(proofFactory, proofFactory, [alwaysTrueProofFactory]),
      );

      const burnProof = await tokenClient.waitTransactionProof(burnFungibleTokenHash, BurnFungibleToken);
      expect(burnProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
      console.log('Fungible token burn successful');

      console.log('Joining fungible token...');
      const joinFungibleTokenTransactionOrder = await JoinFungibleToken.create({
        token: originalTokenAfterSplit!,
        proofs: [burnProof],
        ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
      }).sign(proofFactory, proofFactory, [alwaysTrueProofFactory]);

      const joinFungibleTokenHash = await tokenClient.sendTransaction(joinFungibleTokenTransactionOrder);

      const joinProof = await tokenClient.waitTransactionProof(joinFungibleTokenHash, JoinFungibleToken);
      expect(joinProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
      console.log('Fungible token join successful');
    }, 20000);

    it('Transfer', async () => {
      const round = (await tokenClient.getRoundInfo()).roundNumber;
      const token = await tokenClient.getUnit(tokenUnitId, false, FungibleToken);
      expect(token).not.toBeNull();

      console.log('Transferring fungible token...');
      const transferFungibleTokenTransactionOrder = await TransferFungibleToken.create({
        token: token!,
        ownerPredicate: ownerPredicate,
        ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
      }).sign(proofFactory, proofFactory, [alwaysTrueProofFactory]);

      const transferFungibleTokenHash = await tokenClient.sendTransaction(transferFungibleTokenTransactionOrder);

      const transferProof = await tokenClient.waitTransactionProof(transferFungibleTokenHash, TransferFungibleToken);
      expect(transferProof.transactionRecord.serverMetadata.successIndicator).toEqual(TransactionStatus.Successful);
      console.log('Fungible token transfer successful');
    }, 20000);
  });

  describe('Non-fungible Token Integration Tests', () => {
    const tokenTypeUnitId = new UnitIdWithType(randomBytes(12), TokenPartitionUnitType.NON_FUNGIBLE_TOKEN_TYPE);
    let tokenUnitId: IUnitId;

    it('Create token type and token', async () => {
      const round = (await tokenClient.getRoundInfo()).roundNumber;
      console.log('Creating non-fungible token type...');
      const createNonFungibleTokenTypeTransactionOrder = await CreateNonFungibleTokenType.create({
        typeId: tokenTypeUnitId,
        symbol: 'E',
        name: 'Token Name',
        icon: { type: 'image/png', data: new Uint8Array() },
        parentTypeId: null,
        subTypeCreationPredicate: new AlwaysFalsePredicate(),
        tokenMintingPredicate: new AlwaysTruePredicate(),
        tokenTypeOwnerPredicate: new AlwaysTruePredicate(),
        dataUpdatePredicate: new AlwaysTruePredicate(),
        ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
      }).sign(proofFactory, []);

      const createNonFungibleTokenTypeHash = await tokenClient.sendTransaction(
        createNonFungibleTokenTypeTransactionOrder,
      );

      const createNonFungibleTokenTypeProof = await tokenClient.waitTransactionProof(
        createNonFungibleTokenTypeHash,
        CreateNonFungibleTokenType,
      );
      expect(createNonFungibleTokenTypeProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );
      const tokenType = await tokenClient.getUnit(tokenTypeUnitId, false, NonFungibleTokenType);
      expect(tokenType).not.toBeNull();
      console.log('Creating non-fungible token type successful');

      console.log('Creating non-fungible token...');
      const createNonFungibleTokenTransactionOrder = await CreateNonFungibleToken.create({
        ownerPredicate: ownerPredicate,
        typeId: tokenTypeUnitId,
        name: 'My token',
        uri: 'http://guardtime.com',
        data: NonFungibleTokenData.create(CborEncoder.encodeTextString('user variables')),
        dataUpdatePredicate: new AlwaysTruePredicate(),
        nonce: 0n,
        ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
      }).sign(alwaysTrueProofFactory, proofFactory);

      const createNonFungibleTokenHash = await tokenClient.sendTransaction(createNonFungibleTokenTransactionOrder);

      const createNonFungibleTokenProof = await tokenClient.waitTransactionProof(
        createNonFungibleTokenHash,
        CreateNonFungibleToken,
      );
      expect(createNonFungibleTokenProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );
      tokenUnitId = createNonFungibleTokenProof.transactionRecord.transactionOrder.payload.unitId;
      console.log('Creating non-fungible token successful');
    }, 20000);

    it('Update', async () => {
      const round = (await tokenClient.getRoundInfo()).roundNumber;
      const token = await tokenClient.getUnit(tokenUnitId, false, NonFungibleToken);
      expect(token).not.toBeNull();

      console.log('Updating non-fungible token...');
      const updateNonFungibleTokenTransactionOrder = await UpdateNonFungibleToken.create({
        token: token!,
        data: NonFungibleTokenData.create(new Uint8Array(32)),
        ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
      }).sign(alwaysTrueProofFactory, proofFactory, [alwaysTrueProofFactory]);

      const updateNonFungibleTokenHash = await tokenClient.sendTransaction(updateNonFungibleTokenTransactionOrder);

      const updateNonFungibleTokenProof = await tokenClient.waitTransactionProof(
        updateNonFungibleTokenHash,
        UpdateNonFungibleToken,
      );

      expect(updateNonFungibleTokenProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );
      console.log('Updating non token fungible token successful');
    }, 20000);

    it('Transfer', async () => {
      const round = (await tokenClient.getRoundInfo()).roundNumber;
      const token = await tokenClient.getUnit(tokenUnitId, false, NonFungibleToken);
      expect(token).not.toBeNull();

      console.log('Transferring non-fungible token...');
      const transferNonFungibleTokenTransactionOrder = await TransferNonFungibleToken.create({
        token: token!,
        ownerPredicate: ownerPredicate,
        ...createTransactionData(round, networkIdentifier, partitionIdentifier, feeCreditRecordId),
      }).sign(proofFactory, proofFactory, [alwaysTrueProofFactory]);

      const transferNonFungibleTokenHash = await tokenClient.sendTransaction(transferNonFungibleTokenTransactionOrder);

      const transferNonFungibleTokenProof = await tokenClient.waitTransactionProof(
        transferNonFungibleTokenHash,
        TransferNonFungibleToken,
      );
      expect(transferNonFungibleTokenProof.transactionRecord.serverMetadata.successIndicator).toEqual(
        TransactionStatus.Successful,
      );
      console.log('Transferring non token fungible token successful');
    }, 20000);
  });
});
