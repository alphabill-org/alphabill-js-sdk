import { FeeCreditRecord } from '../FeeCreditRecord.js';
import { FungibleToken } from '../FungibleToken.js';
import { IUnitId } from '../IUnitId.js';
import { NonFungibleToken } from '../NonFungibleToken.js';
import { UnitType } from '../transaction/UnitType.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IFeeCreditRecordDto } from './IFeeCreditRecordDto.js';
import { IFungibleTokenDto } from './IFungibleTokenDto.js';
import { INonFungibleTokenDto } from './INonFungibleTokenDto.js';
import { UnitFactory } from './UnitFactory.js';

export class TokenPartitionUnitFactory extends UnitFactory {
  private static readonly FUNGIBLE_TOKEN_HEX = Base16Converter.encode(
    new Uint8Array([UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN]),
  );
  private static readonly NON_FUNGIBLE_TOKEN_HEX = Base16Converter.encode(
    new Uint8Array([UnitType.TOKEN_PARTITION_NON_FUNGIBLE_TOKEN]),
  );
  private static readonly FEE_CREDIT_RECORD_HEX = Base16Converter.encode(
    new Uint8Array([UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD]),
  );

  protected async createUnitData(unitId: IUnitId, input: unknown): Promise<unknown> {
    switch (Base16Converter.encode(unitId.getType())) {
      case TokenPartitionUnitFactory.FUNGIBLE_TOKEN_HEX:
        return FungibleToken.Create(input as IFungibleTokenDto);
      case TokenPartitionUnitFactory.NON_FUNGIBLE_TOKEN_HEX:
        return NonFungibleToken.Create(input as INonFungibleTokenDto);
      case TokenPartitionUnitFactory.FEE_CREDIT_RECORD_HEX:
        return FeeCreditRecord.Create(input as IFeeCreditRecordDto);
    }

    return input;
  }
}
