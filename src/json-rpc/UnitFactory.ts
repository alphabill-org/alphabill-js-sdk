import { Bill } from '../Bill.js';
import { FeeCreditRecord } from '../FeeCreditRecord.js';
import { FungibleToken } from '../FungibleToken.js';
import { IStateProof, IStateTreeCert, IUnit, IUnitTreeCert } from '../IUnit.js';
import { NonFungibleToken } from '../NonFungibleToken.js';
import { UnitType } from '../transaction/UnitType.js';
import { PathItem, StateProof, StateTreeCert, StateTreePathItem, Unit, UnitTreeCert } from '../Unit.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IStateProofDto, IStateTreeCertDto, IUnitDto, IUnitTreeCertDto } from './IUnitDto.js';

const unitDataCreateMap = new Map<string, (input: unknown) => unknown>([
  [UnitType.MONEY_PARTITION_BILL_DATA, Bill.create],
  [UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD, FeeCreditRecord.create],
  [UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN, FungibleToken.create],
  [UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN, NonFungibleToken.create],
  [UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD, FeeCreditRecord.create],
]);

export function createUnit<T>(data: IUnitDto): IUnit<T> {
  const unitId = UnitId.fromBytes(Base16Converter.decode(data.unitId));
  const unitData = unitDataCreateMap.get(unitId.getType().toBase16())?.(data.data);
  if (unitData === undefined) {
    throw new Error(`Unknown unit type: ${unitId.getType().toBase16()}`);
  }

  return new Unit(
    unitId,
    unitData as T,
    Base16Converter.decode(data.ownerPredicate),
    data.stateProof ? createStateProof(data.stateProof) : null,
  );
}

// TODO: Parse unicity cert
function createStateProof(data: IStateProofDto): IStateProof {
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
    data.path?.map((path) => new PathItem(Base16Converter.decode(path.hash), path.directionLeft)) || null,
  );
}
