import { IStateProof } from './IUnit.js';
import { IUnitId } from './IUnitId.js';
import { IFungibleTokenTypeDto } from './json-rpc/IFungibleTokenTypeDto.js';
import { PredicateBytes } from './PredicateBytes.js';
import { IPredicate } from './transaction/IPredicate.js';
import { TokenIcon } from './transaction/TokenIcon.js';
import { UnitId } from './UnitId.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

/**
 * Fungible token type.
 */
export class FungibleTokenType {
  /**
   * Fungible token type constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {string} symbol Symbol.
   * @param {string} name Name.
   * @param {TokenIcon} icon Icon.
   * @param {IUnitId} parentTypeId Parent type ID.
   * @param {number} decimalPlaces Decimal places.
   * @param {IPredicate} subTypeCreationPredicate Sub type creation predicate.
   * @param {IPredicate} tokenCreationPredicate Token creation predicate.
   * @param {IPredicate} invariantPredicate Invariant predicate.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly ownerPredicate: IPredicate,
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly decimalPlaces: number,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenCreationPredicate: IPredicate,
    public readonly invariantPredicate: IPredicate,
    public readonly stateProof: IStateProof | null,
  ) {}

  /**
   * Create fungible token type from DTO.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {IFungibleTokenTypeDto} data Fungible token type data.
   * @param {IStateProof} stateProof State proof.
   * @returns {FungibleTokenType} Fungible token type.
   */
  public static create(
    unitId: IUnitId,
    ownerPredicate: IPredicate,
    data: IFungibleTokenTypeDto,
    stateProof: IStateProof | null,
  ): FungibleTokenType {
    return new FungibleTokenType(
      unitId,
      ownerPredicate,
      data.symbol,
      data.name,
      new TokenIcon(data.icon.type, Base16Converter.decode(data.icon.data)),
      UnitId.fromBytes(Base16Converter.decode(data.parentTypeId)),
      data.decimalPlaces,
      new PredicateBytes(Base64Converter.decode(data.subTypeCreationPredicate)),
      new PredicateBytes(Base64Converter.decode(data.tokenCreationPredicate)),
      new PredicateBytes(Base64Converter.decode(data.invariantPredicate)),
      stateProof,
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      FungibleTokenType
        Unit ID: ${this.unitId.toString()}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Symbol: ${this.symbol}
        Name: ${this.name}
        Icon: ${this.icon.toString()}
        Decimal Places: ${this.decimalPlaces}
        Parent Type ID: ${this.parentTypeId?.toString() ?? 'null'}
        Sub Type Creation Predicate: ${this.subTypeCreationPredicate.toString()}
        Token Creation Predicate: ${this.tokenCreationPredicate.toString()}
        Invariant Predicate: ${this.invariantPredicate.toString()}`;
  }
}
