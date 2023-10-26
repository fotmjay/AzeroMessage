import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { WalletAccount } from "useink/core";
import { IApiProvider } from "useink";
import { validatePassword } from "../../helpers/validations";
import { generateKeyPair } from "../../helpers/encryptionHelper";
import { getNonceFromDatabase, signMessage } from "../../helpers/walletInteractions";
import { MediaSmallContext } from "../../helpers/Contexts";
import { ProveOwnershipContext } from "../../App";

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
  const mediaSmall = useContext(MediaSmallContext);
  const { setOwnershipProven } = useContext(ProveOwnershipContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((oldData) => ({ ...oldData, [e.target.name]: e.target.value }));
  };

  const handleClick = () => {
    setToggleForm(true);
  };

  const submitClick = async (resetPsw: boolean) => {
    if (resetPsw === true) {
      const errorMessage: string = validatePassword(formData.password, formData.confirmPassword);
      if (errorMessage !== "") {
        setHasError(true);
        setConfirmationMessage(errorMessage);
        return;
      }
    }
    setHasError(false);
    setButtonDisabled(true);
    setConfirmationMessage("");
    try {
      const res = await getNonceFromDatabase(props.connectedWallet.address, setHasError, setConfirmationMessage);
      if (res === undefined) {
        return;
      }
      if (res.publicKey === undefined && resetPsw === false) {
        setHasError(true);
        setConfirmationMessage('You do not have encryption enabled.  Use "Set password" instead of "Prove Ownership."');
        setButtonDisabled(false);
        return;
      }
      let generatedKeys;
      if (resetPsw) {
        generatedKeys = await generateKeyPair(formData.password);
      }
      await signMessage(
        props.connectedWallet,
        res.randomNonce,
        props.provider,
        setHasError,
        setConfirmationMessage,
        setOwnershipProven,
        generatedKeys?.encryptedPrivateKey,
        generatedKeys?.publicKey
      );
    } catch (err) {
      setHasError(true);
      setConfirmationMessage("An error occured.");
      console.error(err);
    }
    setButtonDisabled(false);
  };

  const buttonText = toggleForm ? "Sign & Send" : "Set Password";
  return (
    <Box paddingTop="15px" display="flex" flexDirection="column" alignContent="center" gap="15px">
      <Button onClick={() => submitClick(false)} size="small" variant="outlined" disabled={buttonDisabled}>
        {buttonDisabled ? <CircularProgress sx={{ fontSize: "0.8rem" }} /> : "Prove ownership"}
      </Button>
      <Typography gutterBottom variant="body1">
        To enable reception of encrypted messages, choose a password and sign a message.
      </Typography>
      <Typography variant="subtitle1" fontWeight="medium">
        If you change your password, previous messages won't be decryptable anymore.
      </Typography>
      <Button
        onClick={toggleForm ? () => submitClick(true) : handleClick}
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
          component="form"
        >
          <TextField name="username" sx={{ display: "none" }} autoComplete="username"></TextField>
          <TextField
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            size="small"
            placeholder="Password"
            fullWidth={mediaSmall}
          ></TextField>
          <TextField
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            size="small"
            placeholder="Confirm Password"
            fullWidth={mediaSmall}
          ></TextField>
        </Box>
      )}

      <Typography textAlign="center" color={hasError ? "error.main" : "#00eac7"}>
        {confirmationMessage}
      </Typography>
    </Box>
  );
};
