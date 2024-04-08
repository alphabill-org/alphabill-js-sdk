import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

const payloadAttributesMap = new Map<string, (data: unknown) => ITransactionPayloadAttributes>();
export function PayloadAttribute(payloadType: string) {
  return function <T extends ITransactionPayloadAttributes>(
    target: { fromArray: (data: unknown) => T },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ClassDecoratorContext,
  ): void {
    payloadAttributesMap.set(payloadType, target.fromArray);
  };
}

export function createAttribute(type: string, data: unknown): ITransactionPayloadAttributes {
  const payloadAttribute = payloadAttributesMap.get(type);
  if (payloadAttribute === undefined) {
    throw new Error(`Could not parse transaction payload attributes for ${type}.`);
  }

  return payloadAttribute(data);
}
