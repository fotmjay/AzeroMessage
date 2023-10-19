import { Box, Switch, Dialog, Container, Typography } from "@mui/material";
import { Web3ConnectionSection } from "../web3/Web3ConnectionSection";

// ICONS
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useState } from "react";
import { WalletAccount } from "useink/core";
import { ConnectionStatus } from "../web3/ConnectionStatus";
import type { accountBalance } from "../../types/polkaTypes";
import { WalletOwnershipProver } from "../web3/WalletOwnershipProver";
import { IApiProvider } from "useink";

type Props = {
  darkMode: boolean;
  account: WalletAccount | undefined;
  disconnect: () => void;
  accounts: WalletAccount[] | undefined;
  setAccount: (account: WalletAccount) => void;
  connect: (walletName: string) => void;
  switchTheme: () => void;
  selectedAccountBalance?: accountBalance;
  provider?: IApiProvider;
};

export const BaseAppLayout = (props: Props) => {
  const [openWalletModal, setOpenWalletModal] = useState(false);

  return (
    <Container sx={{ paddingX: "0", paddingY: "10px" }}>
      <Box>
        <Box display="flex" justifyContent="space-between" marginY="10px">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DarkModeIcon />
            <Switch onClick={props.switchTheme} size="small" checked={props.darkMode}></Switch>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
            <ConnectionStatus
              selectedAccountBalance={props.selectedAccountBalance}
              setOpenWalletModal={setOpenWalletModal}
              connectedWallet={props.account}
            />
            {props.account && props.provider && (
              <WalletOwnershipProver provider={props.provider} connectedWallet={props.account} />
            )}
          </Box>
        </Box>
        <Typography textAlign="center" variant="h2" component="h1">
          Azero Message
        </Typography>
      </Box>
      <Dialog
        fullWidth
        open={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
        sx={{
          marginX: "auto",
          display: "block",
          maxWidth: "400px",
          top: "-40%",
        }}
      >
        <Web3ConnectionSection
          account={props.account}
          connect={props.connect}
          disconnect={props.disconnect}
          accounts={props.accounts}
          setAccount={props.setAccount}
        />
      </Dialog>
    </Container>
  );
};
