import { ICborCodec } from "../../codec/cbor/ICborCodec";
import { ISigningService } from "../../signing/ISigningService";
import { SplitBillAttributes } from "../attribute/SplitBillAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { IUnsignedTransactionOrder } from "./IUnsignedTransactionOrder";
import { SplitBillTransactionOrder } from "./SplitBillTransactionOrder";
import { TransactionOrder } from "./TransactionOrder";

export class UnsignedSplitBillTransactionOrder implements IUnsignedTransactionOrder<SplitBillAttributes> {
    public constructor(
        public readonly payload: TransactionPayload<SplitBillAttributes>,
        public readonly stateUnlock: IPredicate | null,
        public readonly codec: ICborCodec,
    ) {}
    
    public async sign(
        ownerProofSigner: ISigningService,
        feeProofSigner: ISigningService,
    ): Promise<TransactionOrder<SplitBillAttributes>> {
        const bytes = await this.codec.encode(this.payload.toArray());
        return new SplitBillTransactionOrder(
        this.payload,
        await ownerProofSigner.sign(bytes),
        await feeProofSigner.sign(bytes),
        this.stateUnlock,
        );
    }
}