import { numberToBytesBE } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { IStateApiService } from './IStateApiService.js';
import { IUnitId } from './IUnitId.js';
import { StateApiClient } from './StateApiClient.js';
import {
  IAddFeeCreditTransactionData,
  ICloseFeeCreditTransactionData,
  ILockUnitTransactionData,
  IUnlockUnitTransactionData,
} from './StateApiMoneyClient.js';
import { SystemIdentifier } from './SystemIdentifier.js';
import { AddFeeCreditAttributes } from './transaction/AddFeeCreditAttributes.js';
import { BurnFungibleTokenAttributes } from './transaction/BurnFungibleTokenAttributes.js';
import { CloseFeeCreditAttributes } from './transaction/CloseFeeCreditAttributes.js';
import { CreateFungibleTokenAttributes } from './transaction/CreateFungibleTokenAttributes.js';
import { CreateFungibleTokenTypeAttributes } from './transaction/CreateFungibleTokenTypeAttributes.js';
import { CreateNonFungibleTokenAttributes } from './transaction/CreateNonFungibleTokenAttributes.js';
import { CreateNonFungibleTokenTypeAttributes } from './transaction/CreateNonFungibleTokenTypeAttributes.js';
import { INonFungibleTokenData } from './transaction/INonFungibleTokenData.js';
import { IPredicate } from './transaction/IPredicate.js';
import { ITransactionClientMetadata } from './transaction/ITransactionClientMetadata.js';
import { ITransactionOrderFactory } from './transaction/ITransactionOrderFactory.js';
import { JoinFungibleTokenAttributes } from './transaction/JoinFungibleTokenAttributes.js';
import { LockFeeCreditAttributes } from './transaction/LockFeeCreditAttributes.js';
import { LockTokenAttributes } from './transaction/LockTokenAttributes.js';
import { SplitFungibleTokenAttributes } from './transaction/SplitFungibleTokenAttributes.js';
import { TokenIcon } from './transaction/TokenIcon.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { TransferFungibleTokenAttributes } from './transaction/TransferFungibleTokenAttributes.js';
import { TransferNonFungibleTokenAttributes } from './transaction/TransferNonFungibleTokenAttributes.js';
import { UnitIdWithType } from './transaction/UnitIdWithType.js';
import { UnitType } from './transaction/UnitType.js';
import { UnlockFeeCreditAttributes } from './transaction/UnlockFeeCreditAttributes.js';
import { UnlockTokenAttributes } from './transaction/UnlockTokenAttributes.js';
import { UpdateNonFungibleTokenAttributes } from './transaction/UpdateNonFungibleTokenAttributes.js';
import { TransactionRecordWithProof } from './TransactionRecordWithProof.js';

// TODO: Move interfaces to separate file for token and money client
// TODO: Comment all functions and interfaces
interface ICreateNonFungibleTokenTypeTransactionData {
  type: { unitId: IUnitId };
  symbol: string;
  name: string;
  icon: { type: string; data: Uint8Array };
  parentTypeId: IUnitId | null;
  subTypeCreationPredicate: IPredicate;
  tokenCreationPredicate: IPredicate;
  invariantPredicate: IPredicate;
  dataUpdatePredicate: IPredicate;
  subTypeCreationPredicateSignatures: Uint8Array[] | null;
}

interface ICreateNonFungibleTokenTransactionData {
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  name: string;
  uri: string;
  data: INonFungibleTokenData;
  dataUpdatePredicate: IPredicate;
  nonce: bigint;
  tokenCreationPredicateSignatures: Uint8Array[] | null;
}

interface ITransferNonFungibleTokenTransactionData {
  token: { unitId: IUnitId; counter: bigint };
  ownerPredicate: IPredicate;
  nonce: Uint8Array | null;
  counter: bigint;
  type: { unitId: IUnitId };
  invariantPredicateSignatures: Uint8Array[] | null;
}

interface IUpdateNonFungibleTokenTransactionData {
  token: { unitId: IUnitId; counter: bigint };
  data: INonFungibleTokenData;
  dataUpdateSignatures: Uint8Array[] | null;
}

interface ICreateFungibleTokenTypeTransactionData {
  type: { unitId: IUnitId };
  symbol: string;
  name: string;
  icon: { type: string; data: Uint8Array };
  parentTypeId: IUnitId | null;
  decimalPlaces: number;
  subTypeCreationPredicate: IPredicate;
  tokenCreationPredicate: IPredicate;
  invariantPredicate: IPredicate;
  subTypeCreationPredicateSignatures: Uint8Array[] | null;
}

interface ICreateFungibleTokenTransactionData {
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  value: bigint;
  nonce: bigint;
  tokenCreationPredicateSignatures: Uint8Array[] | null;
}

interface ITransferFungibleTokenTransactionData {
  token: { unitId: IUnitId; counter: bigint; value: bigint };
  ownerPredicate: IPredicate;
  nonce: Uint8Array | null;
  type: { unitId: IUnitId };
  invariantPredicateSignatures: Uint8Array[] | null;
}

interface ISplitFungibleTokenTransactionData {
  token: { unitId: IUnitId; counter: bigint; value: bigint };
  ownerPredicate: IPredicate;
  amount: bigint;
  nonce: Uint8Array | null;
  type: { unitId: IUnitId };
  invariantPredicateSignatures: Uint8Array[] | null;
}

interface IBurnFungibleTokenTransactionData {
  token: { unitId: IUnitId; counter: bigint; value: bigint };
  targetToken: { unitId: IUnitId; counter: bigint };
  type: { unitId: IUnitId };
  invariantPredicateSignatures: Uint8Array[] | null;
}

interface IJoinFungibleTokensTransactionData {
  token: { unitId: IUnitId; counter: bigint };
  proofs: TransactionRecordWithProof<TransactionPayload<BurnFungibleTokenAttributes>>[];
  invariantPredicateSignatures: Uint8Array[] | null;
}

export interface ILockTokenTransactionData {
  status: bigint;
  unit: { unitId: IUnitId; counter: bigint };
  invariantPredicateSignatures: Uint8Array[] | null;
}

export interface IUnlockTokenTransactionData {
  unit: { unitId: IUnitId; counter: bigint };
  invariantPredicateSignatures: Uint8Array[] | null;
}

/**
 * State API client for token partition.
 */
export class StateApiTokenClient extends StateApiClient {
  /**
   * State API client for token partition constructor.
   * @param transactionOrderFactory Transaction order factory.
   * @param service State API service.
   */
  public constructor(
    private readonly transactionOrderFactory: ITransactionOrderFactory,
    service: IStateApiService,
  ) {
    super(service);
  }

  /**
   * Create non-fungible token type.
   * @param {ICreateNonFungibleTokenTypeTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async createNonFungibleTokenType(
    {
      type,
      symbol,
      name,
      icon,
      parentTypeId,
      subTypeCreationPredicate,
      tokenCreationPredicate,
      invariantPredicate,
      dataUpdatePredicate,
      subTypeCreationPredicateSignatures,
    }: ICreateNonFungibleTokenTypeTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          type.unitId,
          new CreateNonFungibleTokenTypeAttributes(
            symbol,
            name,
            new TokenIcon(icon.type, icon.data),
            parentTypeId,
            subTypeCreationPredicate,
            tokenCreationPredicate,
            invariantPredicate,
            dataUpdatePredicate,
            subTypeCreationPredicateSignatures,
          ),
          metadata,
        ),
      ),
    );
  }

  /**
   * Create non-fungible token.
   * @param {ICreateNonFungibleTokenTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async createNonFungibleToken(
    {
      ownerPredicate,
      type,
      name,
      uri,
      data,
      dataUpdatePredicate,
      nonce,
      tokenCreationPredicateSignatures,
    }: ICreateNonFungibleTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    const attributes = new CreateNonFungibleTokenAttributes(
      ownerPredicate,
      type.unitId,
      name,
      uri,
      data,
      dataUpdatePredicate,
      nonce,
      tokenCreationPredicateSignatures,
    );
    const unitId = await this.calculateNewUnitId(
      attributes,
      metadata,
      new Uint8Array([0x23]),
      UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN,
    );
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(SystemIdentifier.TOKEN_PARTITION, unitId, attributes, metadata),
      ),
    );
  }

  /**
   * Transfer non-fungible token.
   * @param {ITransferNonFungibleTokenTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async transferNonFungibleToken(
    { token, ownerPredicate, nonce, type, invariantPredicateSignatures }: ITransferNonFungibleTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          token.unitId,
          new TransferNonFungibleTokenAttributes(
            ownerPredicate,
            nonce,
            token.counter,
            type.unitId,
            invariantPredicateSignatures,
          ),
          metadata,
        ),
      ),
    );
  }

  /**
   * Update non-fungible token.
   * @param {IUpdateNonFungibleTokenTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async updateNonFungibleToken(
    { token, data, dataUpdateSignatures }: IUpdateNonFungibleTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          token.unitId,
          new UpdateNonFungibleTokenAttributes(data, token.counter, dataUpdateSignatures),
          metadata,
        ),
      ),
    );
  }

  /**
   * Create fungible token type.
   * @param {ICreateFungibleTokenTypeTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async createFungibleTokenType(
    {
      type,
      symbol,
      name,
      icon,
      parentTypeId,
      decimalPlaces,
      subTypeCreationPredicate,
      tokenCreationPredicate,
      invariantPredicate,
      subTypeCreationPredicateSignatures,
    }: ICreateFungibleTokenTypeTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          type.unitId,
          new CreateFungibleTokenTypeAttributes(
            symbol,
            name,
            new TokenIcon(icon.type, icon.data),
            parentTypeId,
            decimalPlaces,
            subTypeCreationPredicate,
            tokenCreationPredicate,
            invariantPredicate,
            subTypeCreationPredicateSignatures,
          ),
          metadata,
        ),
      ),
    );
  }

  /**
   * Create fungible token.
   * @param {ICreateFungibleTokenTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async createFungibleToken(
    { ownerPredicate, type, value, nonce, tokenCreationPredicateSignatures }: ICreateFungibleTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    const attributes = new CreateFungibleTokenAttributes(
      ownerPredicate,
      type.unitId,
      value,
      nonce,
      tokenCreationPredicateSignatures,
    );
    const unitId = await this.calculateNewUnitId(
      attributes,
      metadata,
      new Uint8Array([0x21]),
      UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN,
    );
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(SystemIdentifier.TOKEN_PARTITION, unitId, attributes, metadata),
      ),
    );
  }

  /**
   * Transfer fungible token.
   * @param {ITransferFungibleTokenTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async transferFungibleToken(
    { token, ownerPredicate, nonce, type, invariantPredicateSignatures }: ITransferFungibleTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          token.unitId,
          new TransferFungibleTokenAttributes(
            ownerPredicate,
            token.value,
            nonce,
            token.counter,
            type.unitId,
            invariantPredicateSignatures,
          ),
          metadata,
        ),
      ),
    );
  }

  /**
   * Split fungible token.
   * @param {ISplitFungibleTokenTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async splitFungibleToken(
    { token, ownerPredicate, amount, nonce, type, invariantPredicateSignatures }: ISplitFungibleTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          token.unitId,
          new SplitFungibleTokenAttributes(
            ownerPredicate,
            amount,
            nonce,
            token.counter,
            type.unitId,
            token.value - amount,
            invariantPredicateSignatures,
          ),
          metadata,
        ),
      ),
    );
  }

  /**
   * Burn fungible token.
   * @param {IBurnFungibleTokenTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async burnFungibleToken(
    { token, targetToken, type, invariantPredicateSignatures }: IBurnFungibleTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          token.unitId,
          new BurnFungibleTokenAttributes(
            type.unitId,
            token.value,
            targetToken.unitId,
            targetToken.counter,
            token.counter,
            invariantPredicateSignatures,
          ),
          metadata,
        ),
      ),
    );
  }

  /**
   * Join fungible tokens.
   * @param {IJoinFungibleTokensTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async joinFungibleTokens(
    { proofs, token, invariantPredicateSignatures }: IJoinFungibleTokensTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          token.unitId,
          new JoinFungibleTokenAttributes(proofs, token.counter, invariantPredicateSignatures),
          metadata,
        ),
      ),
    );
  }

  /**
   * Add fee credit.
   * @param {IAddFeeCreditTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async addFeeCredit(
    { ownerPredicate, proof, feeCreditRecord }: IAddFeeCreditTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          feeCreditRecord.unitId,
          new AddFeeCreditAttributes(ownerPredicate, proof),
          metadata,
        ),
      ),
    );
  }

  /**
   * Close fee credit.
   * @param {ICloseFeeCreditTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async closeFeeCredit(
    { amount, bill, feeCreditRecord }: ICloseFeeCreditTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          feeCreditRecord.unitId,
          new CloseFeeCreditAttributes(amount, bill.unitId, bill.counter, feeCreditRecord.counter),
          metadata,
        ),
      ),
    );
  }

  /**
   * Lock fee credit.
   * @param {ILockUnitTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async lockFeeCredit(
    { status, unit }: ILockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          unit.unitId,
          new LockFeeCreditAttributes(status, unit.counter),
          metadata,
        ),
      ),
    );
  }

  /**
   * Unlock fee credit..
   * @param {IUnlockUnitTransactionData} data Transaction data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async unlockFeeCredit(
    { unit }: IUnlockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          unit.unitId,
          new UnlockFeeCreditAttributes(unit.counter),
          metadata,
        ),
      ),
    );
  }

  /**
   * Lock token.
   * @param {{status: bigint; unit: { unitId: IUnitId; counter: bigint }}} data Lock unit data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async lockToken(
    { status, unit, invariantPredicateSignatures }: ILockTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          unit.unitId,
          new LockTokenAttributes(status, unit.counter, invariantPredicateSignatures),
          metadata,
        ),
      ),
    );
  }

  /**
   * Unlock token.
   * @param {IUnlockUnitTransactionData} data Unlock unit data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async unlockToken(
    { unit, invariantPredicateSignatures }: IUnlockTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          unit.unitId,
          new UnlockTokenAttributes(unit.counter, invariantPredicateSignatures),
          metadata,
        ),
      ),
    );
  }

  public async calculateNewUnitId(
    attributes: CreateFungibleTokenAttributes | CreateNonFungibleTokenAttributes,
    metadata: ITransactionClientMetadata,
    unitTypeByte: Uint8Array,
    unitType: UnitType,
  ): Promise<UnitIdWithType> {
    const unitIdLength = 33; // UnitPartLength (32) + TypePartLength (1)
    const attributesBytes = await this.transactionOrderFactory.encode(attributes.toOwnerProofData());
    const unitPart = sha256
      .create()
      .update(attributesBytes)
      .update(numberToBytesBE(metadata.timeout, 8))
      .update(numberToBytesBE(metadata.maxTransactionFee, 8));
    if (metadata.feeCreditRecordId != null) {
      unitPart.update(metadata.feeCreditRecordId.bytes);
    }
    if (metadata.referenceNumber != null) {
      unitPart.update(metadata.referenceNumber);
    }
    const unitPartHash = unitPart.digest();
    const newUnitId = new Uint8Array(unitIdLength);
    // The number of bytes to reserve for unitPart in the new UnitID.
    const unitPartMaxLength = 32;
    // Copy unitPart, leaving zero bytes in the beginning in case unitPart is shorter than unitPartLength.
    const unitPartStart = Math.max(0, unitPartMaxLength - unitPartHash.length);
    newUnitId.set(unitPartHash, unitPartStart);
    // Copy typePart
    newUnitId.set(unitTypeByte, unitPartMaxLength);
    return new UnitIdWithType(newUnitId, unitType);
  }
}
