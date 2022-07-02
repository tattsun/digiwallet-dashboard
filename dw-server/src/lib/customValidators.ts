export function isEthereumAddress(address: unknown) {
  if (typeof address !== 'string') {
    return false;
  }
  const regex = /^0x[a-fA-F0-9]{40}$/;
  return regex.test(address);
}
