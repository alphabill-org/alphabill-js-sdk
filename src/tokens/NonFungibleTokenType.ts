import { IStateProof } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { INonFungibleTokenTypeDto } from '../json-rpc/INonFungibleTokenTypeDto.js';
import { createStateProof } from '../json-rpc/StateProofFactory.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { Base64Converter } from '../util/Base64Converter.js';
import { dedent } from '../util/StringUtils.js';
import { TokenIcon } from './TokenIcon.js';

/**
 * Non-fungible token type.
 */
export class NonFungibleTokenType {
  /**
   * Non-fungible token type constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {string} symbol Symbol.
   * @param {string} name Name.
   * @param {TokenIcon} icon Icon.
   * @param {IUnitId | null} parentTypeId Parent type ID.
   * @param {IPredicate} subTypeCreationPredicate Sub type creation predicate.
   * @param {IPredicate} tokenMintingPredicate Token minting predicate.
   * @param {IPredicate} tokenTypeOwnerPredicate Token type owner predicate.
   * @param {IPredicate} dataUpdatePredicate Data update predicate.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenMintingPredicate: IPredicate,
    public readonly tokenTypeOwnerPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly stateProof: IStateProof | null,
  ) {}

  /**
   * Create non-fungible token type from DTO.
   * @param {INonFungibleTokenTypeDto} input Data.
   * @returns {NonFungibleTokenType} Non-fungible token type.
   */
  public static create({ unitId, data, stateProof }: INonFungibleTokenTypeDto): NonFungibleTokenType {
    return new NonFungibleTokenType(
      UnitId.fromBytes(Base16Converter.decode(unitId)),
      data.symbol,
      data.name,
      new TokenIcon(data.icon.type, Base16Converter.decode(data.icon.data)),
      UnitId.fromBytes(Base16Converter.decode(data.parentTypeId)),
      new PredicateBytes(Base64Converter.decode(data.subTypeCreationPredicate)),
      new PredicateBytes(Base64Converter.decode(data.tokenMintingPredicate)),
      new PredicateBytes(Base64Converter.decode(data.tokenTypeOwnerPredicate)),
      new PredicateBytes(Base64Converter.decode(data.dataUpdatePredicate)),
      stateProof ? createStateProof(stateProof) : null,
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
        Symbol: ${this.symbol}
        Name: ${this.name}
        Icon: ${this.icon.toString()}
        Parent Type ID: ${this.parentTypeId?.toString() ?? 'null'}
        Sub Type Creation Predicate: ${this.subTypeCreationPredicate.toString()}
        Token Minting Predicate: ${this.tokenMintingPredicate.toString()}
        Token Type Owner Predicate: ${this.tokenTypeOwnerPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}`;
  }
}
