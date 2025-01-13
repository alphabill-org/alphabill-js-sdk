import { IRoundInfoDto } from './json-rpc/IRoundInfoDto.js';

export class RoundInfo {
  public constructor(
    public readonly roundNumber: bigint,
    public readonly epoch: bigint,
  ) {
    this.roundNumber = BigInt(this.roundNumber);
    this.epoch = BigInt(this.epoch);
  }

  public static create(data: IRoundInfoDto): RoundInfo {
    return new RoundInfo(data.roundNumber, data.epochNumber);
  }
}
