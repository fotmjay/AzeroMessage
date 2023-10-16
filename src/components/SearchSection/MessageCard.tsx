import { Card, Box, Typography, Divider, useMediaQuery } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";
import { shortenAddressWithEllipsis } from "../../helpers/addressFormatting";
import { useState } from "react";
import { truncateText } from "../../helpers/textTruncate";

type Props = {
  message: MessageFromDatabase;
};

const textLengthToTruncate = 150;

export const MessageCard = (props: Props) => {
  const [toggleShowAll, setToggleShowAll] = useState(false);
  const mediaSmall = useMediaQuery("(max-width:400px)");
  return (
    <Card sx={{ position: "relative", margin: "10px", padding: "5px", border: "1px solid grey" }}>
      <Box display={mediaSmall ? "block" : "flex"} justifyContent="space-around" alignItems="center">
        <Typography textAlign={mediaSmall ? "center" : "left"} display="block" variant="subtitle1">
          From: {shortenAddressWithEllipsis(props.message.from)}
        </Typography>
        {!mediaSmall && <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />}
        <Typography textAlign={mediaSmall ? "center" : "right"} display="block" variant="subtitle1">
          To: {shortenAddressWithEllipsis(props.message.to)}
        </Typography>
      </Box>
      <Divider sx={{ marginBottom: "5px" }} />
      <Box>
        <Typography display="block" sx={{ overflowWrap: "break-word" }} variant="body1">
          {toggleShowAll ? props.message.text : truncateText(props.message.text, textLengthToTruncate)}
        </Typography>
      </Box>
      {props.message.text.length > textLengthToTruncate && (
        <Typography
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={() => setToggleShowAll((toggle) => !toggle)}
          fontSize="0.5rem"
          position="absolute"
          right="0"
          bottom="0"
          paddingRight="5px"
        >
          {toggleShowAll ? "Wrap" : "Unwrap"}
        </Typography>
      )}
    </Card>
  );
};
