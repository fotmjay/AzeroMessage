import { Box, Switch, Dialog, Container, Typography, Button, SvgIcon, Link } from "@mui/material";
import { Web3ConnectionSection } from "../web3/Web3ConnectionSection";

// ICONS
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AlephA from "../../assets/Alephabet/A.svg?react";
import AlephM from "../../assets/Alephabet/M.svg?react";

import React, { SetStateAction, useContext, useEffect, useState } from "react";
import { ConnectionStatus } from "../web3/ConnectionStatus";
import type { accountBalance } from "../../types/polkaTypes";
import { EncryptionControlPanel } from "../web3/EncryptionControlPanel";
import { axiosInstance } from "../../config/axios";
import { CurrentConnectedWalletContext, MediaSizeContext, ProveOwnershipContext } from "../../helpers/Contexts";

type Props = {
  darkMode: boolean;
  switchTheme: () => void;
  selectedAccountBalance?: accountBalance;
  setShowFaq: React.Dispatch<SetStateAction<boolean>>;
};

export const BaseAppLayout = (props: Props) => {
  const [openModal, setOpenModal] = useState<"connectionStatus" | "encryptionStatus" | null>(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const { ownershipProven } = useContext(ProveOwnershipContext);
  const mediaSize = useContext(MediaSizeContext);
  const { provider, account } = useContext(CurrentConnectedWalletContext);

  useEffect(() => {
    if (account !== undefined) {
      const addressInStorage = sessionStorage.getItem(account.address);
      if (addressInStorage !== "true") {
        axiosInstance.get(`/api/publickey/${account.address}`).then((res) => {
          if (res.data.success === true) {
            setEncryptionEnabled(true);
            sessionStorage.setItem(account.address, "true");
          } else {
            setEncryptionEnabled(false);
          }
        });
      } else {
        setEncryptionEnabled(true);
      }
    }
  }, [account, ownershipProven]);

  return (
    <Container sx={{ paddingX: "0", paddingY: "10px" }}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginY="10px">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DarkModeIcon />
            <Switch name="darkModeSwitch" onClick={props.switchTheme} size="small" checked={props.darkMode}></Switch>
          </Box>

          <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
            <ConnectionStatus
              selectedAccountBalance={props.selectedAccountBalance}
              setOpenWalletModal={() => setOpenModal("connectionStatus")}
              connectedWallet={account}
            />
            {account && provider && (
              <Button onClick={() => setOpenModal("encryptionStatus")} size="small" variant="outlined">
                {encryptionEnabled ? "Settings" : "Enable encryption"}
              </Button>
            )}
            <Button onClick={() => props.setShowFaq(true)}>FAQ</Button>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          columnGap="10px"
          minWidth="250px"
          flexDirection={mediaSize.small ? "column" : "row"}
          margin="auto"
        >
          <Typography textAlign="center" variant="h2" component="h1" sx={{ textDecoration: "underline" }}>
            <Link color="text.primary" href=".">
              <SvgIcon
                viewBox="0 0 105 100"
                sx={{ fontSize: "1.1em", marginRight: "3px", display: "inline-block", verticalAlign: "middle" }}
                component={AlephA}
                inheritViewBox
              />
              zero
            </Link>
          </Typography>
          <Typography textAlign="center" variant="h2" component="h1" sx={{ textDecoration: "underline" }}>
            <Link color="text.primary" href=".">
              <SvgIcon
                viewBox="0 0 92.42 100"
                sx={{ fontSize: "1.1em", marginRight: "3px", display: "inline-block", verticalAlign: "middle" }}
                component={AlephM}
                inheritViewBox
              />
              essage
            </Link>
          </Typography>
        </Box>
      </Box>
      <Dialog
        fullWidth
        open={openModal !== null}
        onClose={() => setOpenModal(null)}
        sx={{
          marginX: "auto",
          display: "block",
          maxWidth: "500px",
          top: mediaSize.small ? "0" : "-40%",
        }}
      >
        {openModal === "connectionStatus" && <Web3ConnectionSection />}
        {openModal === "encryptionStatus" && provider && account && <EncryptionControlPanel />}
      </Dialog>
    </Container>
  );
};
