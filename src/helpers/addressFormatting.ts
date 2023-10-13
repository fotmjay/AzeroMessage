export const shortenAddressWithEllipsis = (address: string): string => {
  const shortenedAddress = address.slice(0, 8) + "......" + address.slice(-8);
  return shortenedAddress;
};
