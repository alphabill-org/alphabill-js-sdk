import { ICborCodec } from "../../codec/cbor/ICborCodec";
import { ISigningService } from "../../signing/ISigningService";
import { JoinFungibleTokenAttributes } from "../attribute/JoinFungibleTokenAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { IUnsignedTransactionOrder } from "./IUnsignedTransactionOrder";
import { JoinFungibleTokenTransactionOrder } from "./JoinFungibleTokenTransactionOrder";
import { TransactionOrder } from "./TransactionOrder";

export class UnsignedJoinFungibleTokenTransactionOrder implements IUnsignedTransactionOrder<JoinFungibleTokenAttributes> {
    public constructor(
        public readonly payload: TransactionPayload<JoinFungibleTokenAttributes>,
        public readonly stateUnlock: IPredicate | null,
        public readonly codec: ICborCodec,
    ) {}
    
    public async sign(
        ownerProofSigner: ISigningService,
        feeProofSigner: ISigningService,
    ): Promise<TransactionOrder<JoinFungibleTokenAttributes>> {
        const bytes = await this.codec.encode(this.payload.toArray());
        return new JoinFungibleTokenTransactionOrder(
        this.payload,
        await ownerProofSigner.sign(bytes),
        await feeProofSigner.sign(bytes),
        this.stateUnlock,
        );
    }
}