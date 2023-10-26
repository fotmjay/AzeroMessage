import { SetStateAction, createContext } from "react";
import { IApiProvider } from "useink";
import { WalletAccount } from "useink/core";

type EncAddresses = {
  myPubKey: string;
  encPrivKey: string;
};

type Ownership = {
  ownershipProven: boolean;
  setOwnershipProven: React.Dispatch<SetStateAction<boolean>>;
  encAddresses?: EncAddresses;
};

export const CurrentConnectedWalletContext = createContext<{
  account: WalletAccount | undefined;
  provider: IApiProvider | undefined;
}>({ account: undefined, provider: undefined });
export const MediaSmallContext = createContext(false);
export const ProveOwnershipContext = createContext<Ownership>({ ownershipProven: false, setOwnershipProven: () => {} });
