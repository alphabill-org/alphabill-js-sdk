import { ICborCodec } from "../../codec/cbor/ICborCodec";
import { ISigningService } from "../../signing/ISigningService";
import { CreateNonFungibleTokenTypeAttributes } from "../attribute/CreateNonFungibleTokenTypeAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { CreateNonFungibleTokenTypeTransactionOrder } from "./CreateNonFungibleTokenTypeTransactionOrder";
import { IUnsignedTransactionOrder } from "./IUnsignedTransactionOrder";
import { TransactionOrder } from "./TransactionOrder";

export class UnsignedCreateNonFungibleTokenTypeTransactionOrder implements IUnsignedTransactionOrder<CreateNonFungibleTokenTypeAttributes> {
    public constructor(
        public readonly payload: TransactionPayload<CreateNonFungibleTokenTypeAttributes>,
        public readonly stateUnlock: IPredicate | null,
        public readonly codec: ICborCodec,
    ) {}
    
    public async sign(
        ownerProofSigner: ISigningService,
        feeProofSigner: ISigningService,
    ): Promise<TransactionOrder<CreateNonFungibleTokenTypeAttributes>> {
        const bytes = await this.codec.encode(this.payload.toArray());
        return new CreateNonFungibleTokenTypeTransactionOrder(
        this.payload,
        await ownerProofSigner.sign(bytes),
        await feeProofSigner.sign(bytes),
        this.stateUnlock,
        );
    }
}