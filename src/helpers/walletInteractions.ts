import { SetStateAction } from "react";
import { axiosInstance } from "../config/axios";
import { WalletAccount } from "useink/core";
import { IApiProvider } from "useink";

type NonceResponse = {
  randomNonce: string;
  publicKey: string | undefined;
};

export const getNonceFromDatabase = (
  walletAddress: string,
  setHasError: React.Dispatch<SetStateAction<boolean>>,
  setConfirmationMessage: React.Dispatch<SetStateAction<string>>
): Promise<NonceResponse | void> => {
  return axiosInstance
    .get(`/auth/getNonce/${walletAddress}`)
    .then((res) => ({ randomNonce: res.data.randomNonce, publicKey: res.data.publicKey }))
    .catch((err) => {
      console.error(err);
      setHasError(true);
      setConfirmationMessage("Could not query the message to sign for your address.");
    });
};

type ConfirmWalletApiReturn = {
  success: boolean;
  message: string;
  hasKey?: boolean;
  encryptedPrivateKey?: string | undefined;
  publicKey?: string | undefined;
};

export const signMessage = async (
  connectedWallet: WalletAccount,
  randomNonce: string,
  provider: IApiProvider,
  setHasError: React.Dispatch<SetStateAction<boolean>>,
  setConfirmationMessage: React.Dispatch<SetStateAction<string>>,
  setOwnershipProven: React.Dispatch<SetStateAction<boolean>>,
  encryptedPrivateKey?: string,
  publicKey?: string
) => {
  const signedMessage = await provider.api.sign(
    connectedWallet.address,
    { data: randomNonce },
    { signer: connectedWallet.signer }
  );

  const keysIfAvail = { encryptedPrivateKey, publicKey };
  axiosInstance
    .post(`/auth/${encryptedPrivateKey ? "setPassword" : "confirmWallet"}`, {
      signature: signedMessage,
      walletAddress: connectedWallet.address,
      ...keysIfAvail,
    })
    .then((res: { data: ConfirmWalletApiReturn }) => {
      setHasError(true);
      if (!res.data.success) {
        setConfirmationMessage(res.data.message);
        return;
      } else if (!res.data.hasKey) {
        setConfirmationMessage("Proving ownership is not necessary when encryption is not enabled.");
        return;
      } else {
        sessionStorage.setItem(`encryptedPrivateKey:${connectedWallet.address}`, res.data.encryptedPrivateKey || "");
        sessionStorage.setItem(`myPublicKey:${connectedWallet.address}`, res.data.publicKey || "");
        sessionStorage.setItem(connectedWallet.address, "true");
        setConfirmationMessage("Successfully fetched your encrypted private key.");
        setHasError(false);
        setOwnershipProven((old) => !old);
      }
    })
    .catch((err) => {
      console.error(err);
      setHasError(true);
      setConfirmationMessage(`${err.code}: ${err.response.data}`);
      setOwnershipProven(false);
    });
};
