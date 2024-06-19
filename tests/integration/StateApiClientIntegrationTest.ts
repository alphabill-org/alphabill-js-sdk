import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import { CborCodecNode } from '../../src/codec/cbor/CborCodecNode.js';
import { FeeCreditRecord } from '../../src/FeeCreditRecord.js';
import { IUnit } from '../../src/IUnit.js';
import { IUnitId } from '../../src/IUnitId.js';
import { DefaultSigningService } from '../../src/signing/DefaultSigningService.js';
import { createMoneyClient, createTokenClient, http } from '../../src/StateApiClientFactory.js';
import { SystemIdentifier } from '../../src/SystemIdentifier.js';
import { AlwaysTruePredicate } from '../../src/transaction/AlwaysTruePredicate.js';
import { CreateFungibleTokenAttributes } from '../../src/transaction/CreateFungibleTokenAttributes.js';
import { NonFungibleTokenData } from '../../src/transaction/NonFungibleTokenData.js';
import { PayToPublicKeyHashPredicate } from '../../src/transaction/PayToPublicKeyHashPredicate.js';
import { TokenIcon } from '../../src/transaction/TokenIcon.js';
import { TransactionOrderFactory } from '../../src/transaction/TransactionOrderFactory.js';
import { TransactionPayload } from '../../src/transaction/TransactionPayload.js';
import { TransferFeeCreditAttributes } from '../../src/transaction/TransferFeeCreditAttributes.js';
import { UnitIdWithType } from '../../src/transaction/UnitIdWithType.js';
import { UnitType } from '../../src/transaction/UnitType.js';
import { TransactionRecordWithProof } from '../../src/TransactionRecordWithProof.js';
import { Base16Converter } from '../../src/util/Base16Converter.js';
import config from './config.js';
import { waitTransactionProof } from './waitTransactionProof.js';

describe('State Api Client Integration tests', () => {
  const cborCodec = new CborCodecNode();
  const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
  const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

  const moneyClient = createMoneyClient({
    transport: http(config.moneyPartitionUrl, new CborCodecNode()),
    transactionOrderFactory,
  });

  const tokenClient = createTokenClient({
    transport: http(config.tokenPartitionUrl, new CborCodecNode()),
    transactionOrderFactory,
  });

  const partitions = [
    { client: moneyClient, systemIdentifier: SystemIdentifier.MONEY_PARTITION },
    { client: tokenClient, systemIdentifier: SystemIdentifier.TOKEN_PARTITION },
  ];

  const moneyFeeCreditRecordId = new UnitIdWithType(
    sha256(signingService.publicKey),
    UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD,
  );
  const tokenFeeCreditRecordId = new UnitIdWithType(
    sha256(signingService.publicKey),
    UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD,
  );

  let moneyFeeCreditRecord: FeeCreditRecord | null;
  let tokenFeeCreditRecord: FeeCreditRecord | null;

  it('Get round number and get block', async () => {
    const round = await moneyClient.getRoundNumber();
    expect(round).not.toBeNull();
    const block = await moneyClient.getBlock(round);
    expect(block).not.toBeNull();
    expect(block.length).not.toBe(0);
  });

  it('Get units by owner ID and get unit', async () => {
    console.log(Base16Converter.encode(signingService.publicKey));
    const moneyUnitIds: IUnitId[] = await moneyClient.getUnitsByOwnerId(signingService.publicKey);
    expect(moneyUnitIds.length).toBeGreaterThan(0);

    const tokenUnitIds: IUnitId[] = await tokenClient.getUnitsByOwnerId(signingService.publicKey);
    expect(tokenUnitIds.length).toBeGreaterThan(0);

    const moneyUnit: IUnit | null = await moneyClient.getUnit(moneyUnitIds[0], true);
    expect(moneyUnit?.backlink).not.toBeNull();

    const tokenUnit: IUnit | null = await moneyClient.getUnit(moneyUnitIds[0], true);
    expect(tokenUnit?.backlink).not.toBeNull();
  });

  it('Add fee credit to money and token partitions', async () => {
    const unitIds: IUnitId[] = (await moneyClient.getUnitsByOwnerId(signingService.publicKey)).filter(
      (id) => id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA,
    );
    expect(unitIds.length).toBeGreaterThan(0);

    for (const { client, systemIdentifier } of partitions) {
      if (systemIdentifier === SystemIdentifier.MONEY_PARTITION) {
        moneyFeeCreditRecord = await client.getUnit(moneyFeeCreditRecordId, false);
      }
      if (systemIdentifier === SystemIdentifier.TOKEN_PARTITION) {
        tokenFeeCreditRecord = await client.getUnit(tokenFeeCreditRecordId, false);
      }

      const bill = await moneyClient.getUnit(unitIds[0], false);
      expect(bill).not.toBeNull();
      const round = await moneyClient.getRoundNumber();
      const feeCreditRecordId =
        systemIdentifier === SystemIdentifier.MONEY_PARTITION ? moneyFeeCreditRecordId : tokenFeeCreditRecordId;
      const feeCreditRecord = await client.getUnit(feeCreditRecordId, false);
      if (feeCreditRecord != null) {
        console.log('Fee credit already exists, skipping...');
        if (systemIdentifier === SystemIdentifier.MONEY_PARTITION) {
          moneyFeeCreditRecord = feeCreditRecord as FeeCreditRecord;
        }
        if (systemIdentifier === SystemIdentifier.TOKEN_PARTITION) {
          tokenFeeCreditRecord = feeCreditRecord as FeeCreditRecord;
        }
        continue;
      }

      console.log('Transferring to fee credit...');
      let transactionHash = await moneyClient.transferToFeeCredit(
        {
          bill: bill!,
          amount: BigInt(100),
          systemIdentifier: systemIdentifier,
          feeCreditRecord: { unitId: feeCreditRecordId, backlink: null },
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
      transactionHash = await client.addFeeCredit(
        {
          ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
          proof,
          feeCreditRecord: { unitId: feeCreditRecordId },
        },
        {
          maxTransactionFee: BigInt(5),
          timeout: round + BigInt(60),
          feeCreditRecordId: null,
        },
      );

      await waitTransactionProof(client, transactionHash);
      console.log('Adding fee credit successful');
      if (systemIdentifier === SystemIdentifier.MONEY_PARTITION) {
        moneyFeeCreditRecord = await client.getUnit(moneyFeeCreditRecordId, false);
      }
      if (systemIdentifier === SystemIdentifier.TOKEN_PARTITION) {
        tokenFeeCreditRecord = await client.getUnit(tokenFeeCreditRecordId, false);
      }
    }
  }, 20000);

  it('Create fungible token type and fungible token', async () => {
    const round = await tokenClient.getRoundNumber();
    const randomFttUnitIdBytes = randomBytes(12);
    const fttUnitId = new UnitIdWithType(randomFttUnitIdBytes, UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE);
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
        dataUpdatePredicate: new AlwaysTruePredicate(),
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
    const randomFtUnitIdBytes = randomBytes(12);
    const ftUnitId = new UnitIdWithType(randomFtUnitIdBytes, UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN);
    const createFungibleTokenHash = await tokenClient.sendTransaction(
      await transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          fttUnitId,
          new CreateFungibleTokenAttributes(
            await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
            ftUnitId,
            10n,
            null,
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

  it('Create non fungible token type and non fungible token', async () => {
    const round = await tokenClient.getRoundNumber();
    const randomNfttUnitIdBytes = randomBytes(12);
    const nfttUnitId = new UnitIdWithType(randomNfttUnitIdBytes, UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN_TYPE);
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
    const randomNftUnitIdBytes = randomBytes(12);
    const nftUnitId = new UnitIdWithType(randomNftUnitIdBytes, UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN);
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
        tokenCreationPredicateSignatures: null,
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
