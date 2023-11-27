import { SetStateAction, createContext } from "react";
import { IApiProvider, WalletState } from "useink";
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
export const MediaSizeContext = createContext({ small: false, medium: false });
export const ProveOwnershipContext = createContext<Ownership>({ ownershipProven: false, setOwnershipProven: () => {} });
export const UseWalletContext = createContext<Partial<WalletState>>({});
