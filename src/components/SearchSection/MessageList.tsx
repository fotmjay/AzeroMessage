import { Typography } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";
import { MessageCard } from "./MessageCard";

type Props = {
  messageList: MessageFromDatabase[];
};

export const MessageList = (props: Props) => {
  return (
    <>
      {props.messageList.length === 0 ? (
        <Typography textAlign="center">No messages found.</Typography>
      ) : (
        props.messageList.map((message, i) => <MessageCard key={i} message={message} />)
      )}
    </>
  );
};
