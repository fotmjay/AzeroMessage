import { createContext } from "react";
import { IApiProvider } from "useink";
import { WalletAccount } from "useink/core";

export const CurrentConnectedWalletContext = createContext<{
  account: WalletAccount | undefined;
  provider: IApiProvider | undefined;
}>({ account: undefined, provider: undefined });
export const MediaSmallContext = createContext(false);
