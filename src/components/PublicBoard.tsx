import { Box, Card, Typography } from "@mui/material";
import { MessageList } from "./SearchSection/MessageList";
import { SetStateAction, useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import { useResolveDomainToAddress } from "@azns/resolver-react";
import { MessageFromDatabase } from "../types/polkaTypes";
import { CONSTANT } from "../constants/constants";

type Props = {
  setShowPublicBoard: React.Dispatch<SetStateAction<boolean>>;
  showPublicBoard: boolean;
};

export const PublicBoard = (props: Props) => {
  const publicBoardAddress = useResolveDomainToAddress("azeromessage.azero").address;
  const [messageList, setMessageList] = useState<MessageFromDatabase[]>([]);
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
        display: props.showPublicBoard ? "block" : "none",
        position: "relative",
        marginX: "auto",
        maxWidth: "500px",
        border: "1px solid",
        borderColor: "divider",
        paddingX: "10px",
        height: "auto",
      }}
    >
      <Box>
        {errorMessage === "" ? (
          isLoading ? (
            "Loading..."
          ) : (
            <MessageList messageList={messageList.slice(0, CONSTANT.MAXIMUMPUBLICMESSAGES)} publicBoard={true} />
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
