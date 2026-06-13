/**
 * ERC-8021 Transaction Attribution Utilities
 */

export const BUILDER_CODE = "bc_bf05u641"; // From TitleScreen
export const ERC8021_MARKER = "80218021802180218021802180218021";

export function stringToHex(str: string): string {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex;
}

export function buildAttributionPayload(originalDataHex: string, builderCode = BUILDER_CODE): string {
  // Clean '0x' prefix if present
  let baseData = originalDataHex.startsWith('0x') ? originalDataHex.slice(2) : originalDataHex;
  
  const codeHex = stringToHex(builderCode);
  const codeLengthByte = (codeHex.length / 2).toString(16).padStart(2, '0');
  const schemaIdByte = "00"; // Schema 0
  
  const suffix = codeHex + codeLengthByte + schemaIdByte + ERC8021_MARKER;
  
  return '0x' + baseData + suffix;
}

export function getAttributionCode(context: string): string {
  return BUILDER_CODE;
}
