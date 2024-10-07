import { ICborCodec } from "../../codec/cbor/ICborCodec";
import { ISigningService } from "../../signing/ISigningService";
import { CreateFungibleTokenTypeAttributes } from "../attribute/CreateFungibleTokenTypeAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { CreateFungibleTokenTypeTransactionOrder } from "./CreateFungibleTokenTypeTransactionOrder";
import { IUnsignedTransactionOrder } from "./IUnsignedTransactionOrder";
import { TransactionOrder } from "./TransactionOrder";

export class UnsignedCreateFungibleTokenTypeTransactionOrder implements IUnsignedTransactionOrder<CreateFungibleTokenTypeAttributes> {
    public constructor(
        public readonly payload: TransactionPayload<CreateFungibleTokenTypeAttributes>,
        public readonly stateUnlock: IPredicate | null,
        public readonly codec: ICborCodec,
    ) {}
    
    public async sign(
        ownerProofSigner: ISigningService,
        feeProofSigner: ISigningService,
    ): Promise<TransactionOrder<CreateFungibleTokenTypeAttributes>> {
        const bytes = await this.codec.encode(this.payload.toArray());
        return new CreateFungibleTokenTypeTransactionOrder(
        this.payload,
        await ownerProofSigner.sign(bytes),
        await feeProofSigner.sign(bytes),
        this.stateUnlock,
        );
    }
}