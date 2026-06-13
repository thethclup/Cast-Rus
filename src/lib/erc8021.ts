/**
 * ERC-8021 Transaction Attribution Utilities
 */

import { Attribution } from "ox/erc8021";

export const BUILDER_CODE = "bc_bf05u641"; // From TitleScreen

// All byte encoding is handled by ox to comply with ERC-8021
export const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
});

