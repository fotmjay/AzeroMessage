import { Box, Card, Typography } from "@mui/material";
import { MessageList } from "./SearchSection/MessageList";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";

type Props = {
  chosenTab: number;
  index: number;
};

export const LatestMessagesContainer = (props: Props) => {
  const [latestMessages, setLatestMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.chosenTab === props.index) {
      setIsLoading(true);
      axiosInstance
        .get(`/api/messages/latest`)
        .then((res) => {
          setLatestMessages(res.data.data);
        })
        .catch((err) => {
          console.error(err);
          if (err.code === "ECONNABORTED") {
            setErrorMessage("Connection timed out.  Please try again.");
          } else {
            setErrorMessage(err.message);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [props.chosenTab, props.index]);

  return (
    <Box hidden={props.chosenTab !== props.index}>
      <Card
        sx={{
          padding: "15px",
          paddingTop: "0px",
          maxWidth: "500px",
          marginX: "auto",
          marginBottom: "10px",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography paddingX="10px" paddingTop="10px" color="error.main">
          {errorMessage}
        </Typography>
        {isLoading ? <Typography>Loading...</Typography> : <MessageList messageList={latestMessages} />}
      </Card>
    </Box>
  );
};
