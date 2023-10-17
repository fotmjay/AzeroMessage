import { Box, SvgIconTypeMap, Typography } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type Props = {
  messageToShow: string;
  color: string;
  icon?: any;
};

export const FormInfoBox = (props: Props) => {
  return (
    <Box display="flex" justifyContent="flex-start" alignItems="center" color={props.color} paddingTop="5px">
      <Typography paddingX="5px">{props.icon}</Typography>
      <Typography>{props.messageToShow}</Typography>
    </Box>
  );
};
