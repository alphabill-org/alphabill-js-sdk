import { ICborCodec } from '../../codec/cbor/ICborCodec.js';

export interface ITransactionOrderProof {
  encode(cborCodec: ICborCodec): Promise<Uint8Array>;
}