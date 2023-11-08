import { Box, Typography } from "@mui/material";

type Props = {
  messageToShow: string;
  color: string;
  icon?: any;
};

export const FormInfoBox = (props: Props) => {
  return (
    <Box display="flex" justifyContent="flex-start" alignItems="center" color={props.color} paddingTop="5px">
      <Typography variant="body1" sx={{ marginTop: "5px" }} paddingX="5px">
        {props.icon}
      </Typography>
      <Typography variant="body1" sx={{ wordWrap: "normal" }}>
        {props.messageToShow}
      </Typography>
    </Box>
  );
};
