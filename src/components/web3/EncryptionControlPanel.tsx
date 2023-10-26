import { Box, Card, Divider, Typography } from "@mui/material";
import { WalletActions } from "./WalletActions";

export const EncryptionControlPanel = () => {
  return (
    <Box>
      <Card sx={{ padding: "15px", border: "1px solid" }}>
        <Typography variant="h4">Encryption Menu</Typography>
        <Divider sx={{ marginY: "10px" }} />
        <Typography gutterBottom variant="body1">
          If encryption is already enabled, prove ownership of your wallet to decrypt messages.
        </Typography>

        <WalletActions />
      </Card>
    </Box>
  );
};
