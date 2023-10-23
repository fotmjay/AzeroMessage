import { Box, Switch, Dialog, Container, Typography, Button, useMediaQuery } from "@mui/material";
import { Web3ConnectionSection } from "../web3/Web3ConnectionSection";

// ICONS
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useEffect, useState } from "react";
import { WalletAccount } from "useink/core";
import { ConnectionStatus } from "../web3/ConnectionStatus";
import type { accountBalance } from "../../types/polkaTypes";
import { IApiProvider } from "useink";
import { EncryptionControlPanel } from "../web3/EncryptionControlPanel";
import { axiosInstance } from "../../config/axios";
import { CONSTANT } from "../../constants/constants";
import useSessionStorage from "../../hooks/useSessionStorage";

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
  const [openModal, setOpenModal] = useState<"connectionStatus" | "encryptionStatus" | null>(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const mediaSmall = useMediaQuery("(max-width:400px)");

  useEffect(() => {
    if (props.account !== undefined) {
      const addressInStorage = sessionStorage.getItem(props.account.address);
      if (addressInStorage !== "true") {
        axiosInstance.get(`/api/publickey/${props.account.address}`).then((res) => {
          if (res.data.success === true) {
            setEncryptionEnabled(true);
            sessionStorage.setItem(props.account!.address, "true");
          } else {
            setEncryptionEnabled(false);
          }
        });
      } else {
        setEncryptionEnabled(true);
      }
    }
  }, [props.account]);

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
              setOpenWalletModal={() => setOpenModal("connectionStatus")}
              connectedWallet={props.account}
            />
            {props.account && props.provider && (
              <Button onClick={() => setOpenModal("encryptionStatus")} size="small" variant="outlined">
                {encryptionEnabled ? "Settings" : "Enable encryption"}
              </Button>
            )}
          </Box>
        </Box>
        <Typography textAlign="center" variant="h2" component="h1">
          Azero Message
        </Typography>
      </Box>
      <Dialog
        fullWidth
        open={openModal !== null}
        onClose={() => setOpenModal(null)}
        sx={{
          marginX: "auto",
          display: "block",
          maxWidth: "500px",
          top: mediaSmall ? "0" : "-40%",
        }}
      >
        {openModal === "connectionStatus" && (
          <Web3ConnectionSection
            account={props.account}
            connect={props.connect}
            disconnect={props.disconnect}
            accounts={props.accounts}
            setAccount={props.setAccount}
          />
        )}{" "}
        {openModal === "encryptionStatus" && (
          //@ts-ignore => Panel only opens if button confirming both props not undefined is clicked
          <EncryptionControlPanel provider={props.provider} connectedWallet={props.account} />
        )}
      </Dialog>
    </Container>
  );
};
