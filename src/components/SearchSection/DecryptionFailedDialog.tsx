import { Dialog, Box, Card, Typography, Divider, Button } from "@mui/material";
import { SetStateAction, useContext } from "react";
import { MediaSmallContext } from "../../helpers/Contexts";

type Props = {
  setHasError: React.Dispatch<SetStateAction<boolean>>;
  hasError: boolean;
};

export const DecryptionFailedDialog = (props: Props) => {
  const mediaSmall = useContext(MediaSmallContext);
  return (
    <Dialog
      fullWidth
      open={props.hasError}
      onClose={() => props.setHasError(false)}
      sx={{
        marginX: "auto",
        display: "block",
        maxWidth: "500px",
        top: mediaSmall ? "0" : "-40%",
      }}
    >
      <Box>
        <Card sx={{ padding: "15px", border: "1px solid" }}>
          <Typography variant="h4">Decryption Failed</Typography>
          <Divider sx={{ marginY: "10px" }} />
          <Typography gutterBottom variant="body1">
            Please ensure you have the right password and try again.
          </Typography>
          <Button
            onClick={() => props.setHasError(false)}
            sx={{ display: "block", marginLeft: "auto" }}
            variant="outlined"
          >
            Close
          </Button>
        </Card>
      </Box>
    </Dialog>
  );
};
