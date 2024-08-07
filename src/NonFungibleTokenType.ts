import { IStateProof } from './IUnit.js';
import { IUnitId } from './IUnitId.js';
import { INonFungibleTokenTypeDto } from './json-rpc/INonFungibleTokenTypeDto.js';
import { PredicateBytes } from './PredicateBytes.js';
import { IPredicate } from './transaction/IPredicate.js';
import { TokenIcon } from './transaction/TokenIcon.js';
import { UnitId } from './UnitId.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

/**
 * Non-fungible token type.
 */
export class NonFungibleTokenType {
  /**
   * Non-fungible token type constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {string} symbol Symbol.
   * @param {string} name Name.
   * @param {TokenIcon} icon Icon.
   * @param {IUnitId | null} parentTypeId Parent type ID.
   * @param {IPredicate} subTypeCreationPredicate Sub type creation predicate.
   * @param {IPredicate} tokenCreationPredicate Token creation predicate.
   * @param {IPredicate} invariantPredicate Invariant predicate.
   * @param {IPredicate} dataUpdatePredicate Data update predicate.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly ownerPredicate: IPredicate,
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenCreationPredicate: IPredicate,
    public readonly invariantPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly stateProof: IStateProof | null,
  ) {}

  /**
   * Create non-fungible token type from DTO.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {INonFungibleTokenTypeDto} data Non-fungible token type data.
   * @param {IStateProof} stateProof State proof.
   * @returns {NonFungibleTokenType} Non-fungible token type.
   */
  public static create(
    unitId: IUnitId,
    ownerPredicate: IPredicate,
    data: INonFungibleTokenTypeDto,
    stateProof: IStateProof | null,
  ): NonFungibleTokenType {
    return new NonFungibleTokenType(
      unitId,
      ownerPredicate,
      data.symbol,
      data.name,
      new TokenIcon(data.icon.type, Base16Converter.decode(data.icon.data)),
      UnitId.fromBytes(Base16Converter.decode(data.parentTypeId)),
      new PredicateBytes(Base64Converter.decode(data.subTypeCreationPredicate)),
      new PredicateBytes(Base64Converter.decode(data.tokenCreationPredicate)),
      new PredicateBytes(Base64Converter.decode(data.invariantPredicate)),
      new PredicateBytes(Base64Converter.decode(data.dataUpdatePredicate)),
      stateProof,
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      NonFungibleTokenType
        Unit ID: ${this.unitId.toString()}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Symbol: ${this.symbol}
        Name: ${this.name}
        Icon: ${this.icon.toString()}
        Parent Type ID: ${this.parentTypeId?.toString() ?? 'null'}
        Sub Type Creation Predicate: ${this.subTypeCreationPredicate.toString()}
        Token Creation Predicate: ${this.tokenCreationPredicate.toString()}
        Invariant Predicate: ${this.invariantPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}`;
  }
}
