// ERC-8021 Transaction Attribution implementation
// Builder Code specific to this app
export const BUILDER_CODE = 'bc_bf05u641';

export function getAttributionCode(actionType: string): string {
  // Simulates wrapping an action with the ERC-8021 attribution code
  return `[ATTRIBUTION_CODE_${actionType}_${BUILDER_CODE}]`;
}

export function encodeWithAttribution(calldata: string): string {
  // In a real implementation, this would append the attribution code
  // to the smart contract calldata as per ERC-8021 standards.
  return `${calldata}${getAttributionCode('txn')}`;
}
