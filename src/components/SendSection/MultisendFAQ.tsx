import { Box, Button, Card, Divider, Typography } from "@mui/material";
import React, { SetStateAction } from "react";

type Props = {
  setMultisendWarningToggle: React.Dispatch<SetStateAction<boolean>>;
  setToggleMultisend: React.Dispatch<SetStateAction<boolean>>;
};

export const MultisendFAQ = (props: Props) => {
  const handleClick = (warningAccept: boolean) => {
    props.setMultisendWarningToggle(false);
    props.setToggleMultisend(warningAccept);
  };

  return (
    <Box>
      <Card sx={{ padding: "15px", border: "1px solid" }}>
        <Typography variant="h4">Multisend Warning</Typography>
        <Divider sx={{ marginY: "10px" }} />
        <Typography gutterBottom variant="body1">
          By checking the multisend box, you will send your message to all addresses in the address field. Addresses
          need to be separated by a comma.
        </Typography>
        <Typography gutterBottom variant="body1">
          E.g. address1, address2, address3 or address1,address2,address3
        </Typography>
        <Typography gutterBottom variant="body1" color="warning.main">
          ***Fees: 2 AZERO + 0.02 PER ADDRESS***
        </Typography>
        <Box display="flex" justifyContent="flex-end" columnGap="5px">
          <Button variant="outlined" type="button" color="error" onClick={() => handleClick(false)}>
            Cancel
          </Button>
          <Button variant="outlined" type="button" onClick={() => handleClick(true)}>
            Confirm
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
