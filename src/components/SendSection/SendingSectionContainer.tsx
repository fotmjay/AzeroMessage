import {
  Button,
  Card,
  TextField,
  Typography,
  FormControl,
  Divider,
  InputAdornment,
  Box,
  Checkbox,
  Dialog,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { addressFormatValidation } from "../../helpers/validations";
import { makeTransaction } from "../../chainRequests/transactionRequest";
import { useResolveDomainToAddress } from "@azns/resolver-react";
import { useDebounce } from "@uidotdev/usehooks";
import { FormInfoBox } from "../FormInfoBox";
import { Verified } from "@mui/icons-material";
import { CONSTANT } from "../../constants/constants";
import { axiosInstance } from "../../config/axios";
import { encryptMessageWithPublicKey } from "../../helpers/encryptionHelper";
import { CurrentConnectedWalletContext, MediaSmallContext } from "../../helpers/Contexts";
import { MultisendFAQ } from "./MultisendFAQ";

type Props = {
  chosenTab: number;
  index: number;
};

export const SendingSectionContainer = (props: Props) => {
  const [form, setForm] = useState({ address: "", message: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [subscriptionText, setSubscriptionText] = useState("");
  const [validatedAddress, setValidatedAddress] = useState("");
  const [publicEncryptionAddress, setPublicEncryptionAddress] = useState("");
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [toggleMultisend, setToggleMultisend] = useState(false);
  const [multisendWarningToggle, setMultisendWarningToggle] = useState(false);
  const domainResolver = useResolveDomainToAddress(form.address);
  const debouncedAddress = useDebounce(form.address, 300);
  const mediaSmall = useContext(MediaSmallContext);
  const { account, provider } = useContext(CurrentConnectedWalletContext);

  useEffect(() => {
    setSubscriptionText("");
    if (!toggleMultisend) {
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
    } else if (debouncedAddress !== "") {
      let addressListString = debouncedAddress.replace(/[\n\r\s\t]+/g, "");
      if (addressListString[addressListString.length - 1] === ",") {
        addressListString = addressListString.slice(0, addressListString.length - 1);
      }
      const addressList = addressListString.split(",");
      if (addressList.length > 500) {
        setErrorMessage("Maximum 500 addresses at once for bulk messaging.");
      } else {
        const wrongAddresses = addressList.filter((address) => !addressFormatValidation(address));
        if (wrongAddresses.length > 0) {
          setErrorMessage(`These ${wrongAddresses.length} addresses are not valid:  ${wrongAddresses.join(",\n")}`);
        } else {
          setValidatedAddress(addressList.join(","));
        }
      }
    }
  }, [domainResolver.address, debouncedAddress, toggleMultisend]);

  const handleMultisendToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToggleMultisend((toggle) => !toggle);
    if (e.target.checked === true) {
      setMultisendWarningToggle(true);
      setForm((oldForm) => ({ ...oldForm, message: oldForm.message.slice(0, 200) }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;
    if (e.target.name === "message" && e.target.value.length > CONSTANT.MAXMESSAGELENGTH) {
      setErrorMessage(`Message needs to be less than ${CONSTANT.MAXMESSAGELENGTH} characters.`);
      text = e.target.value.slice(0, CONSTANT.MAXMESSAGELENGTH);
    } else {
      setErrorMessage("");
    }

    if (e.target.name === "message" && e.target.value.length > 200 && toggleMultisend) {
      setErrorMessage(`Message needs to be less than 200 characters when bulk messaging.`);
      text = e.target.value.slice(0, 200);
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
    if (!provider || !account) {
      setErrorMessage("Wallet not connected.");
      return;
    }
    if (validatedAddress === "") {
      return;
    }
    setErrorMessage("");
    const messageText =
      encryptionEnabled && publicEncryptionAddress !== ""
        ? await encryptMessageWithPublicKey(publicEncryptionAddress, form.message)
        : form.message;
    makeTransaction(
      provider,
      account,
      validatedAddress,
      messageText,
      encryptionEnabled,
      toggleMultisend,
      setSubscriptionText
    );
  };

  let messageToShow = "";
  let iconToShow = undefined;
  let color = "#00eac7";
  if (errorMessage.length > 0) {
    messageToShow = errorMessage;
    color = "error.main";
  } else if (subscriptionText.length > 0) {
    messageToShow = subscriptionText;
  } else if (validatedAddress !== "") {
    messageToShow = "Address is valid.";
    iconToShow = <Verified fontSize="small" />;
  }

  useEffect(() => {
    // Make sure the address is validated, multisend is off and there isn't more than one address in the field
    // if user just switched off multisend before poking the server.
    if (validatedAddress !== "" && validatedAddress.length < 55 && !toggleMultisend) {
      axiosInstance
        .get(`/api/publickey/${validatedAddress}`)
        .then((res) => {
          if (res.data.success) {
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
  }, [validatedAddress, toggleMultisend]);

  return (
    <Card
      hidden={props.chosenTab !== props.index}
      sx={{ padding: "15px", paddingTop: "0px", maxWidth: "500px", marginX: "auto", marginBottom: "10px" }}
    >
      <FormInfoBox color={color} messageToShow={messageToShow} icon={iconToShow} />
      <FormControl size="small" fullWidth>
        <TextField
          sx={{ paddingBottom: "10px" }}
          fullWidth
          autoComplete="off"
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
            endAdornment: (
              <InputAdornment position="end" sx={{ margin: "0" }}>
                <Checkbox sx={{ padding: "1px" }} checked={toggleMultisend} onChange={handleMultisendToggle} />
                <Typography sx={{ padding: "0", margin: "0" }} variant="caption">
                  {mediaSmall ? "Bulk" : "Multisend?"}
                </Typography>
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
            disabled={validatedAddress === ""}
            fullWidth
            sx={{ marginX: "auto" }}
            variant="contained"
          >
            Send
          </Button>
          {validatedAddress && !toggleMultisend && (
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
          {!encryptionEnabled &&
            validatedAddress &&
            !toggleMultisend &&
            "Encryption isn't enabled on receiver address."}
        </Typography>
      </FormControl>
      <Dialog
        fullWidth
        open={multisendWarningToggle}
        sx={{
          marginX: "auto",
          display: "block",
          maxWidth: "500px",
          top: mediaSmall ? "0" : "-40%",
        }}
      >
        <MultisendFAQ setMultisendWarningToggle={setMultisendWarningToggle} setToggleMultisend={setToggleMultisend} />
      </Dialog>
    </Card>
  );
};
