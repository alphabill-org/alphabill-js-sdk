import { IUnitId } from '../IUnitId.js';
import { IFungibleTokenTypeDto } from '../json-rpc/IFungibleTokenTypeDto.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { StateProof } from '../unit/StateProof.js';
import { Unit } from '../Unit.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { Base64Converter } from '../util/Base64Converter.js';
import { dedent } from '../util/StringUtils.js';
import { TokenIcon } from './TokenIcon.js';

/**
 * Fungible token type.
 */
export class FungibleTokenType extends Unit {
  /**
   * Fungible token type constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {number} networkIdentifier Network ID.
   * @param {number} partitionIdentifier Partition ID.
   * @param {bigint} version Version.
   * @param {string} symbol Symbol.
   * @param {string | null} name Name.
   * @param {TokenIcon | null} icon Icon.
   * @param {IUnitId | null} parentTypeId Parent type ID.
   * @param {number} decimalPlaces Decimal places.
   * @param {IPredicate} subTypeCreationPredicate Sub type creation predicate.
   * @param {IPredicate} tokenMintingPredicate Token minting predicate.
   * @param {IPredicate} tokenTypeOwnerPredicate Token type owner predicate.
   * @param {StateProof | null} stateProof State proof.
   */
  public constructor(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    public readonly version: bigint,
    public readonly symbol: string,
    public readonly name: string | null,
    public readonly icon: TokenIcon | null,
    public readonly parentTypeId: IUnitId | null,
    public readonly decimalPlaces: number,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenMintingPredicate: IPredicate,
    public readonly tokenTypeOwnerPredicate: IPredicate,
  ) {
    super(unitId, networkIdentifier, partitionIdentifier, stateProof);
    this.version = BigInt(this.version);
  }

  /**
   * Create fungible token type from DTO.
   * @param {IUnitId} unitId Unit id.
   * @param {number} networkIdentifier Network identifier.
   * @param {number} partitionIdentifier Partition identifier.
   * @param {StateProof | null} stateProof State proof.
   * @param {IFungibleTokenTypeDto} data Fungible token type data.
   * @returns {FungibleTokenType} Fungible token type.
   */
  public static create(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    data: IFungibleTokenTypeDto,
  ): FungibleTokenType {
    return new FungibleTokenType(
      unitId,
      networkIdentifier,
      partitionIdentifier,
      stateProof,
      data.version,
      data.symbol,
      data.name,
      data.icon ? new TokenIcon(data.icon.type, Base64Converter.decode(data.icon.data)) : null,
      data.parentTypeId ? UnitId.fromBytes(Base16Converter.decode(data.parentTypeId)) : null,
      data.decimalPlaces,
      new PredicateBytes(Base16Converter.decode(data.subTypeCreationPredicate)),
      new PredicateBytes(Base16Converter.decode(data.tokenMintingPredicate)),
      new PredicateBytes(Base16Converter.decode(data.tokenTypeOwnerPredicate)),
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
        Version: ${this.version}
        Symbol: ${this.symbol}
        Name: ${this.name}
        Icon: ${this.icon?.toString() ?? 'null'}
        Parent Type ID: ${this.parentTypeId?.toString() ?? 'null'}
        Decimal Places: ${this.decimalPlaces}
        Sub Type Creation Predicate: ${this.subTypeCreationPredicate.toString()}
        Token Minting Predicate: ${this.tokenMintingPredicate.toString()}
        Token Type Owner Predicate: ${this.tokenTypeOwnerPredicate.toString()}`;
  }
}
