import { IStateProof, IStateTreeCert, IUnitTreeCert } from '../IUnit.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { Base64Converter } from '../util/Base64Converter.js';
import { IStateProofDto, IStateTreeCertDto, IUnitTreeCertDto } from './IUnitDto.js';
import { PathItem, StateProof, StateTreeCert, StateTreePathItem, UnitTreeCert } from './StateProof.js';

// TODO: Parse unicity certificate
export function createStateProof(data: IStateProofDto): IStateProof {
  return new StateProof(
    UnitId.fromBytes(Base16Converter.decode(data.unitId)),
    BigInt(data.unitValue),
    Base16Converter.decode(data.unitLedgerHash),
    createUnitTreeCert(data.unitTreeCert),
    createStateTreeCert(data.stateTreeCert),
    data.unicityCert,
  );
}

function createStateTreeCert(data: IStateTreeCertDto): IStateTreeCert {
  return new StateTreeCert(
    Base16Converter.decode(data.leftSummaryHash),
    BigInt(data.leftSummaryValue),
    Base16Converter.decode(data.rightSummaryHash),
    BigInt(data.rightSummaryValue),
    data.path?.map(
      (path) =>
        new StateTreePathItem(
          UnitId.fromBytes(Base16Converter.decode(path.unitId)),
          Base16Converter.decode(path.logsHash),
          BigInt(path.value),
          Base16Converter.decode(path.siblingSummaryHash),
          BigInt(path.siblingSummaryValue),
        ),
    ) || null,
  );
}

function createUnitTreeCert(data: IUnitTreeCertDto): IUnitTreeCert {
  return new UnitTreeCert(
    Base16Converter.decode(data.txrHash),
    Base16Converter.decode(data.dataHash),
    data.path?.map((path) => new PathItem(Base64Converter.decode(path.Hash), path.DirectionLeft)) || null,
  );
}
