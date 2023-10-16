import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { SetStateAction } from "react";

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

export const validateTextSent = (message: string, setErrorCB: React.Dispatch<SetStateAction<string>>): boolean => {
  const trimText = message.trim();
  if (trimText.length === 0) {
    setErrorCB("Message cannot be empty.");
    return false;
  } else if (trimText.length > 400) {
    setErrorCB("Message cannot be longer than 400 characters.");
    return false;
  }
  return true;
};
