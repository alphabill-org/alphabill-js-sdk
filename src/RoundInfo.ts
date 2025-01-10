export class RoundInfo {
  public constructor(
    public readonly roundNumber: bigint,
    public readonly epoch: bigint,
  ) {
    this.roundNumber = BigInt(this.roundNumber);
    this.epoch = BigInt(this.epoch);
  }
}
