import { toHexString } from "./numbers";

export const expectedChainIdHex = toHexString(process.env.NEXT_PUBLIC_CHAIN_ID ?? '0');
