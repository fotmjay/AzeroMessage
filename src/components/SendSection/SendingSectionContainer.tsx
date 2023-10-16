import { Button, Card, TextField, Typography, FormControl, Divider, IconButton, InputAdornment } from "@mui/material";
import { IApiProvider } from "useink";
import { makeTransaction } from "../../chainRequests/transactionRequest";
import { WalletAccount } from "useink/core";
import React, { useState } from "react";

type Props = {
  provider: IApiProvider | undefined;
  selectedAccount?: WalletAccount;
};

export const SendingSectionContainer = (props: Props) => {
  const [transactionState, setTransactionState] = useState("");
  const [form, setForm] = useState({ address: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((oldForm) => {
      const newForm = { ...oldForm, [e.target.name]: e.target.value };
      return newForm;
    });
  };

  const submitForm = () => {
    console.log("submitted");
  };

  const createTransaction = () => {
    if (props.provider && props.selectedAccount) {
      console.log("clicked");
    }
  };
  return (
    <Card sx={{ padding: "15px" }}>
      <FormControl onSubmit={submitForm} size="small" fullWidth>
        <TextField
          fullWidth
          name="address"
          size="small"
          onChange={handleChange}
          value={form.address}
          placeholder="Enter address"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ paddingX: "0", marginX: "5" }}>
                <Typography textAlign="left" sx={{ cursor: "default", width: "50px" }}>
                  Address
                </Typography>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              </InputAdornment>
            ),
            sx: { paddingLeft: "10px", paddingRight: "12px" },
          }}
        />
        <TextField
          fullWidth
          name="message"
          size="small"
          onChange={handleChange}
          variant="outlined"
          sx={{ marginBottom: "10px", marginTop: "10px" }}
          maxRows="5"
          placeholder="Enter message"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ paddingX: "0", marginX: "5" }}>
                <Typography textAlign="left" sx={{ cursor: "default", width: "50px" }}>
                  Message
                </Typography>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              </InputAdornment>
            ),
            sx: { paddingLeft: "10px", paddingRight: "12px" },
            maxRows: "5",
            multiline: true,
          }}
        />
        <Button type="submit" sx={{ width: "fit-content" }} onClick={createTransaction} variant="contained">
          Send
        </Button>
      </FormControl>
    </Card>
  );
};
