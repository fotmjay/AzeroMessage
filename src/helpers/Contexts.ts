import { createContext } from "react";

export const CurrentConnectedWalletContext = createContext<string | undefined>(undefined);
export const MediaSmallContext = createContext(false);
