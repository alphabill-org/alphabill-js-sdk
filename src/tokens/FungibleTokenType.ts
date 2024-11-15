import { IStateProof } from '../IStateProof.js';
import { IUnitId } from '../IUnitId.js';
import { IFungibleTokenTypeDto } from '../json-rpc/IFungibleTokenTypeDto.js';
import { createStateProof } from '../json-rpc/StateProofFactory.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { Base64Converter } from '../util/Base64Converter.js';
import { dedent } from '../util/StringUtils.js';
import { TokenIcon } from './TokenIcon.js';

/**
 * Fungible token type.
 */
export class FungibleTokenType {
  /**
   * Fungible token type constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {number} networkIdentifier Network ID.
   * @param {number} partitionIdentifier Partition ID.
   * @param {string} symbol Symbol.
   * @param {string} name Name.
   * @param {TokenIcon} icon Icon.
   * @param {IUnitId} parentTypeId Parent type ID.
   * @param {number} decimalPlaces Decimal places.
   * @param {IPredicate} subTypeCreationPredicate Sub type creation predicate.
   * @param {IPredicate} tokenMintingPredicate Token minting predicate.
   * @param {IPredicate} tokenTypeOwnerPredicate Token type owner predicate.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly networkIdentifier: number,
    public readonly partitionIdentifier: number,
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly decimalPlaces: number,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenMintingPredicate: IPredicate,
    public readonly tokenTypeOwnerPredicate: IPredicate,
    public readonly stateProof: IStateProof | null,
  ) {}

  /**
   * Create fungible token type from DTO.
   * @param {IFungibleTokenTypeDto} input Data.
   * @returns {FungibleTokenType} Fungible token type.
   */
  public static create({ unitId, networkId, partitionId, data, stateProof }: IFungibleTokenTypeDto): FungibleTokenType {
    return new FungibleTokenType(
      UnitId.fromBytes(Base16Converter.decode(unitId)),
      Number(networkId),
      Number(partitionId),
      data.symbol,
      data.name,
      new TokenIcon(data.icon.type, Base16Converter.decode(data.icon.data)),
      UnitId.fromBytes(Base16Converter.decode(data.parentTypeId)),
      data.decimalPlaces,
      new PredicateBytes(Base64Converter.decode(data.subTypeCreationPredicate)),
      new PredicateBytes(Base64Converter.decode(data.tokenMintingPredicate)),
      new PredicateBytes(Base64Converter.decode(data.tokenTypeOwnerPredicate)),
      stateProof ? createStateProof(stateProof) : null,
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
        Network ID: ${this.networkIdentifier}
        Partition ID: ${this.partitionIdentifier}
        Symbol: ${this.symbol}
        Name: ${this.name}
        Icon: ${this.icon.toString()}
        Decimal Places: ${this.decimalPlaces}
        Parent Type ID: ${this.parentTypeId?.toString() ?? 'null'}
        Sub Type Creation Predicate: ${this.subTypeCreationPredicate.toString()}
        Token Minting Predicate: ${this.tokenMintingPredicate.toString()}
        Token Type Owner Predicate: ${this.tokenTypeOwnerPredicate.toString()}`;
  }
}
