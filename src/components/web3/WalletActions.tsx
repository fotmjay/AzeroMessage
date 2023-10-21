import { Box, Button, CircularProgress, TextField, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { WalletAccount } from "useink/core";
import { IApiProvider } from "useink";
import { CONSTANT } from "../../constants/constants";
import { validatePassword } from "../../helpers/validations";
import {
  decryptMessageWithEncryptedPrivateKey,
  encryptMessageWithPublicKey,
  generateKeyPair,
} from "../../helpers/encryptionHelper";
import { getNonceFromDatabase, signMessage } from "../../helpers/walletInteractions";

type Props = {
  connectedWallet: WalletAccount;
  provider: IApiProvider;
  decryptingMessage: boolean;
  settingPassword: boolean;
};

type PasswordForm = {
  password: string;
  confirmPassword: string;
};

export const WalletActions = (props: Props) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);
  const [formData, setFormData] = useState<PasswordForm>({ password: "", confirmPassword: "" });
  const mediaSmall = useMediaQuery("(max-width:400px)");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((oldData) => ({ ...oldData, [e.target.name]: e.target.value }));
  };

  const handleClick = () => {
    setToggleForm(true);
  };

  const submitClick = async () => {
    const errorMessage: string = validatePassword(formData.password, formData.confirmPassword);
    if (errorMessage !== "") {
      setHasError(true);
      setConfirmationMessage(errorMessage);
      return;
    }
    setHasError(false);
    setButtonDisabled(true);
    setConfirmationMessage("");
    try {
      const randomNonce = await getNonceFromDatabase(
        props.connectedWallet.address,
        setHasError,
        setConfirmationMessage
      );
      if (randomNonce === undefined) {
        return;
      }
      const generatedKeys = await generateKeyPair(formData.password);
      await signMessage(
        props.connectedWallet,
        randomNonce,
        props.provider,
        setHasError,
        setConfirmationMessage,
        generatedKeys.encryptedPrivateKey,
        generatedKeys.publicKey
      );
    } catch (err) {
      setHasError(true);
      console.error(err);
    }
    setButtonDisabled(false);
  };

  const testEncrypt = async () => {
    const pubKey = sessionStorage.getItem("publicKey");
    const encryptedMessage = await encryptMessageWithPublicKey(pubKey!, "works");
    console.log(encryptedMessage);
  };

  const testDecrypt = async () => {
    const encPrivKey = sessionStorage.getItem("encryptedPrivateKey");
    const pubKey = sessionStorage.getItem("publicKey");
    const psw = prompt();
    if (!encPrivKey || !pubKey) {
      setHasError(true);
      setConfirmationMessage("Please sign ownership of your wallet before decrypting.");
      return;
    }
    const decrypted = await decryptMessageWithEncryptedPrivateKey(
      "7930176a580154a34e54fdce50ea3869f2e86e105954fd6251ae4b130c5bb50931dd4cb0190c0f7819f3ec3ea40d8adaac7517cd09",
      encPrivKey,
      pubKey,
      psw!
    );
    console.log(decrypted);
  };

  const buttonText = toggleForm ? "Sign & Send" : "Set Password";
  return (
    <Box paddingTop="15px" display="flex" flexDirection="column" alignContent="center" gap="15px">
      <Button
        onClick={toggleForm ? submitClick : handleClick}
        size="small"
        variant={toggleForm ? "contained" : "outlined"}
        disabled={buttonDisabled}
      >
        {buttonDisabled ? <CircularProgress sx={{ fontSize: "0.8rem" }} /> : buttonText}
      </Button>
      {toggleForm && (
        <Box
          display="flex"
          flexDirection={mediaSmall ? "column" : "row"}
          justifyContent="space-between"
          alignContent="center"
          gap="5px"
        >
          <TextField
            name="password"
            value={formData.password}
            onChange={handleChange}
            size="small"
            placeholder="Password"
            fullWidth={mediaSmall}
          ></TextField>
          <TextField
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            size="small"
            placeholder="Confirm Password"
            fullWidth={mediaSmall}
          ></TextField>
        </Box>
      )}
      <Typography textAlign="center" color={hasError ? "red" : "lightgreen"}>
        {confirmationMessage}
      </Typography>
      <Button onClick={testEncrypt}>encrypt</Button>
      <Button onClick={testDecrypt}>decrypt</Button>
    </Box>
  );
};
