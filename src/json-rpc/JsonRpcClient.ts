import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IJsonRpcService } from './IJsonRpcService.js';
import { JsonRpcError } from './JsonRpcError.js';

/**
 * State API JSON-RPC service.
 * @implements {IStateApiService}
 */
export class JsonRpcClient {
  public constructor(
    private readonly service: IJsonRpcService,
    public readonly cborCodec: ICborCodec,
  ) {}

  /**
   * @see {IStateApiService.getRoundNumber}
   */
  public async getRoundNumber(): Promise<bigint> {
    return BigInt(await this.request('state_getRoundNumber'));
  }

  /**
   * @see {IStateApiService.getUnitsByOwnerId}
   */
  public async getUnitsByOwnerId(ownerId: Uint8Array): Promise<IUnitId[]> {
    const response = await this.request<string[] | null>('state_getUnitsByOwnerID', Base16Converter.encode(ownerId));

    const identifiers: IUnitId[] = [];
    for (const id of response ?? []) {
      identifiers.push(UnitId.fromBytes(Base16Converter.decode(id)));
    }

    return identifiers;
  }

  /**
   * @see {IStateApiService.getBlock}
   */
  public async getBlock(blockNumber: bigint): Promise<Uint8Array> {
    const response = (await this.request('state_getBlock', String(blockNumber))) as string;
    return Base16Converter.decode(response);
  }

  /**
   * Send a JSON-RPC request.
   * @see {IJsonRpcService.request}
   */
  protected async request<T>(method: string, ...params: unknown[]): Promise<T> {
    const response = await this.service.request(method, params || null);
    if (response.error) {
      throw new JsonRpcError(response.error);
    }

    return response.result as T;
  }
}
