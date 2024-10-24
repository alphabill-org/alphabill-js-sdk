import { IUnitId } from '../IUnitId.js';
import { TokenPartitionUnitType } from '../tokens/TokenPartitionUnitType.js';

export class TokenPartitionUnits {
  private readonly units = new Map<TokenPartitionUnitType, readonly IUnitId[]>();

  public constructor(unitsList: readonly IUnitId[]) {
    const units = new Map<TokenPartitionUnitType, IUnitId[]>();

    for (const unit of unitsList) {
      const type = Number(unit.type) as TokenPartitionUnitType;
      if (!TokenPartitionUnitType[type]) {
        console.warn(`Unknown type in token partition: ${unit.type}`);
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
    return this.units.get(TokenPartitionUnitType.FUNGIBLE_TOKEN_TYPE) ?? [];
  }

  public getFungibleTokens(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnitType.FUNGIBLE_TOKEN) ?? [];
  }

  public getNonFungibleTokenTypes(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnitType.NON_FUNGIBLE_TOKEN_TYPE) ?? [];
  }

  public getNonFungibleTokens(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnitType.NON_FUNGIBLE_TOKEN) ?? [];
  }

  public getFeeCreditRecords(): readonly IUnitId[] {
    return this.units.get(TokenPartitionUnitType.FEE_CREDIT_RECORD) ?? [];
  }
}
