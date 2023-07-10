import { toHexString } from "./numbers";

export const expectedChain = toHexString(process.env.NEXT_PUBLIC_CHAIN_ID ?? '0');

export const REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS = /^[0-9]+$/;
export const REGEX_PATTERN_NUMBER_WITH_TWO_DECIMALS = /^[0-9]+(\.[0-9]{0,2})?$/;
