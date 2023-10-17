import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { SetStateAction } from "react";

export const addressFormatValidation = (
  address: string,
  setErrorCB: React.Dispatch<SetStateAction<string>>
): boolean => {
  const isValidAddressPolkadotAddress = () => {
    try {
      encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
      return true;
    } catch (error) {
      setErrorCB("Provided address is invalid.");
      return false;
    }
  };
  const isValid = isValidAddressPolkadotAddress();
  return isValid;
};
