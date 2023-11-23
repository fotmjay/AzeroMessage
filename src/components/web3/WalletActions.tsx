import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { CurrentConnectedWalletContext, MediaSizeContext } from "../../helpers/Contexts";
import { ProveOwnershipContext } from "../../helpers/Contexts";
import { generateKeyPair } from "../../helpers/encryptionHelper";
import { getNonceFromDatabase, signMessage } from "../../helpers/walletInteractions";
import { useContext, useState } from "react";
import { validatePassword } from "../../helpers/validations";

type PasswordForm = {
  password: string;
  confirmPassword: string;
};

export const WalletActions = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);
  const [buttonLoading, setButtonLoading] = useState<number | null>(null);
  const [formData, setFormData] = useState<PasswordForm>({ password: "", confirmPassword: "" });
  const mediaSize = useContext(MediaSizeContext);
  const { provider, account } = useContext(CurrentConnectedWalletContext);
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
    if (!account || !provider) {
      return;
    }
    setButtonLoading(resetPsw ? 2 : 1);
    setHasError(false);
    setButtonDisabled(true);
    setConfirmationMessage("");
    try {
      const res = await getNonceFromDatabase(account.address, setHasError, setConfirmationMessage);
      if (res === undefined) {
        return;
      }
      if (res.publicKey === undefined && resetPsw === false) {
        setHasError(true);
        setConfirmationMessage('You do not have encryption enabled.  Use "Set password" instead of "Prove Ownership."');
        setButtonDisabled(false);
        setButtonLoading(null);
        return;
      }
      let generatedKeys;
      if (resetPsw) {
        generatedKeys = await generateKeyPair(formData.password);
      }
      await signMessage(
        account,
        res.randomNonce,
        provider,
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
    setButtonLoading(null);
  };

  const buttonText = toggleForm ? "Sign & Send" : "Set Password";
  return (
    <Box paddingTop="15px" display="flex" flexDirection="column" alignContent="center" gap="15px">
      <Button onClick={() => submitClick(false)} size="small" variant="outlined" disabled={buttonDisabled}>
        {buttonLoading === 1 ? <CircularProgress sx={{ fontSize: "0.8rem" }} /> : "Prove ownership"}
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
        {buttonLoading === 2 ? <CircularProgress sx={{ fontSize: "0.8rem" }} /> : buttonText}
      </Button>
      {toggleForm && (
        <Box
          display="flex"
          flexDirection={mediaSize.small ? "column" : "row"}
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
            fullWidth={mediaSize.small}
          ></TextField>
          <TextField
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            size="small"
            placeholder="Confirm Password"
            fullWidth={mediaSize.small}
          ></TextField>
        </Box>
      )}

      <Typography textAlign="center" color={hasError ? "error.main" : "#00eac7"}>
        {confirmationMessage}
      </Typography>
    </Box>
  );
};
