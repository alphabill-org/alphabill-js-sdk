import { ICborCodec } from "../../codec/cbor/ICborCodec";
import { ISigningService } from "../../signing/ISigningService";
import { BurnFungibleTokenAttributes } from "../attribute/BurnFungibleTokenAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { BurnFungibleTokenTransactionOrder } from "./BurnFungibleTokenTransactionOrder";
import { IUnsignedTransactionOrder } from "./IUnsignedTransactionOrder";
import { TransactionOrder } from "./TransactionOrder";

export class UnsignedBurnFungibleTokenTransactionOrder implements IUnsignedTransactionOrder<BurnFungibleTokenAttributes> {
    public constructor(
        public readonly payload: TransactionPayload<BurnFungibleTokenAttributes>,
        public readonly stateUnlock: IPredicate | null,
        public readonly codec: ICborCodec,
    ) {}
    
    public async sign(
        ownerProofSigner: ISigningService,
        feeProofSigner: ISigningService,
    ): Promise<TransactionOrder<BurnFungibleTokenAttributes>> {
        const bytes = await this.codec.encode(this.payload.toArray());
        return new BurnFungibleTokenTransactionOrder(
        this.payload,
        await ownerProofSigner.sign(bytes),
        await feeProofSigner.sign(bytes),
        this.stateUnlock,
        );
    }
}