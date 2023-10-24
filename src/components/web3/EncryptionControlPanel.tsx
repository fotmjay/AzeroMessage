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
          To decrypt messages, prove ownership of your wallet.
        </Typography>
        <Typography gutterBottom variant="body1">
          To enable reception of encrypted messages, set a password (requires a signature).
        </Typography>
        <Typography variant="subtitle1" fontWeight="medium">
          If you change your password, previous messages won't be decryptable anymore.
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
