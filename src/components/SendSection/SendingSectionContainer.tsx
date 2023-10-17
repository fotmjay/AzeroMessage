import { Button, Card, TextField, Typography, FormControl, Divider, InputAdornment } from "@mui/material";
import { IApiProvider } from "useink";
import { WalletAccount } from "useink/core";
import React, { useEffect, useState } from "react";
import { addressFormatValidation } from "../../helpers/validations";
import { makeTransaction } from "../../chainRequests/transactionRequest";
import { useResolveDomainToAddress } from "@azns/resolver-react";
import { useDebounce } from "@uidotdev/usehooks";
import { FormInfoBox } from "../FormInfoBox";
import { Verified } from "@mui/icons-material";
import { CONSTANT } from "../../constants/constants";

type Props = {
  provider: IApiProvider | undefined;
  selectedAccount?: WalletAccount;
};

export const SendingSectionContainer = (props: Props) => {
  const [form, setForm] = useState({ address: "", message: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [subscriptionText, setSubscriptionText] = useState("");
  const [validatedAddress, setValidatedAddress] = useState("");
  const domainResolver = useResolveDomainToAddress(form.address, {
    debug: true,
  });
  const debouncedAddress = useDebounce(form.address, 300);

  useEffect(() => {
    if (domainResolver.address !== null && domainResolver.address !== undefined) {
      setValidatedAddress(domainResolver.address);
      setErrorMessage("");
    } else if (domainResolver.address === null) {
      setErrorMessage("There is no address resolved from this domain.");
    } else if (debouncedAddress !== "") {
      const valid = addressFormatValidation(debouncedAddress, setErrorMessage);
      setValidatedAddress(() => {
        if (valid) {
          return debouncedAddress;
        } else {
          return "";
        }
      });
    } else {
      setErrorMessage("");
    }
  }, [domainResolver.address, debouncedAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;
    if (e.target.name === "message" && e.target.value.length > CONSTANT.MAXMESSAGELENGTH) {
      setErrorMessage(`Message needs to be less than ${CONSTANT.MAXMESSAGELENGTH} characters.`);
      text = e.target.value.slice(0, CONSTANT.MAXMESSAGELENGTH);
    }

    setForm((oldForm) => {
      const newForm = { ...oldForm, [e.target.name]: text };
      return newForm;
    });
  };

  const submitForm = () => {
    if (!props.provider || !props.selectedAccount) {
      setErrorMessage("Wallet not connected.");
      return;
    }
    if (validatedAddress === "") {
      return;
    }
    setErrorMessage("");
    makeTransaction(props.provider, props.selectedAccount, validatedAddress, form.message, setSubscriptionText);
  };
  let messageToShow = "";
  let iconToShow = undefined;
  let color = "green";
  if (errorMessage.length > 0) {
    messageToShow = errorMessage;
    color = "red";
  } else if (subscriptionText.length > 0) {
    messageToShow = subscriptionText;
  } else if (validatedAddress !== "") {
    messageToShow = "Address is valid.";
    iconToShow = <Verified />;
  }

  return (
    <Card sx={{ padding: "15px", paddingTop: "0px", maxWidth: "500px", marginX: "auto", marginBottom: "10px" }}>
      <FormInfoBox color={color} messageToShow={messageToShow} icon={iconToShow} />
      <FormControl onSubmit={submitForm} size="small" fullWidth>
        <TextField
          sx={{ paddingBottom: "10px" }}
          fullWidth
          name="address"
          size="small"
          onChange={handleChange}
          value={form.address}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ paddingX: "0", marginX: "5" }}>
                <Typography textAlign="left" sx={{ cursor: "default", width: "60px" }}>
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
