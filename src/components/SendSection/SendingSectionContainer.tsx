import { Button, Card, TextField, Typography, FormControl, Divider, IconButton, InputAdornment } from "@mui/material";
import { IApiProvider } from "useink";
import { makeTransaction } from "../../chainRequests/transactionRequest";
import { WalletAccount } from "useink/core";
import { useState } from "react";

type Props = {
  provider: IApiProvider | undefined;
  selectedAccount?: WalletAccount;
};

export const SendingSectionContainer = (props: Props) => {
  const [transactionState, setTransactionState] = useState("");

  const createTransaction = () => {
    if (props.provider && props.selectedAccount) {
      console.log("clicked");
    }
  };
  return (
    <Card sx={{ padding: "15px" }}>
      <FormControl size="small" fullWidth>
        <TextField fullWidth size="small" variant="outlined" sx={{ marginBottom: "10px" }} label="Address" />
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          label="Message"
          sx={{ marginBottom: "10px", overflowWrap: "break-word" }}
          maxRows="5"
        />
        <Button sx={{ width: "fit-content" }} onClick={createTransaction} variant="contained">
          Send
        </Button>
      </FormControl>
    </Card>
  );
};
