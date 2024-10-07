import { ICborCodec } from "../../codec/cbor/ICborCodec";
import { ISigningService } from "../../signing/ISigningService";
import { CreateNonFungibleTokenAttributes } from "../attribute/CreateNonFungibleTokenAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { CreateNonFungibleTokenTransactionOrder } from "./CreateNonFungibleTokenTransactionOrder";
import { IUnsignedTransactionOrder } from "./IUnsignedTransactionOrder";
import { TransactionOrder } from "./TransactionOrder";

export class UnsignedCreateNonFungibleTokenTransactionOrder implements IUnsignedTransactionOrder<CreateNonFungibleTokenAttributes> {
    public constructor(
        public readonly payload: TransactionPayload<CreateNonFungibleTokenAttributes>,
        public readonly stateUnlock: IPredicate | null,
        public readonly codec: ICborCodec,
    ) {}
    
    public async sign(
        ownerProofSigner: ISigningService,
        feeProofSigner: ISigningService,
    ): Promise<TransactionOrder<CreateNonFungibleTokenAttributes>> {
        const bytes = await this.codec.encode(this.payload.toArray());
        return new CreateNonFungibleTokenTransactionOrder(
        this.payload,
        await ownerProofSigner.sign(bytes),
        await feeProofSigner.sign(bytes),
        this.stateUnlock,
        );
    }
}