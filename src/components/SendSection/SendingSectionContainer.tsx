import { Button, Typography } from "@mui/material";
import { IApiProvider } from "useink";
import { makeTransaction } from "../../chainRequests/transactionRequest";
import { WalletAccount } from "useink/core";
import { useState } from "react";

type Props = {
  provider: IApiProvider | undefined;
  selectedAccount?: WalletAccount;
};

export const SendingSectionContainer = (props: Props) => {
  const [transactionState, setTransactionState] = useState("");

  const createTransaction = () => {
    if (props.provider && props.selectedAccount) {
      makeTransaction(props.provider, props.selectedAccount, setTransactionState);
    }
  };
  return (
    <>
      <Button onClick={createTransaction} variant="contained">
        Send
      </Button>
      <Typography>{transactionState}</Typography>
    </>
  );
};
