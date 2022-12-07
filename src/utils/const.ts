import { toHexString } from "./numbers";

export const expectedChain = toHexString(process.env.NEXT_PUBLIC_CHAIN_ID ?? '0');