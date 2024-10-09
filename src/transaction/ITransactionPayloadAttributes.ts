import { ICborCodec } from '../codec/cbor/ICborCodec.js';

/**
 * Transaction payload attributes interface.
 * @interface ITransactionPayloadAttributes
 */
export interface ITransactionPayloadAttributes {
  encode(cborCodec: ICborCodec): Promise<unknown>;
}
