import { useState } from "react";
import { MessageList } from "./MessageList";
import { SearchTextField } from "./SearchTextField";
import { Card, Typography } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";

export const SearchSectionContainer = () => {
  const [messageList, setMessageList] = useState<MessageFromDatabase[]>();
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <>
      <Card
        sx={{ position: "relative", overflow: "visible", marginBottom: "10px", maxWidth: "500px", marginX: "auto" }}
      >
        <SearchTextField setMessageList={setMessageList} setErrorMessage={setErrorMessage} />
      </Card>
      <Card sx={{ maxWidth: "600px", marginX: "auto" }}>
        {messageList !== undefined && <MessageList messageList={messageList} />}
      </Card>
      {errorMessage.length > 0 && (
        <Typography sx={{ display: "block", marginX: "auto" }} textAlign="center" color="error">
          {errorMessage}
        </Typography>
      )}
    </>
  );
};
