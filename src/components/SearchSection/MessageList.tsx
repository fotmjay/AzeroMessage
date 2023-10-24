import { Typography } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";
import { MessageCard } from "./MessageCard";

type Props = {
  messageList: MessageFromDatabase[];
  ownershipProven: boolean;
};

export const MessageList = (props: Props) => {
  return (
    <>
      {props.messageList.length === 0 ? (
        <Typography textAlign="center">No messages found.</Typography>
      ) : (
        props.messageList.map((message, i) => (
          <MessageCard ownershipProven={props.ownershipProven} key={i} message={message} />
        ))
      )}
    </>
  );
};
