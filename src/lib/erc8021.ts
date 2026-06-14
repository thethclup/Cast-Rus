/**
 * ERC-8021 Transaction Attribution Utilities
 */

export const BUILDER_CODE = "bc_bf05u641";

function encodeBuilderCode(code: string): string {
  const encoded = Array.from(new TextEncoder().encode(code))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  // ERC-8021 suffix: 0x + version(07) + encoded code + 8021 marker repeated
  return '0x07' + encoded + '80218021802180218021802180218021';
}

export const DATA_SUFFIX = encodeBuilderCode(BUILDER_CODE) as `0x${string}`;
export const DATA_SUFFIX_HEX = DATA_SUFFIX.slice(2);


