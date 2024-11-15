import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import {
  IIndexedPathItem,
  IInputRecord,
  IPathItem,
  IShardTreeCertificate,
  IStateProof,
  IStateTreeCertificate,
  IStateTreePathItem,
  IUnicityCertificate,
  IUnicitySeal,
  IUnicityTreeCertificate,
  IUnitTreeCertificate,
} from '../IStateProof.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { Base64Converter } from '../util/Base64Converter.js';
import {
  IIndexedPathItemDto,
  IInputRecordDto,
  IPathItemDto,
  IShardIdDto,
  IShardTreeCertificateDto,
  IStateProofDto,
  IStateTreeCertificateDto,
  IStateTreePathItemDto,
  IUnicityCertificateDto,
  IUnicitySealDto,
  IUnicityTreeCertificateDto,
  IUnitTreeCertificateDto,
} from './IUnitDto.js';
import { PathItem, StateProof, StateTreeCertificate, StateTreePathItem, UnitTreeCertificate } from './StateProof.js';
import {
  IndexedPathItem,
  InputRecord,
  ShardId,
  ShardTreeCertificate,
  UnicityCertificate,
  UnicitySeal,
  UnicityTreeCertificate,
} from './UnicityCertificate.js';

export async function createStateProof(data: IStateProofDto, cborCodec: ICborCodec): Promise<IStateProof> {
  return new StateProof(
    BigInt(data.version),
    UnitId.fromBytes(Base16Converter.decode(data.unitId)),
    BigInt(data.unitValue),
    Base16Converter.decode(data.unitLedgerHash),
    createUnitTreeCertificate(data.unitTreeCert),
    createStateTreeCertificate(data.stateTreeCert),
    createUnicityCertificate(
      (await cborCodec.decode(Base16Converter.decode(data.unicityCert))) as IUnicityCertificateDto,
    ),
  );
}

function createUnitTreeCertificate(data: IUnitTreeCertificateDto): IUnitTreeCertificate {
  return new UnitTreeCertificate(
    Base16Converter.decode(data.txrHash),
    Base16Converter.decode(data.dataHash),
    data.path?.map((data: IPathItemDto) => createPathItem(data)) || null,
  );
}

function createPathItem(data: IPathItemDto): IPathItem {
  return new PathItem(Base64Converter.decode(data.hash), data.directionLeft);
}

function createStateTreeCertificate(data: IStateTreeCertificateDto): IStateTreeCertificate {
  return new StateTreeCertificate(
    Base16Converter.decode(data.leftSummaryHash),
    BigInt(data.leftSummaryValue),
    Base16Converter.decode(data.rightSummaryHash),
    BigInt(data.rightSummaryValue),
    data.path?.map((data: IStateTreePathItemDto) => createStateTreePathItem(data)) || null,
  );
}

function createStateTreePathItem(data: IStateTreePathItemDto): IStateTreePathItem {
  return new StateTreePathItem(
    UnitId.fromBytes(Base16Converter.decode(data.unitId)),
    Base16Converter.decode(data.logsHash),
    BigInt(data.value),
    Base16Converter.decode(data.siblingSummaryHash),
    BigInt(data.siblingSummaryValue),
  );
}

function createUnicityCertificate(data: IUnicityCertificateDto): IUnicityCertificate {
  return new UnicityCertificate(
    data.version,
    createInputRecord(data.inputRecord),
    Base16Converter.decode(data.trHash),
    createShardTreeCertificate(data.shardTreeCertificate),
    createUnicityTreeCertificate(data.unicityTreeCertificate),
    createUnicitySeal(data.unicitySeal),
  );
}

function createInputRecord(data: IInputRecordDto | null): IInputRecord | null {
  if (data == null) {
    return null;
  }
  return new InputRecord(
    data.version,
    Base16Converter.decode(data.previousHash),
    Base16Converter.decode(data.hash),
    Base16Converter.decode(data.blockHash),
    Base16Converter.decode(data.summaryValue),
    data.timestamp,
    data.roundNumber,
    data.epoch,
    data.sumOfEarnedFees,
  );
}

function createShardTreeCertificate(data: IShardTreeCertificateDto): IShardTreeCertificate {
  return new ShardTreeCertificate(
    createShardId(data.shard),
    data.siblingHashes.map((data: string) => Base16Converter.decode(data)),
  );
}

function createShardId(data: IShardIdDto) {
  return new ShardId(data.bits, data.length);
}

function createUnicityTreeCertificate(data: IUnicityTreeCertificateDto | null): IUnicityTreeCertificate | null {
  if (data == null) {
    return null;
  }
  return new UnicityTreeCertificate(
    data.version,
    data.partitionIdentifier,
    data.hashSteps?.map((data: IIndexedPathItemDto) => createIndexedPathItem(data)) ?? null,
    Base16Converter.decode(data.partitionDescriptionHash),
  );
}

function createIndexedPathItem(data: IIndexedPathItemDto): IIndexedPathItem {
  return new IndexedPathItem(Base16Converter.decode(data.hash), Base16Converter.decode(data.key));
}

function createUnicitySeal(data: IUnicitySealDto | null): IUnicitySeal | null {
  if (data == null) {
    return null;
  }
  return new UnicitySeal(
    data.version,
    data.rootChainRoundNumber,
    data.timestamp,
    Base16Converter.decode(data.previousHash),
    Base16Converter.decode(data.hash),
    data.signatures,
  );
}
