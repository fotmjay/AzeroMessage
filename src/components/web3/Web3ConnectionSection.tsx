import { WalletAccount } from "useink/core";
import { ConnectWallet } from "./ConnectWallet";
import { ConnectedWallet } from "./ConnectedWallet";

type Props = {
  account: WalletAccount | undefined;
  connect: (walletName: string) => void;
  disconnect: () => void;
  accounts: WalletAccount[] | undefined;
  setAccount: (account: WalletAccount) => void;
};

export const Web3ConnectionSection = (props: Props) => {
  return props.account ? (
    <ConnectedWallet
      account={props.account}
      disconnect={props.disconnect}
      accounts={props.accounts}
      setAccount={props.setAccount}
    />
  ) : (
    <ConnectWallet connect={props.connect} />
  );
};
