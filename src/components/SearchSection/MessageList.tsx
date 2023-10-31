import { Box, Typography } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";
import { MessageCard } from "./MessageCard";
import { useEffect, useState } from "react";
import PaginationRounded from "./PaginationRounded";

type Props = {
  messageList: MessageFromDatabase[];
};

export const MessageList = (props: Props) => {
  const [decryptionPassword, setDecryptionPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentlyDisplayedMessages, setCurrentlyDisplayedMessages] = useState<MessageFromDatabase[]>();

  const maxNumberOfPages = Math.ceil(props.messageList.length / 10);

  useEffect(() => {
    setCurrentlyDisplayedMessages(props.messageList.slice((currentPage - 1) * 10, currentPage * 10));
  }, [currentPage, props.messageList]);

  return (
    <Box>
      {currentlyDisplayedMessages === undefined ? (
        <Typography textAlign="center">No messages found.</Typography>
      ) : (
        currentlyDisplayedMessages.map((message) => {
          return (
            <MessageCard
              setDecryptionPassword={setDecryptionPassword}
              decryptionPassword={decryptionPassword}
              key={`${message.timestamp}${message.to}${message.from}`}
              message={message}
            />
          );
        })
      )}
      <Box display="flex" justifyContent="flex-end" alignItems="center" paddingX="8px" paddingBottom="5px">
        <PaginationRounded currentPage={currentPage} onChange={setCurrentPage} maxNumberOfPages={maxNumberOfPages} />
      </Box>
    </Box>
  );
};
