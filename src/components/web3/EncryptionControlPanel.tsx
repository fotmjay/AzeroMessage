import { Box, Card, Divider, Typography } from "@mui/material";
import { WalletActions } from "./WalletActions";
import { WalletAccount } from "useink/core";
import { IApiProvider } from "useink";

type Props = {
  connectedWallet: WalletAccount;
  provider: IApiProvider;
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
          provider={props.provider}
          connectedWallet={props.connectedWallet}
          decryptingMessage={false}
          settingPassword={true}
        />
      </Card>
    </Box>
  );
};
