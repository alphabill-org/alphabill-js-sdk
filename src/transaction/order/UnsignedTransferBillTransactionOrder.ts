import { ICborCodec } from "../../codec/cbor/ICborCodec";
import { ISigningService } from "../../signing/ISigningService";
import { TransferBillAttributes } from "../attribute/TransferBillAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { IUnsignedTransactionOrder } from "./IUnsignedTransactionOrder";
import { TransactionOrder } from "./TransactionOrder";
import { TransferBillTransactionOrder } from "./TransferBillTransactionOrder";

export class UnsignedTransferBillTransactionOrder implements IUnsignedTransactionOrder<TransferBillAttributes> {
    public constructor(
        public readonly payload: TransactionPayload<TransferBillAttributes>,
        public readonly stateUnlock: IPredicate | null,
        public readonly codec: ICborCodec,
    ) {}
    
    public async sign(
        ownerProofSigner: ISigningService,
        feeProofSigner: ISigningService,
    ): Promise<TransactionOrder<TransferBillAttributes>> {
        const bytes = await this.codec.encode(this.payload.toArray());
        return new TransferBillTransactionOrder(
        this.payload,
        await ownerProofSigner.sign(bytes),
        await feeProofSigner.sign(bytes),
        this.stateUnlock,
        );
    }
}