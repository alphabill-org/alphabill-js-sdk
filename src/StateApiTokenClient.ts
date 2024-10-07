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
import { AddFeeCreditAttributes } from './transaction/attribute/AddFeeCreditAttributes.js';
import { BurnFungibleTokenAttributes } from './transaction/attribute/BurnFungibleTokenAttributes.js';
import { CloseFeeCreditAttributes } from './transaction/attribute/CloseFeeCreditAttributes.js';
import { CreateFungibleTokenAttributes } from './transaction/attribute/CreateFungibleTokenAttributes.js';
import { CreateFungibleTokenTypeAttributes } from './transaction/attribute/CreateFungibleTokenTypeAttributes.js';
import { CreateNonFungibleTokenAttributes } from './transaction/attribute/CreateNonFungibleTokenAttributes.js';
import { CreateNonFungibleTokenTypeAttributes } from './transaction/attribute/CreateNonFungibleTokenTypeAttributes.js';
import { JoinFungibleTokenAttributes } from './transaction/attribute/JoinFungibleTokenAttributes.js';
import { LockFeeCreditAttributes } from './transaction/attribute/LockFeeCreditAttributes.js';
import { LockTokenAttributes } from './transaction/attribute/LockTokenAttributes.js';
import { SplitFungibleTokenAttributes } from './transaction/attribute/SplitFungibleTokenAttributes.js';
import { TransferFungibleTokenAttributes } from './transaction/attribute/TransferFungibleTokenAttributes.js';
import { TransferNonFungibleTokenAttributes } from './transaction/attribute/TransferNonFungibleTokenAttributes.js';
import { UnlockFeeCreditAttributes } from './transaction/attribute/UnlockFeeCreditAttributes.js';
import { UnlockTokenAttributes } from './transaction/attribute/UnlockTokenAttributes.js';
import { UpdateNonFungibleTokenAttributes } from './transaction/attribute/UpdateNonFungibleTokenAttributes.js';
import { INonFungibleTokenData } from './transaction/INonFungibleTokenData.js';
import { IPredicate } from './transaction/IPredicate.js';
import { ITransactionClientMetadata } from './transaction/ITransactionClientMetadata.js';
import { TokenIcon } from './transaction/TokenIcon.js';
import { TokenUnitIdFactory } from './transaction/TokenUnitIdFactory.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { UnitType } from './transaction/UnitType.js';
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
  proofs: TransactionRecordWithProof<BurnFungibleTokenAttributes>[];
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
   * State API client for money partition constructor.
   * @param tokenUnitIdFactory Token unit ID factory.
   * @param service State API service.
   */
  public constructor(
    private readonly tokenUnitIdFactory: TokenUnitIdFactory,
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
    const unitId = await this.tokenUnitIdFactory.create(
      attributes,
      metadata,
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
    const unitId = await this.tokenUnitIdFactory.create(attributes, metadata, UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN);
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
    { bill, feeCreditRecord }: ICloseFeeCreditTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          feeCreditRecord.unitId,
          new CloseFeeCreditAttributes(feeCreditRecord.balance, bill.unitId, bill.counter, feeCreditRecord.counter),
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
   * Unlock fee credit.
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
}
