import { Card, Box, Typography } from "@mui/material";
import { Transfer } from "../../types/polkaTypes";

type Props = {
  transaction: Transfer;
};

export const MessageCard = (props: Props) => {
  return (
    <Card sx={{ marginTop: "10px", paddingTop: "5px" }}>
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <Typography variant="subtitle1">From</Typography>
        <Typography variant="subtitle1">Date</Typography>
      </Box>
      <Box>
        <Typography variant="body1">Message</Typography>
      </Box>
    </Card>
  );
};
