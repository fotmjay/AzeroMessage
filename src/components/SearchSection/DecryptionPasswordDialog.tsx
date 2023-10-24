import { Dialog, Box, Card, Typography, Divider, Button, TextField, FormControl } from "@mui/material";
import React, { SetStateAction, useContext } from "react";
import { MediaSmallContext } from "../../helpers/Contexts";

type Props = {
  setDecryptionPassword: React.Dispatch<SetStateAction<string>>;
  setOpenPasswordDialog: React.Dispatch<SetStateAction<boolean>>;
  openPasswordDialog: boolean;
  sendToDecrypt: () => void;
  decryptionPassword: string;
};

export const DecryptionPasswordDialog = (props: Props) => {
  const mediaSmall = useContext(MediaSmallContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setDecryptionPassword(e.target.value);
  };

  const handleSubmit = () => {
    props.setOpenPasswordDialog(false);
    props.sendToDecrypt();
  };

  return (
    <Dialog
      fullWidth
      open={props.openPasswordDialog}
      onClose={() => props.setOpenPasswordDialog(false)}
      sx={{
        marginX: "auto",
        display: "block",
        maxWidth: "500px",
        top: mediaSmall ? "0" : "-40%",
      }}
    >
      <Box>
        <Card sx={{ padding: "15px", border: "1px solid" }}>
          <Typography variant="h4">Password Required</Typography>
          <Divider sx={{ marginY: "10px" }} />
          <FormControl onSubmit={handleSubmit}>
            <Typography gutterBottom variant="body1">
              Please enter your password:
            </Typography>
            <TextField
              onChange={handleChange}
              value={props.decryptionPassword}
              label="Password"
              type="password"
              hidden
            ></TextField>
            <Button
              type="submit"
              onClick={handleSubmit}
              sx={{ display: "block", marginLeft: "auto" }}
              variant="outlined"
            >
              Submit
            </Button>
          </FormControl>
        </Card>
      </Box>
    </Dialog>
  );
};
