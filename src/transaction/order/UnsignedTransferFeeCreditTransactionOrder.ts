import { ICborCodec } from "../../codec/cbor/ICborCodec";
import { ISigningService } from "../../signing/ISigningService";
import { TransferFeeCreditAttributes } from "../attribute/TransferFeeCreditAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { IUnsignedTransactionOrder } from "./IUnsignedTransactionOrder";
import { TransactionOrder } from "./TransactionOrder";
import { TransferFeeCreditTransactionOrder } from "./TransferFeeCreditTransactionOrder";

export class UnsignedTransferFeeCreditTransactionOrder implements IUnsignedTransactionOrder<TransferFeeCreditAttributes> {
    public constructor(
        public readonly payload: TransactionPayload<TransferFeeCreditAttributes>,
        public readonly stateUnlock: IPredicate | null,
        public readonly codec: ICborCodec,
    ) {}
    
    public async sign(
        ownerProofSigner: ISigningService,
        feeProofSigner: ISigningService,
    ): Promise<TransactionOrder<TransferFeeCreditAttributes>> {
        const bytes = await this.codec.encode(this.payload.toArray());
        return new TransferFeeCreditTransactionOrder(
        this.payload,
        await ownerProofSigner.sign(bytes),
        await feeProofSigner.sign(bytes),
        this.stateUnlock,
        );
    }
}