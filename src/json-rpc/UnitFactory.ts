import { Bill } from '../Bill.js';
import { FeeCreditRecord } from '../FeeCreditRecord.js';
import { FungibleToken } from '../FungibleToken.js';
import { IStateProof, IStateTreeCert, IUnit, IUnitTreeCert } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { NonFungibleToken } from '../NonFungibleToken.js';
import { UnitType } from '../transaction/UnitType.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IBillDataDto } from './IBillDataDto.js';
import { IFeeCreditRecordDto } from './IFeeCreditRecordDto.js';
import { IFungibleTokenDto } from './IFungibleTokenDto.js';
import { INonFungibleTokenDto } from './INonFungibleTokenDto.js';
import { IStateProofDto, IStateTreeCertDto, IUnitDto, IUnitTreeCertDto } from './IUnitDto.js';

export class UnitFactory {
  private static readonly MONEY_PARTITION_BILL_DATA_HEX = Base16Converter.encode(
    new Uint8Array([UnitType.MONEY_PARTITION_BILL_DATA]),
  );
  private static readonly MONEY_PARTITION_FEE_CREDIT_RECORD_HEX = Base16Converter.encode(
    new Uint8Array([UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD]),
  );
  private static readonly TOKEN_PARTITION_FUNGIBLE_TOKEN_HEX = Base16Converter.encode(
    new Uint8Array([UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN]),
  );
  private static readonly TOKEN_PARTITION_NON_FUNGIBLE_TOKEN_HEX = Base16Converter.encode(
    new Uint8Array([UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN]),
  );
  private static readonly TOKEN_PARTITION_FEE_CREDIT_RECORD_HEX = Base16Converter.encode(
    new Uint8Array([UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD]),
  );

  public async createUnit(data: IUnitDto): Promise<IUnit<unknown>> {
    const unitId = UnitId.fromBytes(Base16Converter.decode(data.unitId));
    return {
      unitId,
      data: await this.createUnitData(unitId, data.data),
      ownerPredicate: Base16Converter.decode(data.ownerPredicate),
      stateProof: data.stateProof ? this.createStateProof(data.stateProof) : null,
    };
  }

  protected async createUnitData(unitId: IUnitId, input: unknown): Promise<unknown> {
    switch (Base16Converter.encode(unitId.getType())) {
      case UnitFactory.MONEY_PARTITION_BILL_DATA_HEX:
        return Bill.create(input as IBillDataDto);
      case UnitFactory.MONEY_PARTITION_FEE_CREDIT_RECORD_HEX:
        return FeeCreditRecord.create(input as IFeeCreditRecordDto);
      case UnitFactory.TOKEN_PARTITION_FUNGIBLE_TOKEN_HEX:
        return FungibleToken.create(input as IFungibleTokenDto);
      case UnitFactory.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN_HEX:
        return NonFungibleToken.create(input as INonFungibleTokenDto);
      case UnitFactory.TOKEN_PARTITION_FEE_CREDIT_RECORD_HEX:
        return FeeCreditRecord.create(input as IFeeCreditRecordDto);
    }

    return input;
  }

  // TODO: Parse unicity cert
  private createStateProof(data: IStateProofDto): IStateProof {
    return {
      unitId: UnitId.fromBytes(Base16Converter.decode(data.unitId)),
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
            unitId: UnitId.fromBytes(Base16Converter.decode(path.unitId)),
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
