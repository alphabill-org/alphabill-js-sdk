import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

const payloadAttributesMap = new Map<string, (data: unknown) => ITransactionPayloadAttributes>();
export function PayloadAttribute(
  target: { fromArray: (data: unknown) => ITransactionPayloadAttributes; PAYLOAD_TYPE: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: ClassDecoratorContext,
): void {
  payloadAttributesMap.set(target.PAYLOAD_TYPE, target.fromArray);
}

export function createAttribute(type: string, data: unknown): ITransactionPayloadAttributes {
  const payloadAttribute = payloadAttributesMap.get(type);
  if (payloadAttribute === undefined) {
    throw new Error(`Could not parse transaction payload attributes for ${type}.`);
  }

  return payloadAttribute(data);
}
