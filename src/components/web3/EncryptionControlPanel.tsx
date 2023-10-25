import { Box, Card, Divider, Typography } from "@mui/material";
import { WalletActions } from "./WalletActions";
import { WalletAccount } from "useink/core";
import { IApiProvider } from "useink";
import { SetStateAction } from "react";

type Props = {
  connectedWallet: WalletAccount;
  provider: IApiProvider;
  setOwnershipProven: React.Dispatch<SetStateAction<boolean>>;
};

export const EncryptionControlPanel = (props: Props) => {
  return (
    <Box>
      <Card sx={{ padding: "15px", border: "1px solid" }}>
        <Typography variant="h4">Encryption Menu</Typography>
        <Divider sx={{ marginY: "10px" }} />
        <Typography gutterBottom variant="body1">
          If encryption is already enabled, prove ownership of your wallet to decrypt messages.
        </Typography>

        <WalletActions
          setOwnershipProven={props.setOwnershipProven}
          provider={props.provider}
          connectedWallet={props.connectedWallet}
          decryptingMessage={false}
          settingPassword={true}
        />
      </Card>
    </Box>
  );
};
