import { isAddress, isHash } from 'viem';

import type { SearchAddressMapping, SearchMapping } from 'types/api/search';

export function isXvmHash(hash: string) {
  if (hash && !hash.startsWith('0x')) {
    return Boolean(hash && isHash(`0x${ hash }`));
  }
  return Boolean(hash && isHash(`0x${ hash }`));
}
export function isFormatHash(hash: string) {
  if (hash && !hash.startsWith('0x')) {
    return `0x${ hash }`;
  }
  return hash;
}
export function isXvmAddress(hash: string) {
  if (hash && !hash.startsWith('0x')) {
    return Boolean(hash && isAddress(`0x${ hash }`));
  }
  return Boolean(hash && isAddress(`0x${ hash }`));
}

export function isEnable(hashMapping?: SearchMapping, addressMapping?: SearchAddressMapping) {
  return Boolean((hashMapping && hashMapping.data?.xvmHash) || (addressMapping && addressMapping.data?.xvmAddress));
}

export function getSearchItem(
  hashMapping?: SearchMapping,
  addressMapping?: SearchAddressMapping,
) {
  if (hashMapping && hashMapping.data?.xvmHash) {
    return hashMapping.data.xvmHash;
  }
  if (addressMapping && addressMapping.data?.xvmAddress) {
    return addressMapping.data.xvmAddress;
  }
  return undefined;
}
