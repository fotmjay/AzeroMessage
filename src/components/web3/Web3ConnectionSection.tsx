import { WalletAccount } from "useink/core";
import { ConnectWallet } from "./ConnectWallet";
import { ConnectedWallet } from "./ConnectedWallet";
import { CurrentConnectedWalletContext } from "../../helpers/Contexts";
import { useContext } from "react";

type Props = {
  connect: (walletName: string) => void;
  disconnect: () => void;
  accounts: WalletAccount[] | undefined;
  setAccount: (account: WalletAccount) => void;
};

export const Web3ConnectionSection = (props: Props) => {
  const { account } = useContext(CurrentConnectedWalletContext);
  return account ? (
    <ConnectedWallet disconnect={props.disconnect} accounts={props.accounts} setAccount={props.setAccount} />
  ) : (
    <ConnectWallet connect={props.connect} />
  );
};
