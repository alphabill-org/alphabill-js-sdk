import {
  IStateProofPathItem,
  IStateProof,
  IStateTreeCertificate,
  IStateTreePathItem,
  IUnitTreeCertificate,
} from '../IStateProof.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { Base64Converter } from '../util/Base64Converter.js';
import {
  IPathItemDto,
  IStateProofDto,
  IStateTreeCertificateDto,
  IStateTreePathItemDto,
  IUnitTreeCertificateDto,
} from './IUnitDto.js';
import {
  StateProofPathItem,
  StateProof,
  StateTreeCertificate,
  StateTreePathItem,
  UnitTreeCertificate,
} from './StateProof.js';
import { UnicityCertificate } from './UnicityCertificate.js';

export function createStateProof(data: IStateProofDto): IStateProof {
  return new StateProof(
    BigInt(data.version),
    UnitId.fromBytes(Base16Converter.decode(data.unitId)),
    BigInt(data.unitValue),
    Base16Converter.decode(data.unitLedgerHash),
    createUnitTreeCertificate(data.unitTreeCert),
    createStateTreeCertificate(data.stateTreeCert),
    UnicityCertificate.fromCbor(Base16Converter.decode(data.unicityCert)),
  );
}

function createUnitTreeCertificate(data: IUnitTreeCertificateDto): IUnitTreeCertificate {
  return new UnitTreeCertificate(
    Base16Converter.decode(data.txrHash),
    Base16Converter.decode(data.dataHash),
    data.path?.map((data: IPathItemDto) => createPathItem(data)) || null,
  );
}

function createPathItem(data: IPathItemDto): IStateProofPathItem {
  return new StateProofPathItem(data.directionLeft, Base64Converter.decode(data.hash));
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
