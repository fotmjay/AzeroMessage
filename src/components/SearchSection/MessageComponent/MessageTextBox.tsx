import { Box, Typography } from "@mui/material";
import { SetStateAction } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { truncateText } from "../../../helpers/textTruncate";
import { CONSTANT } from "../../../constants/constants";

type Props = {
  messageText: string;
  setToggleShowAll: React.Dispatch<SetStateAction<boolean>>;
  toggleShowAll: boolean;
};

export const MessageTextBox = (props: Props) => {
  return (
    <Box>
      <Typography display="block" sx={{ overflowWrap: "break-word" }} variant="body1">
        {props.toggleShowAll
          ? props.messageText
          : truncateText(props.messageText, CONSTANT.DISPLAY.TEXTLENGTHTOTRUNCATE)}
      </Typography>
      {props.messageText.length > CONSTANT.DISPLAY.TEXTLENGTHTOTRUNCATE && (
        <Typography fontSize="0.25rem" position="absolute" right="0" bottom="0" paddingRight="5px" color="primary">
          {props.toggleShowAll ? (
            <KeyboardDoubleArrowUpIcon
              sx={{ cursor: "pointer" }}
              onClick={() => props.setToggleShowAll((toggle) => !toggle)}
            />
          ) : (
            <KeyboardDoubleArrowDownIcon
              sx={{ cursor: "pointer" }}
              onClick={() => props.setToggleShowAll((toggle) => !toggle)}
            />
          )}
        </Typography>
      )}
    </Box>
  );
};
