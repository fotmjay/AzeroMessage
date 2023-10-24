import { useState } from "react";
import { MessageList } from "./MessageList";
import { SearchTextField } from "./SearchTextField";
import { Card, Typography } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";

type Props = {
  ownershipProven: boolean;
};

export const SearchSectionContainer = (props: Props) => {
  const [messageList, setMessageList] = useState<MessageFromDatabase[]>();
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <>
      <Card
        sx={{ position: "relative", overflow: "visible", marginBottom: "10px", maxWidth: "500px", marginX: "auto" }}
      >
        {errorMessage.length > 0 && (
          <Typography sx={{ display: "block", marginX: "auto", paddingLeft: "20px" }} textAlign="left" color="error">
            {errorMessage}
          </Typography>
        )}
        <SearchTextField setMessageList={setMessageList} setErrorMessage={setErrorMessage} />
      </Card>
      <Card sx={{ maxWidth: "600px", marginX: "auto" }}>
        {messageList !== undefined && <MessageList ownershipProven={props.ownershipProven} messageList={messageList} />}
      </Card>
    </>
  );
};
