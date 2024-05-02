import { IStateApiService } from './IStateApiService.js';
import { IUnitId } from './IUnitId.js';
import { StateApiClient } from './StateApiClient.js';
import { IAddFeeCreditTransactionData, ICloseFeeCreditTransactionData } from './StateApiMoneyClient.js';
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
import { SplitFungibleTokenAttributes } from './transaction/SplitFungibleTokenAttributes.js';
import { TokenIcon } from './transaction/TokenIcon.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { TransferFungibleTokenAttributes } from './transaction/TransferFungibleTokenAttributes.js';
import { TransferNonFungibleTokenAttributes } from './transaction/TransferNonFungibleTokenAttributes.js';
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

export class StateApiTokenClient extends StateApiClient {
  public constructor(
    private readonly transactionOrderFactory: ITransactionOrderFactory,
    service: IStateApiService,
  ) {
    super(service);
  }

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

  // TODO: Lock token, unlock token
  // TODO: Lock, unlock, reclaim

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
}
