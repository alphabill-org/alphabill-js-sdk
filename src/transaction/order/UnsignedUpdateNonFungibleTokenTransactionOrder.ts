import { ICborCodec } from "../../codec/cbor/ICborCodec";
import { ISigningService } from "../../signing/ISigningService";
import { UpdateNonFungibleTokenAttributes } from "../attribute/UpdateNonFungibleTokenAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { IUnsignedTransactionOrder } from "./IUnsignedTransactionOrder";
import { TransactionOrder } from "./TransactionOrder";
import { UpdateNonFungibleTokenTransactionOrder } from "./UpdateNonFungibleTokenTransactionOrder";

export class UnsignedUpdateNonFungibleTokenTransactionOrder implements IUnsignedTransactionOrder<UpdateNonFungibleTokenAttributes> {
    public constructor(
        public readonly payload: TransactionPayload<UpdateNonFungibleTokenAttributes>,
        public readonly stateUnlock: IPredicate | null,
        public readonly codec: ICborCodec,
    ) {}
    
    public async sign(
        ownerProofSigner: ISigningService,
        feeProofSigner: ISigningService,
    ): Promise<TransactionOrder<UpdateNonFungibleTokenAttributes>> {
        const bytes = await this.codec.encode(this.payload.toArray());
        return new UpdateNonFungibleTokenTransactionOrder(
        this.payload,
        await ownerProofSigner.sign(bytes),
        await feeProofSigner.sign(bytes),
        this.stateUnlock,
        );
    }
}