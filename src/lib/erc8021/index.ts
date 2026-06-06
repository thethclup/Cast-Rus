/**
 * ERC-8021 Transaction Attribution Utilities
 */

export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "[BUILDER_CODE]";

export function generateAttributedData(payloadBytes: string): string {
  // In a real scenario, this affixes the builder/attribution code to the tx payload
  return `${payloadBytes}_attributed_to_${ATTRIBUTION_CODE}`;
}
