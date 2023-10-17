import { Card, Box, Typography, Divider, useMediaQuery, Link } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";
import { shortenAddressWithEllipsis } from "../../helpers/addressFormatting";
import { useState } from "react";
import { truncateText } from "../../helpers/textTruncate";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { formatTimestamp } from "../../helpers/timestampFormatting";
import { Tooltip } from "react-tooltip";
import { useResolveAddressToDomain } from "@azns/resolver-react";

type Props = {
  message: MessageFromDatabase;
};

const textLengthToTruncate = 150;

export const MessageCard = (props: Props) => {
  const [toggleShowAll, setToggleShowAll] = useState(false);
  const mediaSmall = useMediaQuery("(max-width:500px)");
  const toResolver = useResolveAddressToDomain(props.message.to);
  const fromResolver = useResolveAddressToDomain(props.message.from);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card sx={{ position: "relative", margin: "10px", padding: "5px", border: "1px solid grey" }}>
      <Link target="_blank" rel="noopener" href={props.message.explorerLink} underline="always">
        <Typography textAlign="center">{formatTimestamp(props.message.timestamp)}</Typography>
      </Link>
      <Divider />
      <Box display={mediaSmall ? "block" : "flex"} justifyContent="space-around" alignItems="center">
        <Typography
          data-tooltip-id="copiedTo"
          data-tooltip-content="Copied to clipboard"
          onClick={() => copyText(props.message.from)}
          textAlign={mediaSmall ? "center" : "left"}
          display="block"
          variant="subtitle1"
          width="fit-content"
          marginX="auto"
          sx={{ cursor: "copy", "&:hover": { textShadow: "1px 1px 2px red, 0 0 1em blue" } }}
        >
          From: {fromResolver.primaryDomain || shortenAddressWithEllipsis(props.message.from)}
        </Typography>

        {!mediaSmall && <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />}

        <Typography
          data-tooltip-id="copiedTo"
          data-tooltip-content="Copied to clipboard"
          onClick={() => copyText(props.message.from)}
          textAlign={mediaSmall ? "center" : "right"}
          display="block"
          width="fit-content"
          marginX="auto"
          variant="subtitle1"
          sx={{ cursor: "copy", "&:hover": { textShadow: "1px 1px 2px red, 0 0 1em blue" } }}
        >
          To: {toResolver.primaryDomain || shortenAddressWithEllipsis(props.message.to)}
        </Typography>
        <Tooltip style={{ background: "gray", maxWidth: "100px" }} positionStrategy="fixed" openOnClick id="copiedTo" />
      </Box>
      <Divider sx={{ marginBottom: "5px" }} />
      <Box>
        <Typography display="block" sx={{ overflowWrap: "break-word" }} variant="body1">
          {toggleShowAll ? props.message.text : truncateText(props.message.text, textLengthToTruncate)}
        </Typography>
      </Box>
      {props.message.text.length > textLengthToTruncate && (
        <Typography fontSize="0.25rem" position="absolute" right="0" bottom="0" paddingRight="5px" color="primary">
          {toggleShowAll ? (
            <KeyboardDoubleArrowUpIcon
              sx={{ cursor: "pointer" }}
              onClick={() => setToggleShowAll((toggle) => !toggle)}
            />
          ) : (
            <KeyboardDoubleArrowDownIcon
              sx={{ cursor: "pointer" }}
              onClick={() => setToggleShowAll((toggle) => !toggle)}
            />
          )}
        </Typography>
      )}
    </Card>
  );
};
