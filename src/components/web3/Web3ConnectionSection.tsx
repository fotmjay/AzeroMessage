import { ConnectWallet } from "./ConnectWallet";
import { ConnectedWallet } from "./ConnectedWallet";
import { CurrentConnectedWalletContext } from "../../helpers/Contexts";
import { useContext } from "react";

export const Web3ConnectionSection = () => {
  const { account } = useContext(CurrentConnectedWalletContext);
  return account ? <ConnectedWallet /> : <ConnectWallet />;
};
