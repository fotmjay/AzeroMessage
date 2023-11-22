import { Card, Divider, Typography } from "@mui/material";
import { MessageList } from "./SearchSection/MessageList";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import { useResolveDomainToAddress } from "@azns/resolver-react";

export const PublicBoard = () => {
  const publicBoardAddress = useResolveDomainToAddress("azeromessage.azero").address;
  const [messageList, setMessageList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const requestToDatabase = () => {
    if (publicBoardAddress !== undefined) {
      axiosInstance
        .get(`/api/messages/receiver/${publicBoardAddress}`)
        .then((res) => {
          setMessageList(res.data.data);
        })
        .catch((err) => {
          console.error(err);
          if (err.code === "ECONNABORTED") {
            setErrorMessage("Connection timed out.  Please try again.");
          } else {
            setErrorMessage(err.response.data);
          }
        });
    }
  };

  useEffect(() => {
    requestToDatabase();
  }, [publicBoardAddress]);

  return (
    <Card sx={{ marginX: "auto", maxWidth: "500px", border: "1px solid initial" }}>
      <Typography variant="h6" component="h3" textAlign="center">
        Public Board
      </Typography>
      <Typography textAlign="center" variant="subtitle2">
        To publish on the public board, send a message to azeromessage.azero
      </Typography>
      <Divider sx={{ paddingTop: "3px" }} />
      {errorMessage === "" ? (
        <MessageList messageList={messageList} />
      ) : (
        <Typography textAlign="center" color="error.main" variant="subtitle2">
          {errorMessage}
        </Typography>
      )}
    </Card>
  );
};
