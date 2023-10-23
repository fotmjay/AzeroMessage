import {
  Button,
  Card,
  TextField,
  Typography,
  FormControl,
  Divider,
  InputAdornment,
  Box,
  useMediaQuery,
} from "@mui/material";
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
import { axiosInstance } from "../../config/axios";
import { encryptMessageWithPublicKey } from "../../helpers/encryptionHelper";

type Props = {
  provider: IApiProvider | undefined;
  selectedAccount?: WalletAccount;
};

export const SendingSectionContainer = (props: Props) => {
  const [form, setForm] = useState({ address: "", message: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [subscriptionText, setSubscriptionText] = useState("");
  const [validatedAddress, setValidatedAddress] = useState("");
  const [publicEncryptionAddress, setPublicEncryptionAddress] = useState("");
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const domainResolver = useResolveDomainToAddress(form.address);
  const debouncedAddress = useDebounce(form.address, 300);
  const mediaSmall = useMediaQuery("(max-width:400px)");

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
    } else {
      setErrorMessage("");
    }

    if (e.target.name === "address") {
      setValidatedAddress("");
    }

    setForm((oldForm) => {
      const newForm = { ...oldForm, [e.target.name]: text };
      return newForm;
    });
  };

  const submitForm = async (encryptionEnabled: boolean) => {
    if (!props.provider || !props.selectedAccount) {
      setErrorMessage("Wallet not connected.");
      return;
    }
    if (validatedAddress === "") {
      return;
    }
    setErrorMessage("");
    const messageText = encryptionEnabled
      ? await encryptMessageWithPublicKey(publicEncryptionAddress, form.message)
      : form.message;
    makeTransaction(
      props.provider,
      props.selectedAccount,
      validatedAddress,
      messageText,
      encryptionEnabled,
      setSubscriptionText
    );
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
    iconToShow = <Verified fontSize="small" />;
  }

  useEffect(() => {
    if (validatedAddress !== "") {
      axiosInstance
        .get(`/api/publickey/${validatedAddress}`)
        .then((res) => {
          if (res.data.success) {
            console.log(res.data.publicKey);
            setPublicEncryptionAddress(res.data.publicKey);
            setEncryptionEnabled(true);
          } else {
            setPublicEncryptionAddress("");
            setEncryptionEnabled(false);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [validatedAddress]);

  return (
    <Card sx={{ padding: "15px", paddingTop: "0px", maxWidth: "500px", marginX: "auto", marginBottom: "10px" }}>
      <FormInfoBox color={color} messageToShow={messageToShow} icon={iconToShow} />
      <FormControl size="small" fullWidth>
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
        <Box display="flex" gap="15px" flexDirection={mediaSmall ? "column" : "row"}>
          <Button
            type="submit"
            onClick={() => submitForm(false)}
            fullWidth
            sx={{ marginX: "auto" }}
            variant="contained"
          >
            Send
          </Button>
          {validatedAddress && (
            <Button
              onClick={() => submitForm(true)}
              variant="outlined"
              sx={{ minWidth: "50%" }}
              disabled={!encryptionEnabled}
            >
              Encrypt & Send
            </Button>
          )}
        </Box>
        <Typography paddingTop="5px" display="block" marginLeft="auto" color="error">
          {!encryptionEnabled && validatedAddress && "Encryption isn't enabled on receiver address."}
        </Typography>
      </FormControl>
    </Card>
  );
};
