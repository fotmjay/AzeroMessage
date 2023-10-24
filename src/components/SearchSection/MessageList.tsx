import { Box, Typography } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";
import { MessageCard } from "./MessageCard";
import { useContext, useEffect, useState } from "react";
import { CurrentConnectedWalletContext } from "../../helpers/Contexts";

type Props = {
  messageList: MessageFromDatabase[];
  ownershipProven: boolean;
};

export const MessageList = (props: Props) => {
  const [decryptionPassword, setDecryptionPassword] = useState("");
  const [encryptionAddresses, setEncryptionAddresses] = useState({ myPubKey: "", encPrivKey: "" });
  const connectedWallet = useContext(CurrentConnectedWalletContext);

  useEffect(() => {
    const encPrivKey = sessionStorage.getItem(`encryptedPrivateKey:${connectedWallet}`);
    const myPubKey = sessionStorage.getItem(`myPublicKey:${connectedWallet}`);
    if (encPrivKey && myPubKey) {
      setEncryptionAddresses({ myPubKey, encPrivKey });
    }
  }, [props.ownershipProven, connectedWallet]);

  return (
    <Box>
      {props.messageList.length === 0 ? (
        <Typography textAlign="center">No messages found.</Typography>
      ) : (
        props.messageList.map((message, i) => (
          <MessageCard
            encryptionAddresses={encryptionAddresses}
            setDecryptionPassword={setDecryptionPassword}
            decryptionPassword={decryptionPassword}
            ownershipProven={props.ownershipProven}
            key={i}
            message={message}
          />
        ))
      )}
    </Box>
  );
};
