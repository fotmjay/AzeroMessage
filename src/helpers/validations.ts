import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";

export const addressFormatValidation = (address: string): boolean => {
  const isValidAddressPolkadotAddress = () => {
    try {
      encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
      return true;
    } catch (error) {
      return false;
    }
  };
  const isValid = isValidAddressPolkadotAddress();
  return isValid;
};
