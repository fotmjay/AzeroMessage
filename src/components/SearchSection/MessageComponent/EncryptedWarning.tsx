import { Box, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { ProveOwnershipContext } from "../../../App";
import { useContext } from "react";
import { CurrentConnectedWalletContext } from "../../../helpers/Contexts";

type Props = {
  target: string;
  unlockText: () => void;
};

export const EncryptedWarning = (props: Props) => {
  const { ownershipProven } = useContext(ProveOwnershipContext);
  const { account } = useContext(CurrentConnectedWalletContext);

  let textToDisplay;

  if (ownershipProven && props.target === account?.address) {
    textToDisplay = "click to unlock";
  } else if (props.target !== account?.address) {
    textToDisplay = "can't decrypt from this wallet";
  } else {
    textToDisplay = "prove ownership";
  }

  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <LockIcon sx={{ fontSize: "2rem", color: "error.main" }} />
        <Typography display="block" textAlign="center" sx={{ color: "error.main" }} variant="h4">
          ENCRYPTED
        </Typography>
      </Box>
      <Typography
        onClick={ownershipProven && props.target === account?.address ? props.unlockText : undefined}
        display="block"
        width="fit-content"
        margin="auto"
        textAlign="center"
        sx={{
          color: "error.main",
          cursor: ownershipProven && props.target === account?.address ? "pointer" : "cursor",
        }}
        variant="body1"
      >
        {textToDisplay}
      </Typography>
    </Box>
  );
};
