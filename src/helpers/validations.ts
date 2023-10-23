import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { SetStateAction } from "react";

export const addressFormatValidation = (
  address: string,
  setErrorCB: React.Dispatch<SetStateAction<string>>
): boolean => {
  const isValidAddressPolkadotAddress = () => {
    setErrorCB("");
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

export const validatePassword = (password: string, confirmPassword: string): string => {
  if (password.length + confirmPassword.length < 16) {
    return "Password needs to be at least 8 characters.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  if (passwordFormat.test(password)) {
    return "Password needs to be at least 8 characters, have at least one uppercase and lowercase letter, one number and one special character.";
  }
  return "";
};

// returns true if NOT: minimum eight characters, one uppercase letter, one lowercase letter
// one number, one special character
const passwordFormat = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
