/**
 * ERC-8021 Transaction Attribution Utilities
 */

import { Attribution } from "ox/erc8021";

export const BUILDER_CODE = "bc_bf05u641";

export const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE]
}) as `0x${string}`;

export const DATA_SUFFIX_HEX = DATA_SUFFIX.slice(2);


