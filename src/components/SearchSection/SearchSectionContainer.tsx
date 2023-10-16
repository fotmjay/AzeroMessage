import { useState } from "react";
import { MessageList } from "./MessageList";
import { SearchTextField } from "./SearchTextField";
import { Card } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";

export const SearchSectionContainer = () => {
  const [messageList, setMessageList] = useState<MessageFromDatabase[]>();

  return (
    <>
      <Card sx={{ position: "relative", overflow: "visible", marginBottom: "10px" }}>
        <SearchTextField setMessageList={setMessageList} />
      </Card>
      <Card sx={{}}>{messageList !== undefined && <MessageList messageList={messageList} />}</Card>
    </>
  );
};
