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

  useEffect(() => {
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
      });
  }, []);

  return (
    <Box hidden={props.chosenTab !== props.index}>
      <Card sx={{ padding: "15px", paddingTop: "0px", maxWidth: "500px", marginX: "auto", marginBottom: "10px" }}>
        <Typography paddingX="10px" paddingTop="10px" color="error.main">
          {errorMessage}
        </Typography>
        <MessageList messageList={latestMessages} />
      </Card>
    </Box>
  );
};
