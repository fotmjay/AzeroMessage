import { Box, Button, Card, Divider, Typography } from "@mui/material";
import { MessageList } from "./SearchSection/MessageList";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import { useResolveDomainToAddress } from "@azns/resolver-react";

export const PublicBoard = () => {
  const publicBoardAddress = useResolveDomainToAddress("azeromessage.azero").address;
  const [messageList, setMessageList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showBoard, setShowBoard] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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
        })
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    requestToDatabase();
  }, [publicBoardAddress]);

  return (
    <Card
      sx={{
        position: "relative",
        marginX: "auto",
        maxWidth: "500px",
        border: "1px solid",
        borderColor: "divider",
        paddingX: "10px",
      }}
    >
      <Button
        sx={{ position: "absolute", right: "5px", top: "5px", padding: "0" }}
        variant="contained"
        size="small"
        onClick={() => setShowBoard((toggle) => !toggle)}
      >
        {showBoard ? "Hide" : "Show"}
      </Button>
      <Typography variant="h6" component="h3" textAlign="center">
        Public Board
      </Typography>
      <Box sx={{ display: showBoard ? "block" : "none" }}>
        <Typography textAlign="center" variant="subtitle2">
          To publish on the public board, send a message to azeromessage.azero
        </Typography>
        <Divider sx={{ paddingTop: "3px" }} />
        {errorMessage === "" ? (
          isLoading ? (
            "Loading..."
          ) : (
            <MessageList messageList={messageList} publicBoard={true} />
          )
        ) : (
          <Typography textAlign="center" color="error.main" variant="subtitle2">
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Card>
  );
};
