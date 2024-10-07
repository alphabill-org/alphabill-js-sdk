import { ICborCodec } from "../../codec/cbor/ICborCodec";
import { ISigningService } from "../../signing/ISigningService";
import { SplitFungibleTokenAttributes } from "../attribute/SplitFungibleTokenAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { IUnsignedTransactionOrder } from "./IUnsignedTransactionOrder";
import { SplitFungibleTokenTransactionOrder } from "./SplitFungibleTokenTransactionOrder";
import { TransactionOrder } from "./TransactionOrder";

export class UnsignedSplitFungibleTokenTransactionOrder implements IUnsignedTransactionOrder<SplitFungibleTokenAttributes> {
    public constructor(
        public readonly payload: TransactionPayload<SplitFungibleTokenAttributes>,
        public readonly stateUnlock: IPredicate | null,
        public readonly codec: ICborCodec,
    ) {}
    
    public async sign(
        ownerProofSigner: ISigningService,
        feeProofSigner: ISigningService,
    ): Promise<TransactionOrder<SplitFungibleTokenAttributes>> {
        const bytes = await this.codec.encode(this.payload.toArray());
        return new SplitFungibleTokenTransactionOrder(
        this.payload,
        await ownerProofSigner.sign(bytes),
        await feeProofSigner.sign(bytes),
        this.stateUnlock,
        );
    }
}