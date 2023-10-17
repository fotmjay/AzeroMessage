import { Button, Card, TextField, Typography, FormControl, Divider, InputAdornment } from "@mui/material";
import { IApiProvider } from "useink";
import { WalletAccount } from "useink/core";
import React, { useState } from "react";
import { addressFormatValidation, validateTextSent } from "../../helpers/validations";
import { makeTransaction } from "../../chainRequests/transactionRequest";

type Props = {
  provider: IApiProvider | undefined;
  selectedAccount?: WalletAccount;
};

export const SendingSectionContainer = (props: Props) => {
  const [form, setForm] = useState({ address: "", message: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [subscriptionText, setSubscriptionText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;
    if (e.target.name === "message" && e.target.value.length > 500) {
      text = e.target.value.slice(0, 500);
      setErrorMessage("Message has to be less than 500 characters.");
    } else {
      setErrorMessage("");
    }

    setForm((oldForm) => {
      const newForm = { ...oldForm, [e.target.name]: text };
      return newForm;
    });
  };

  const validateAddress = () => {
    if (!addressFormatValidation(form.address)) {
      setErrorMessage("Provided address is not valid.");
      return false;
    }
    return true;
  };

  const submitForm = () => {
    if (!props.provider || !props.selectedAccount) {
      setErrorMessage("Wallet not connected.");
      return;
    }
    if (!validateAddress()) {
      return;
    }
    if (!validateTextSent(form.message, setErrorMessage)) {
      return;
    }
    setErrorMessage("");
    makeTransaction(props.provider, props.selectedAccount, form.address, form.message, setSubscriptionText);
  };
  return (
    <Card sx={{ padding: "15px", paddingTop: "0px", maxWidth: "400px", marginX: "auto", marginBottom: "10px" }}>
      <Typography color="red">{errorMessage.length > 0 ? errorMessage : ""}</Typography>
      <Typography color="green">{subscriptionText.length > 0 ? subscriptionText : ""}</Typography>
      <FormControl onSubmit={submitForm} size="small" fullWidth>
        <TextField
          sx={{ paddingY: "10px" }}
          fullWidth
          name="address"
          size="small"
          onChange={handleChange}
          value={form.address}
          onBlur={validateAddress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ paddingX: "0", marginX: "5" }}>
                <Typography textAlign="left" sx={{ cursor: "default", width: "50px" }}>
                  Address
                </Typography>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              </InputAdornment>
            ),
            sx: {
              paddingLeft: "10px",
              paddingRight: "12px",
            },
          }}
        />
        <TextField
          fullWidth
          name="message"
          size="small"
          onChange={handleChange}
          variant="outlined"
          sx={{ marginBottom: "10px", borderTop: "none" }}
          maxRows="5"
          placeholder="Enter message"
          value={form.message}
        />
        <Button type="submit" onClick={submitForm} fullWidth sx={{ marginX: "auto" }} variant="contained">
          Send
        </Button>
      </FormControl>
    </Card>
  );
};
