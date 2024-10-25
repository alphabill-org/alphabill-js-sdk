import { FeeCreditUnitType } from '../fees/FeeCreditRecordUnitType.js';
import { IUnitId } from '../IUnitId.js';
import { TokenPartitionUnitType } from '../tokens/TokenPartitionUnitType.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { UnitIdList } from './UnitIdList.js';

export class TokenPartitionUnitIdList extends UnitIdList {
  private static readonly FUNGIBLE_TOKEN_TYPE = Base16Converter.encode(TokenPartitionUnitType.FUNGIBLE_TOKEN_TYPE);
  private static readonly FUNGIBLE_TOKEN = Base16Converter.encode(TokenPartitionUnitType.FUNGIBLE_TOKEN);
  private static readonly NON_FUNGIBLE_TOKEN_TYPE = Base16Converter.encode(
    TokenPartitionUnitType.NON_FUNGIBLE_TOKEN_TYPE,
  );
  private static readonly NON_FUNGIBLE_TOKEN = Base16Converter.encode(TokenPartitionUnitType.NON_FUNGIBLE_TOKEN);
  private static readonly FEE_CREDIT_RECORD = Base16Converter.encode(FeeCreditUnitType.FEE_CREDIT_RECORD);

  public constructor(units: readonly IUnitId[]) {
    super(units);
  }

  public get fungibleTokenTypes(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnitIdList.FUNGIBLE_TOKEN_TYPE) ?? [];
  }

  public get fungibleTokens(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnitIdList.FUNGIBLE_TOKEN) ?? [];
  }

  public get nonFungibleTokenTypes(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnitIdList.NON_FUNGIBLE_TOKEN_TYPE) ?? [];
  }

  public get nonFungibleTokens(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnitIdList.NON_FUNGIBLE_TOKEN) ?? [];
  }

  public get feeCreditRecords(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnitIdList.FEE_CREDIT_RECORD) ?? [];
  }
}
