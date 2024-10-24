import { FeeCreditUnitType } from '../fees/FeeCreditRecordUnitType.js';
import { IUnitId } from '../IUnitId.js';
import { TokenPartitionUnitType } from '../tokens/TokenPartitionUnitType.js';
import { Base16Converter } from '../util/Base16Converter.js';

export class TokenPartitionUnits {
  private static readonly FUNGIBLE_TOKEN_TYPE = Base16Converter.encode(TokenPartitionUnitType.FUNGIBLE_TOKEN_TYPE);
  private static readonly FUNGIBLE_TOKEN = Base16Converter.encode(TokenPartitionUnitType.FUNGIBLE_TOKEN);
  private static readonly NON_FUNGIBLE_TOKEN_TYPE = Base16Converter.encode(
    TokenPartitionUnitType.NON_FUNGIBLE_TOKEN_TYPE,
  );
  private static readonly NON_FUNGIBLE_TOKEN = Base16Converter.encode(TokenPartitionUnitType.NON_FUNGIBLE_TOKEN);
  private static readonly FEE_CREDIT_RECORD = Base16Converter.encode(FeeCreditUnitType.FEE_CREDIT_RECORD);

  private readonly units = new Map<string, readonly IUnitId[]>();

  public constructor(unitsList: readonly IUnitId[]) {
    const units = new Map<string, IUnitId[]>();

    for (const unit of unitsList) {
      const type = Base16Converter.encode(unit.type);
      if (
        type !== TokenPartitionUnits.FUNGIBLE_TOKEN_TYPE &&
        type !== TokenPartitionUnits.FUNGIBLE_TOKEN &&
        type !== TokenPartitionUnits.NON_FUNGIBLE_TOKEN_TYPE &&
        type !== TokenPartitionUnits.NON_FUNGIBLE_TOKEN &&
        type !== TokenPartitionUnits.FEE_CREDIT_RECORD
      ) {
        console.warn(`Unknown type in money partition: ${unit.type}`);
        continue;
      }

      if (!units.has(type)) {
        units.set(type, []);
      }
      const sortedUnits = units.get(type)!;
      sortedUnits.push(unit);
    }

    for (const [type, sortedUnits] of units) {
      this.units.set(type, Object.freeze(sortedUnits));
    }
  }

  public getFungibleTokenTypes(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnits.FUNGIBLE_TOKEN_TYPE) ?? [];
  }

  public getFungibleTokens(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnits.FUNGIBLE_TOKEN) ?? [];
  }

  public getNonFungibleTokenTypes(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnits.NON_FUNGIBLE_TOKEN_TYPE) ?? [];
  }

  public getNonFungibleTokens(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnits.NON_FUNGIBLE_TOKEN) ?? [];
  }

  public getFeeCreditRecords(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnits.FEE_CREDIT_RECORD) ?? [];
  }
}
