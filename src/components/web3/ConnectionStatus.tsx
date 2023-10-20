// ICONS
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Box, Typography } from "@mui/material";
import { WalletAccount } from "useink/core";
import { shortenAddressWithEllipsis } from "../../helpers/addressFormatting";
import type { accountBalance } from "../../types/polkaTypes";
import { formatBalanceWithUnits } from "../../helpers/numberFormatting";

type Props = {
  setOpenWalletModal: React.Dispatch<React.SetStateAction<boolean>>;
  connectedWallet: WalletAccount | undefined;
  selectedAccountBalance?: accountBalance;
};

export const ConnectionStatus = (props: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-end",
      }}
    >
      <Box display="flex" alignItems="center" gap="10px">
        <Typography sx={{ fontSize: "0.75rem" }}>
          {props.connectedWallet !== undefined
            ? shortenAddressWithEllipsis(props.connectedWallet.address)
            : "Not connected"}
        </Typography>
        <AccountBalanceWalletIcon onClick={() => props.setOpenWalletModal(true)} />
      </Box>
      <Typography>
        {props.selectedAccountBalance &&
          formatBalanceWithUnits(props.selectedAccountBalance.amount, props.selectedAccountBalance.chainTokens)}
      </Typography>
    </Box>
  );
};
