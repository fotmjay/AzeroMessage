import { Box, Button, Card, Divider, Typography } from "@mui/material";
import { MessageList } from "./SearchSection/MessageList";
import { SetStateAction, useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import { useResolveDomainToAddress } from "@azns/resolver-react";

type Props = {
  setShowPublicBoard: React.Dispatch<SetStateAction<boolean>>;
  showPublicBoard: boolean;
};

export const PublicBoard = (props: Props) => {
  const publicBoardAddress = useResolveDomainToAddress("azeromessage.azero").address;
  const [messageList, setMessageList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
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
        onClick={() => props.setShowPublicBoard((toggle) => !toggle)}
      >
        {props.showPublicBoard ? "Hide" : "Show"}
      </Button>
      <Typography variant="h6" component="h3" textAlign="center">
        Public Board
      </Typography>
      <Box sx={{ display: props.showPublicBoard ? "block" : "none" }}>
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
