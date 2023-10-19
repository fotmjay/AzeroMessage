import { Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { WalletAccount } from "useink/core";
import { axiosInstance } from "../../config/axios";
import { IApiProvider } from "useink";
import { CONSTANT } from "../../constants/constants";

type Props = {
  connectedWallet: WalletAccount;
  provider: IApiProvider;
};

type ConfirmWalletApiReturn = {
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
};

export const WalletOwnershipProver = (props: Props) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClick = async () => {
    setButtonDisabled(true);
    try {
      const randomNonce = await fetchNonce();
      if (randomNonce === undefined) {
        setErrorMessage("Failed fetching message to sign.");
        return;
      }
      await signMessage(randomNonce);
    } catch (err) {
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
          console.log(res.data.token);
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(`${err.code}: ${err.response.data}`);
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
        setErrorMessage("Could not query the message to sign for your address.");
        setButtonDisabled(false);
      });
  };
  return (
    <>
      <Button onClick={handleClick} size="small" variant="outlined" disabled={buttonDisabled}>
        {buttonDisabled ? <CircularProgress sx={{ fontSize: "0.8rem" }} /> : "Prove Ownership"}
      </Button>
      <Typography color="error">{errorMessage}</Typography>
    </>
  );
};
