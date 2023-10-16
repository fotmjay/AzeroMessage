import { MessageFromDatabase } from "../../types/polkaTypes";
import { MessageCard } from "./MessageCard";

type Props = {
  messageList: MessageFromDatabase[];
};

export const MessageList = (props: Props) => {
  return (
    <>
      {props.messageList.length === 0
        ? "No messages found."
        : props.messageList.map((message, i) => <MessageCard key={i} message={message} />)}
    </>
  );
};
