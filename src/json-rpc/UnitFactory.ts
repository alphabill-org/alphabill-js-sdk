import { IStateProof, IStateTreeCert, IUnit, IUnitTreeCert } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IStateProofDto, IStateTreeCertDto, IUnitDto, IUnitTreeCertDto } from './IUnitDto.js';
import { IUnitFactory } from './IUnitFactory.js';

export abstract class UnitFactory implements IUnitFactory {
  public static createUnitIdFromBytes(id: Uint8Array): IUnitId {
    return new UnitId(id.slice(-1), id);
  }

  public createUnitId(id: Uint8Array): IUnitId {
    return UnitFactory.createUnitIdFromBytes(id);
  }

  public async createUnit(data: IUnitDto): Promise<IUnit<unknown>> {
    const unitId = this.createUnitId(Base16Converter.decode(data.unitId));
    return {
      unitId,
      data: await this.createUnitData(unitId, data.data),
      ownerPredicate: Base16Converter.decode(data.ownerPredicate),
      stateProof: data.stateProof ? this.createStateProof(data.stateProof) : null,
    };
  }

  protected abstract createUnitData(unitId: IUnitId, data: unknown): Promise<unknown>;

  // TODO: Parse unicity cert
  private createStateProof(data: IStateProofDto): IStateProof {
    return {
      unitId: this.createUnitId(Base16Converter.decode(data.unitId)),
      unitValue: BigInt(data.unitValue),
      unitLedgerHash: Base16Converter.decode(data.unitLedgerHash),
      unitTreeCert: this.createUnitTreeCert(data.unitTreeCert),
      stateTreeCert: this.createStateTreeCert(data.stateTreeCert),
      unicityCertificate: data.unicityCert,
    };
  }

  private createStateTreeCert(data: IStateTreeCertDto): IStateTreeCert {
    return {
      leftSummaryHash: Base16Converter.decode(data.leftSummaryHash),
      leftSummaryValue: BigInt(data.leftSummaryValue),
      rightSummaryHash: Base16Converter.decode(data.rightSummaryHash),
      rightSummaryValue: BigInt(data.rightSummaryValue),
      path:
        data.path?.map((path) => {
          return {
            unitId: this.createUnitId(Base16Converter.decode(path.unitId)),
            logsHash: Base16Converter.decode(path.logsHash),
            value: BigInt(path.value),
            siblingSummaryHash: Base16Converter.decode(path.siblingSummaryHash),
            siblingSummaryValue: BigInt(path.siblingSummaryValue),
          };
        }) || null,
    };
  }

  private createUnitTreeCert(data: IUnitTreeCertDto): IUnitTreeCert {
    return {
      transactionRecordHash: Base16Converter.decode(data.txrHash),
      unitDataHash: Base16Converter.decode(data.dataHash),
      path:
        data.path?.map((item) => ({
          hash: Base16Converter.decode(item.hash),
          directionLeft: item.directionLeft,
        })) || null,
    };
  }
}
