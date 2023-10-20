import { Box, Button, CircularProgress, TextField, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { WalletAccount } from "useink/core";
import { axiosInstance } from "../../config/axios";
import { IApiProvider } from "useink";
import { CONSTANT } from "../../constants/constants";
import { validatePassword } from "../../helpers/validations";

type Props = {
  connectedWallet: WalletAccount;
  provider: IApiProvider;
  decryptingMessage: boolean;
  changingPassword: boolean;
};

type ConfirmWalletApiReturn = {
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
};

type PasswordForm = {
  password: string;
  confirmPassword: string;
};

export const WalletOwnershipProver = (props: Props) => {
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
    const errorMessage = validatePassword(formData.password, formData.confirmPassword);
    if (errorMessage !== "") {
      setHasError(true);
      setConfirmationMessage(errorMessage);
      return;
    }
    setHasError(false);
    setButtonDisabled(true);
    setConfirmationMessage("");
    try {
      const randomNonce = await fetchNonce();
      if (randomNonce === undefined) {
        setConfirmationMessage("Failed fetching message to sign.");
        return;
      }
      await signMessage(randomNonce);
    } catch (err) {
      setHasError(true);
      console.error(err);
    }
    setButtonDisabled(false);
  };

  const signMessage = async (randomNonce: string) => {
    setButtonDisabled(true);
    const signedMessage = await props.provider.api.sign(
      props.connectedWallet.address,
      { data: randomNonce },
      { signer: props.connectedWallet.signer }
    );
    axiosInstance
      .post("/auth/confirmWallet", { signature: signedMessage, walletAddress: props.connectedWallet.address })
      .then((res: { data: ConfirmWalletApiReturn }) => {
        if (res.data.success && res.data.token) {
          localStorage.setItem(CONSTANT.LOCALSTORAGE.KEYS.TOKEN, res.data.token);
          setConfirmationMessage("Successfully signed.");
          console.log(res.data.token);
        }
      })
      .catch((err) => {
        console.error(err);
        setHasError(true);
        setConfirmationMessage(`${err.code}: ${err.response.data}`);
      });
    setButtonDisabled(false);
  };

  const fetchNonce = () => {
    return axiosInstance
      .get(`/auth/generateNonce/${props.connectedWallet.address}`)
      .then((res) => {
        return res.data.randomNonce;
      })
      .catch((err) => {
        console.error(err);
        setHasError(true);
        setConfirmationMessage("Could not query the message to sign for your address.");
        setButtonDisabled(false);
      });
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
    </Box>
  );
};
