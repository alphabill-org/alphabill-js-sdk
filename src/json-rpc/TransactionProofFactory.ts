import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { ServerMetadata, ServerMetadataArray } from '../ServerMetadata.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { AddFeeCreditAttributes, AddFeeCreditAttributesArray } from '../transaction/AddFeeCreditAttributes.js';
import { AddFeeCreditPayload } from '../transaction/AddFeeCreditPayload.js';
import {
  BurnFungibleTokenAttributes,
  BurnFungibleTokenAttributesArray,
} from '../transaction/BurnFungibleTokenAttributes.js';
import { BurnFungibleTokenPayload } from '../transaction/BurnFungibleTokenPayload.js';
import { CloseFeeCreditAttributes, CloseFeeCreditAttributesArray } from '../transaction/CloseFeeCreditAttributes.js';
import { CloseFeeCreditPayload } from '../transaction/CloseFeeCreditPayload.js';
import {
  CreateFungibleTokenAttributes,
  CreateFungibleTokenAttributesArray,
} from '../transaction/CreateFungibleTokenAttributes.js';
import { CreateFungibleTokenPayload } from '../transaction/CreateFungibleTokenPayload.js';
import {
  CreateFungibleTokenTypeAttributes,
  CreateFungibleTokenTypeAttributesArray,
} from '../transaction/CreateFungibleTokenTypeAttributes.js';
import { CreateFungibleTokenTypePayload } from '../transaction/CreateFungibleTokenTypePayload.js';
import {
  CreateNonFungibleTokenAttributes,
  CreateNonFungibleTokenAttributesArray,
} from '../transaction/CreateNonFungibleTokenAttributes.js';
import { CreateNonFungibleTokenPayload } from '../transaction/CreateNonFungibleTokenPayload.js';
import {
  CreateNonFungibleTokenTypeAttributes,
  CreateNonFungibleTokenTypeAttributesArray,
} from '../transaction/CreateNonFungibleTokenTypeAttributes.js';
import { CreateNonFungibleTokenTypePayload } from '../transaction/CreateNonFungibleTokenTypePayload.js';
import { FeeCreditUnitId } from '../transaction/FeeCreditUnitId.js';
import { ITransactionPayloadAttributes } from '../transaction/ITransactionPayloadAttributes.js';
import { LockBillAttributes, LockBillAttributesArray } from '../transaction/LockBillAttributes.js';
import { LockBillPayload } from '../transaction/LockBillPayload.js';
import { LockFeeCreditAttributes, LockFeeCreditAttributesArray } from '../transaction/LockFeeCreditAttributes.js';
import { LockFeeCreditPayload } from '../transaction/LockFeeCreditPayload.js';
import { NonFungibleTokenData } from '../transaction/NonFungibleTokenData.js';
import {
  ReclaimFeeCreditAttributes,
  ReclaimFeeCreditAttributesArray,
} from '../transaction/ReclaimFeeCreditAttributes.js';
import { ReclaimFeeCreditPayload } from '../transaction/ReclaimFeeCreditPayload.js';
import { SplitBillAttributes, SplitBillAttributesArray } from '../transaction/SplitBillAttributes.js';
import { SplitBillPayload } from '../transaction/SplitBillPayload.js';
import { SplitBillUnit } from '../transaction/SplitBillUnit.js';
import {
  SplitFungibleTokenAttributes,
  SplitFungibleTokenAttributesArray,
} from '../transaction/SplitFungibleTokenAttributes.js';
import { SplitFungibleTokenPayload } from '../transaction/SplitFungibleTokenPayload.js';
import {
  SwapBillsWithDustCollectorAttributes,
  SwapBillsWithDustCollectorAttributesArray,
} from '../transaction/SwapBillsWithDustCollectorAttributes.js';
import { SwapBillsWithDustCollectorPayload } from '../transaction/SwapBillsWithDustCollectorPayload.js';
import { TokenIcon } from '../transaction/TokenIcon.js';
import { TransactionOrder, TransactionOrderArray } from '../transaction/TransactionOrder.js';
import { TransactionOrderFactory } from '../transaction/TransactionOrderFactory.js';
import { TransactionPayload, TransactionPayloadArray } from '../transaction/TransactionPayload.js';
import { TransferBillAttributes, TransferBillAttributesArray } from '../transaction/TransferBillAttributes.js';
import { TransferBillToDustCollectorPayload } from '../transaction/TransferBillDustCollectorPayload.js';
import { TransferBillPayload } from '../transaction/TransferBillPayload.js';
import {
  TransferBillToDustCollectorAttributes,
  TransferBillToDustCollectorAttributesArray,
} from '../transaction/TransferBillToDustCollectorAttributes.js';
import {
  TransferFeeCreditAttributes,
  TransferFeeCreditAttributesArray,
} from '../transaction/TransferFeeCreditAttributes.js';
import { TransferFeeCreditPayload } from '../transaction/TransferFeeCreditPayload.js';
import {
  TransferFungibleTokenAttributes,
  TransferFungibleTokenAttributesArray,
} from '../transaction/TransferFungibleTokenAttributes.js';
import { TransferFungibleTokenPayload } from '../transaction/TransferFungibleTokenPayload.js';
import {
  TransferNonFungibleTokenAttributes,
  TransferNonFungibleTokenAttributesArray,
} from '../transaction/TransferNonFungibleTokenAttributes.js';
import { TransferNonFungibleTokenPayload } from '../transaction/TransferNonFungibleTokenPayload.js';
import { UnlockBillAttributes, UnlockBillAttributesArray } from '../transaction/UnlockBillAttributes.js';
import { UnlockBillPayload } from '../transaction/UnlockBillPayload.js';
import {
  UpdateNonFungibleTokenAttributes,
  UpdateNonFungibleTokenAttributesArray,
} from '../transaction/UpdateNonFungibleTokenAttributes.js';
import { UpdateNonFungibleTokenPayload } from '../transaction/UpdateNonFungibleTokenPayload.js';
import { TransactionProof, TransactionProofArray } from '../TransactionProof.js';
import { TransactionProofChainItem } from '../TransactionProofChainItem.js';
import { TransactionRecord, TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { ITransactionProofFactory } from './ITransactionProofFactory.js';
import { IUnitFactory } from './IUnitFactory.js';
import { TransactionProofDto } from './StateApiJsonRpcService.js';

export class TransactionProofFactory implements ITransactionProofFactory {
  private createPayloadAttributesMap = new Map<string, (data: unknown) => Promise<ITransactionPayloadAttributes>>([
    [AddFeeCreditPayload.PAYLOAD_TYPE, this.createAddFeeCreditAttributes.bind(this)],
    [LockFeeCreditPayload.PAYLOAD_TYPE, this.createLockFeeCreditAttributes.bind(this)],
    [BurnFungibleTokenPayload.PAYLOAD_TYPE, this.createBurnFungibleTokenAttributes.bind(this)],
    [CloseFeeCreditPayload.PAYLOAD_TYPE, this.createCloseFeeCreditAttributes.bind(this)],
    [CreateFungibleTokenPayload.PAYLOAD_TYPE, this.createCreateFungibleTokenAttributes.bind(this)],
    [CreateFungibleTokenTypePayload.PAYLOAD_TYPE, this.createCreateFungibleTokenTypeAttributes.bind(this)],
    [CreateNonFungibleTokenPayload.PAYLOAD_TYPE, this.createCreateNonFungibleTokenAttributes.bind(this)],
    [CreateNonFungibleTokenTypePayload.PAYLOAD_TYPE, this.createCreateNonFungibleTokenTypeAttributes.bind(this)],
    [LockBillPayload.PAYLOAD_TYPE, this.createLockBillAttributes.bind(this)],
    [ReclaimFeeCreditPayload.PAYLOAD_TYPE, this.createReclaimFeeCreditAttributes.bind(this)],
    [SplitBillPayload.PAYLOAD_TYPE, this.createSplitBillAttributes.bind(this)],
    [SplitFungibleTokenPayload.PAYLOAD_TYPE, this.createSplitFungibleTokenAttributes.bind(this)],
    [SwapBillsWithDustCollectorPayload.PAYLOAD_TYPE, this.createSwapBillsWithDustCollectorAttributes.bind(this)],
    [TransferBillPayload.PAYLOAD_TYPE, this.createTransferBillAttributes.bind(this)],
    [TransferBillToDustCollectorPayload.PAYLOAD_TYPE, this.createTransferBillToDustCollectorAttributes.bind(this)],
    [TransferFeeCreditPayload.PAYLOAD_TYPE, this.createTransferFeeCreditAttributes.bind(this)],
    [TransferFungibleTokenPayload.PAYLOAD_TYPE, this.createTransferFungibleTokenAttributes.bind(this)],
    [TransferNonFungibleTokenPayload.PAYLOAD_TYPE, this.createTransferNonFungibleTokenAttributes.bind(this)],
    [UnlockBillPayload.PAYLOAD_TYPE, this.createUnlockBillAttributes.bind(this)],
    [UpdateNonFungibleTokenPayload.PAYLOAD_TYPE, this.createUpdateNonFungibleTokenAttributes.bind(this)],
  ]);

  public constructor(
    private readonly cborCodec: ICborCodec,
    private readonly unitFactory: IUnitFactory,
  ) {}

  public async create({
    txRecord,
    txProof,
  }: TransactionProofDto): Promise<TransactionRecordWithProof<TransactionPayload<ITransactionPayloadAttributes>>> {
    return this.createTransactionRecordWithProof(
      (await this.cborCodec.decode(Base16Converter.decode(txRecord))) as TransactionRecordArray,
      (await this.cborCodec.decode(Base16Converter.decode(txProof))) as TransactionProofArray,
    );
  }

  private async createTransactionRecordWithProof(
    transactionRecord: TransactionRecordArray,
    transactionProof: TransactionProofArray,
  ): Promise<TransactionRecordWithProof<TransactionPayload<ITransactionPayloadAttributes>>> {
    return new TransactionRecordWithProof(
      await this.createTransactionRecord(transactionRecord),
      await this.createTransactionProof(transactionProof),
    );
  }

  private async createTransactionRecord([transactionOrder, serverMetadata]: TransactionRecordArray): Promise<
    TransactionRecord<TransactionPayload<ITransactionPayloadAttributes>>
  > {
    return new TransactionRecord(
      await this.createTransactionOrder(transactionOrder),
      await this.createServerMetadata(serverMetadata),
    );
  }

  private async createTransactionProof([
    blockHeaderHash,
    chain,
    unicityCertificate,
  ]: TransactionProofArray): Promise<TransactionProof> {
    return new TransactionProof(
      blockHeaderHash,
      chain.map((item) => new TransactionProofChainItem(item[0], item[1])),
      unicityCertificate,
    );
  }

  private async createTransactionOrder([transactionPayload, ownerProof, feeProof]: TransactionOrderArray): Promise<
    TransactionOrder<TransactionPayload<ITransactionPayloadAttributes>>
  > {
    return TransactionOrderFactory.createTransactionOrder(
      await this.createTransactionPayload(transactionPayload),
      ownerProof,
      feeProof ? feeProof : null,
      this.cborCodec,
    );
  }

  private async createTransactionPayload([
    systemIdentifier,
    type,
    unitId,
    attributes,
    clientMetadata,
  ]: TransactionPayloadArray): Promise<TransactionPayload<ITransactionPayloadAttributes>> {
    return new TransactionPayload(
      type,
      systemIdentifier,
      this.unitFactory.createUnitId(unitId),
      await this.createTransactionPayloadAttributes(type, attributes),
      {
        timeout: BigInt(clientMetadata[0]),
        maxTransactionFee: BigInt(clientMetadata[1]),
        feeCreditRecordId: clientMetadata[2] ? this.unitFactory.createUnitId(clientMetadata[2]) : null,
      },
    );
  }

  private async createServerMetadata([
    actualFee,
    targetUnits,
    successIndicator,
    processingDetails,
  ]: ServerMetadataArray): Promise<ServerMetadata> {
    return new ServerMetadata(
      BigInt(actualFee),
      targetUnits.map((id) => id),
      BigInt(successIndicator),
      processingDetails ? processingDetails : null,
    );
  }

  private async createTransactionPayloadAttributes(
    type: string,
    data: unknown,
  ): Promise<ITransactionPayloadAttributes> {
    if (!this.createPayloadAttributesMap.has(type)) {
      throw new Error(`Could not parse transaction payload attributes for ${type}.`);
    }

    return this.createPayloadAttributesMap.get(type)?.(data) as Promise<ITransactionPayloadAttributes>;
  }

  private async createAddFeeCreditAttributes(data: AddFeeCreditAttributesArray): Promise<AddFeeCreditAttributes> {
    return new AddFeeCreditAttributes(
      new PredicateBytes(data[0]),
      (await this.createTransactionRecordWithProof(
        data[1],
        data[2],
      )) as TransactionRecordWithProof<TransferFeeCreditPayload>,
    );
  }

  private async createLockFeeCreditAttributes(data: LockFeeCreditAttributesArray): Promise<LockFeeCreditAttributes> {
    return new LockFeeCreditAttributes(BigInt(data[0]), data[1]);
  }

  private async createBurnFungibleTokenAttributes(
    data: BurnFungibleTokenAttributesArray,
  ): Promise<BurnFungibleTokenAttributes> {
    return new BurnFungibleTokenAttributes(
      this.unitFactory.createUnitId(data[0] as Uint8Array),
      BigInt(data[1]),
      this.unitFactory.createUnitId(data[2]),
      data[3],
      data[4],
      data[5] ? data[5].map((signature) => signature) : null,
    );
  }

  private async createCloseFeeCreditAttributes(data: CloseFeeCreditAttributesArray): Promise<CloseFeeCreditAttributes> {
    return new CloseFeeCreditAttributes(BigInt(data[0]), this.unitFactory.createUnitId(data[1]), data[2]);
  }

  private async createCreateFungibleTokenAttributes(
    data: CreateFungibleTokenAttributesArray,
  ): Promise<CreateFungibleTokenAttributes> {
    return new CreateFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      this.unitFactory.createUnitId(data[1]),
      BigInt(data[2]),
      data[3] || null,
    );
  }

  private async createCreateFungibleTokenTypeAttributes(
    data: CreateFungibleTokenTypeAttributesArray,
  ): Promise<CreateFungibleTokenTypeAttributes> {
    return new CreateFungibleTokenTypeAttributes(
      data[0],
      data[1],
      new TokenIcon(data[2][0], data[2][1]),
      data[3] ? this.unitFactory.createUnitId(data[3]) : null,
      data[4],
      new PredicateBytes(data[5]),
      new PredicateBytes(data[6]),
      new PredicateBytes(data[7]),
      data[8] || null,
    );
  }

  private async createCreateNonFungibleTokenAttributes(
    data: CreateNonFungibleTokenAttributesArray,
  ): Promise<CreateNonFungibleTokenAttributes> {
    return new CreateNonFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      this.unitFactory.createUnitId(data[1]),
      data[2],
      data[3],
      NonFungibleTokenData.CreateFromBytes(data[4]),
      new PredicateBytes(data[5]),
      data[6] || null,
    );
  }

  private async createCreateNonFungibleTokenTypeAttributes(
    data: CreateNonFungibleTokenTypeAttributesArray,
  ): Promise<CreateNonFungibleTokenTypeAttributes> {
    return new CreateNonFungibleTokenTypeAttributes(
      data[0],
      data[1],
      new TokenIcon(data[2][0], data[2][1]),
      data[3] ? this.unitFactory.createUnitId(data[3]) : null,
      new PredicateBytes(data[4]),
      new PredicateBytes(data[5]),
      new PredicateBytes(data[6]),
      new PredicateBytes(data[7]),
      data[8] || null,
    );
  }

  private async createLockBillAttributes(data: LockBillAttributesArray): Promise<LockBillAttributes> {
    return new LockBillAttributes(BigInt(data[0]), data[1]);
  }

  private async createReclaimFeeCreditAttributes(
    data: ReclaimFeeCreditAttributesArray,
  ): Promise<ReclaimFeeCreditAttributes> {
    return new ReclaimFeeCreditAttributes(
      (await this.createTransactionRecordWithProof(
        data[0],
        data[1],
      )) as TransactionRecordWithProof<CloseFeeCreditPayload>,
      data[2],
    );
  }

  private async createSplitBillAttributes(data: SplitBillAttributesArray): Promise<SplitBillAttributes> {
    return new SplitBillAttributes(
      data[0].map((unit) => new SplitBillUnit(BigInt(unit[0]), new PredicateBytes(unit[1]))),
      BigInt(data[1]),
      data[2],
    );
  }

  private async createSplitFungibleTokenAttributes(
    data: SplitFungibleTokenAttributesArray,
  ): Promise<SplitFungibleTokenAttributes> {
    return new SplitFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      BigInt(data[1]),
      data[2] || null,
      data[3],
      this.unitFactory.createUnitId(data[4]),
      BigInt(data[5]),
      data[6] || null,
    );
  }

  private async createSwapBillsWithDustCollectorAttributes(
    data: SwapBillsWithDustCollectorAttributesArray,
  ): Promise<SwapBillsWithDustCollectorAttributes> {
    const transactionRecordWithProof = new Array<
      Promise<TransactionRecordWithProof<TransferBillToDustCollectorPayload>>
    >();

    for (let i = 0; i < data[1].length; i++) {
      transactionRecordWithProof.push(
        this.createTransactionRecordWithProof(data[1][i], data[2][i]) as Promise<
          TransactionRecordWithProof<TransferBillToDustCollectorPayload>
        >,
      );
    }

    return new SwapBillsWithDustCollectorAttributes(
      new PredicateBytes(data[0]),
      await Promise.all(transactionRecordWithProof),
      BigInt(data[3]),
    );
  }

  private async createTransferBillAttributes(data: TransferBillAttributesArray): Promise<TransferBillAttributes> {
    return new TransferBillAttributes(new PredicateBytes(data[0]), BigInt(data[1]), data[2]);
  }

  private async createTransferBillToDustCollectorAttributes(
    data: TransferBillToDustCollectorAttributesArray,
  ): Promise<TransferBillToDustCollectorAttributes> {
    return new TransferBillToDustCollectorAttributes(
      BigInt(data[0]),
      this.unitFactory.createUnitId(data[1]),
      data[2],
      data[3],
    );
  }

  private async createTransferFeeCreditAttributes(
    data: TransferFeeCreditAttributesArray,
  ): Promise<TransferFeeCreditAttributes> {
    return new TransferFeeCreditAttributes(
      BigInt(data[0]),
      data[1] as unknown as SystemIdentifier,
      this.unitFactory.createUnitId(data[2]) as FeeCreditUnitId,
      BigInt(data[3]),
      BigInt(data[4]),
      data[5] || null,
      data[6],
    );
  }

  private async createTransferFungibleTokenAttributes(
    data: TransferFungibleTokenAttributesArray,
  ): Promise<TransferFungibleTokenAttributes> {
    return new TransferFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      BigInt(data[1]),
      BigInt(data[2]),
      data[3],
      this.unitFactory.createUnitId(data[4]),
      data[5] || null,
    );
  }

  private async createTransferNonFungibleTokenAttributes(
    data: TransferNonFungibleTokenAttributesArray,
  ): Promise<TransferNonFungibleTokenAttributes> {
    return new TransferNonFungibleTokenAttributes(
      new PredicateBytes(data[0]),
      data[1] || null,
      data[2],
      this.unitFactory.createUnitId(data[3]),
      data[4] || null,
    );
  }

  private async createUnlockBillAttributes(data: UnlockBillAttributesArray): Promise<UnlockBillAttributes> {
    return new UnlockBillAttributes(data[0]);
  }

  private async createUpdateNonFungibleTokenAttributes(
    data: UpdateNonFungibleTokenAttributesArray,
  ): Promise<UpdateNonFungibleTokenAttributes> {
    return new UpdateNonFungibleTokenAttributes(
      NonFungibleTokenData.CreateFromBytes(data[0]),
      data[1],
      data[2] || null,
    );
  }
}