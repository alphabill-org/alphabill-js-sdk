import { Bill } from '../Bill.js';
import { FeeCreditRecord } from '../FeeCreditRecord.js';
import { FungibleToken } from '../FungibleToken.js';
import { FungibleTokenType } from '../FungibleTokenType.js';
import { IStateProof, IStateTreeCert, IUnit, IUnitTreeCert } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { NonFungibleToken } from '../NonFungibleToken.js';
import { NonFungibleTokenType } from '../NonFungibleTokenType.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { PathItem, StateProof, StateTreeCert, StateTreePathItem, UnitTreeCert } from '../StateProof.js';
import { IPredicate } from '../transaction/IPredicate.js';
import { UnitType } from '../transaction/UnitType.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { Base64Converter } from '../util/Base64Converter.js';
import { IStateProofDto, IStateTreeCertDto, IUnitDto, IUnitTreeCertDto } from './IUnitDto.js';

const unitDataCreateMap = new Map<
  string,
  (unitId: IUnitId, ownerPredicate: IPredicate, input: unknown, stateProof: IStateProof | null) => IUnit
>([
  [UnitType.MONEY_PARTITION_BILL_DATA, Bill.create],
  [UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD, FeeCreditRecord.create],
  [UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN, FungibleToken.create],
  [UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE, FungibleTokenType.create],
  [UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN, NonFungibleToken.create],
  [UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN_TYPE, NonFungibleTokenType.create],
  [UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD, FeeCreditRecord.create],
]);

/**
 * Create a unit from a DTO.
 * @param {IUnitDto} data Unit DTO.
 * @returns {T} Unit.
 * @throws {Error} If the unit type is unknown.
 */
export function createUnit<T extends IUnit>(data: IUnitDto): T {
  const unitId = UnitId.fromBytes(Base16Converter.decode(data.unitId));
  const createUnit = unitDataCreateMap.get(unitId.type.toBase16());
  if (createUnit === undefined) {
    throw new Error(`Unknown unit type: ${unitId.type.toBase16()}`);
  }

  return createUnit(
    unitId,
    new PredicateBytes(Base16Converter.decode(data.ownerPredicate)),
    data.data,
    data.stateProof ? createStateProof(data.stateProof) : null,
  ) as T;
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
    data.path?.map((path) => new PathItem(Base64Converter.decode(path.Hash), path.DirectionLeft)) || null,
  );
}
