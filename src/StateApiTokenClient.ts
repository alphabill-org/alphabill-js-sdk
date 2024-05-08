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
import { SplitFungibleTokenAttributes } from './transaction/SplitFungibleTokenAttributes.js';
import { TokenIcon } from './transaction/TokenIcon.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { TransferFungibleTokenAttributes } from './transaction/TransferFungibleTokenAttributes.js';
import { TransferNonFungibleTokenAttributes } from './transaction/TransferNonFungibleTokenAttributes.js';
import { UnlockFeeCreditAttributes } from './transaction/UnlockFeeCreditAttributes.js';
import { UpdateNonFungibleTokenAttributes } from './transaction/UpdateNonFungibleTokenAttributes.js';
import { TransactionRecordWithProof } from './TransactionRecordWithProof.js';
import { LockTokenAttributes } from './transaction/LockTokenAttributes.js';
import { UnlockTokenAttributes } from './transaction/UnlockTokenAttributes.js';

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
  token: { unitId: IUnitId };
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  name: string;
  uri: string;
  data: INonFungibleTokenData;
  dataUpdatePredicate: IPredicate;
  tokenCreationPredicateSignatures: Uint8Array[] | null;
}

interface ITransferNonFungibleTokenTransactionData {
  token: { unitId: IUnitId; backlink: Uint8Array };
  ownerPredicate: IPredicate;
  nonce: Uint8Array | null;
  backlink: Uint8Array;
  type: { unitId: IUnitId };
  invariantPredicateSignatures: Uint8Array[] | null;
}

interface IUpdateNonFungibleTokenTransactionData {
  token: { unitId: IUnitId; backlink: Uint8Array };
  data: INonFungibleTokenData;
  backlink: Uint8Array;
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
  dataUpdatePredicate: IPredicate;
  subTypeCreationPredicateSignatures: Uint8Array[] | null;
}

interface ICreateFungibleTokenTransactionData {
  token: { unitId: IUnitId };
  ownerPredicate: IPredicate;
  type: { unitId: IUnitId };
  value: bigint;
  tokenCreationPredicateSignatures: Uint8Array[] | null;
}

interface ITransferFungibleTokenTransactionData {
  token: { unitId: IUnitId; backlink: Uint8Array; value: bigint };
  ownerPredicate: IPredicate;
  value: bigint;
  nonce: Uint8Array | null;
  backlink: Uint8Array;
  type: { unitId: IUnitId };
  invariantPredicateSignatures: Uint8Array[] | null;
}

interface ISplitFungibleTokenTransactionData {
  token: { unitId: IUnitId; backlink: Uint8Array; value: bigint };
  ownerPredicate: IPredicate;
  amount: bigint;
  nonce: Uint8Array | null;
  type: { unitId: IUnitId };
  invariantPredicateSignatures: Uint8Array[] | null;
}

interface IBurnFungibleTokenTransactionData {
  token: { unitId: IUnitId; backlink: Uint8Array; value: bigint };
  targetToken: { unitId: IUnitId; backlink: Uint8Array };
  type: { unitId: IUnitId };
  invariantPredicateSignatures: Uint8Array[] | null;
}

interface IJoinFungibleTokensTransactionData {
  token: { unitId: IUnitId; backlink: Uint8Array };
  proofs: TransactionRecordWithProof<TransactionPayload<BurnFungibleTokenAttributes>>[];
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
      token,
      ownerPredicate,
      type,
      name,
      uri,
      data,
      dataUpdatePredicate,
      tokenCreationPredicateSignatures,
    }: ICreateNonFungibleTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          token.unitId,
          new CreateNonFungibleTokenAttributes(
            ownerPredicate,
            type.unitId,
            name,
            uri,
            data,
            dataUpdatePredicate,
            tokenCreationPredicateSignatures,
          ),
          metadata,
        ),
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
            token.backlink,
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
          new UpdateNonFungibleTokenAttributes(data, token.backlink, dataUpdateSignatures),
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
    { token, ownerPredicate, type, value, tokenCreationPredicateSignatures }: ICreateFungibleTokenTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          token.unitId,
          new CreateFungibleTokenAttributes(ownerPredicate, type.unitId, value, tokenCreationPredicateSignatures),
          metadata,
        ),
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
            token.backlink,
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
            token.backlink,
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
            targetToken.backlink,
            token.backlink,
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
          new JoinFungibleTokenAttributes(proofs, token.backlink, invariantPredicateSignatures),
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
          new CloseFeeCreditAttributes(amount, bill.unitId, bill.backlink),
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
          new LockFeeCreditAttributes(status, unit.backlink),
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
          new UnlockFeeCreditAttributes(unit.backlink),
          metadata,
        ),
      ),
    );
  }

  /**
   * Lock token.
   * @param {{status: bigint; unit: { unitId: IUnitId; backlink: Uint8Array }}} data Lock unit data.
   * @param {ITransactionClientMetadata} metadata Transaction client metadata.
   * @returns {Promise<Uint8Array>} Transaction hash.
   */
  public async lockToken(
    { status, unit }: ILockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          unit.unitId,
          new LockTokenAttributes(status, unit.backlink),
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
    { unit }: IUnlockUnitTransactionData,
    metadata: ITransactionClientMetadata,
  ): Promise<Uint8Array> {
    return this.sendTransaction(
      await this.transactionOrderFactory.createTransaction(
        TransactionPayload.create(
          SystemIdentifier.TOKEN_PARTITION,
          unit.unitId,
          new UnlockTokenAttributes(unit.backlink),
          metadata,
        ),
      ),
    );
  }
}
