import { Box, Typography } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";
import { MessageCard } from "./MessageCard";
import { useState } from "react";

type Props = {
  messageList: MessageFromDatabase[];
};

export const MessageList = (props: Props) => {
  const [decryptionPassword, setDecryptionPassword] = useState("");

  return (
    <Box>
      {props.messageList.length === 0 ? (
        <Typography textAlign="center">No messages found.</Typography>
      ) : (
        props.messageList.map((message) => (
          <MessageCard
            setDecryptionPassword={setDecryptionPassword}
            decryptionPassword={decryptionPassword}
            key={`${message.timestamp}${message.to}${message.from}`}
            message={message}
          />
        ))
      )}
    </Box>
  );
};
