import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { shortenAddressWithEllipsis } from "../../helpers/addressFormatting";
import { CurrentConnectedWalletContext, UseWalletContext } from "../../helpers/Contexts";

export const ConnectedWallet = () => {
  const [switchAccountToggle, setSwitchAccountToggle] = useState(false);
  const { account } = useContext(CurrentConnectedWalletContext);
  const { accounts, setAccount, disconnect } = useContext(UseWalletContext);

  const switchAccount = (e: SelectChangeEvent<string>) => {
    if (accounts && setAccount) {
      const accountChosen = accounts.find((account) => account.address === e.target.value);
      if (accountChosen !== undefined) {
        return setAccount(accountChosen);
      }
    }
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "15px",
        gap: "5px",
        border: "1px solid",
      }}
    >
      <Typography variant="h6">{account ? account.name : null}</Typography>
      <Typography variant="body1">{account ? shortenAddressWithEllipsis(account.address) : null}</Typography>
      <Box width="100%" display="flex" justifyContent="space-between">
        {accounts!.length > 1 && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setSwitchAccountToggle((toggle) => !toggle)}
          >
            Switch
          </Button>
        )}

        <Button sx={{ marginLeft: "auto" }} size="small" variant="contained" color="error" onClick={disconnect}>
          Disconnect
        </Button>
      </Box>
      {switchAccountToggle && (
        <FormControl sx={{ marginTop: "20px" }} fullWidth>
          <InputLabel id="demo-simple-select-label">Switch address</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Switch address"
            onChange={switchAccount}
            value={account?.address}
            defaultValue=""
            size="medium"
          >
            {accounts?.map((account) => {
              return (
                <MenuItem
                  sx={{
                    width: "100%",
                    border: account.address === account!.address ? "1px solid #00eac7" : "",
                  }}
                  key={account.address}
                  value={account.address}
                >
                  {shortenAddressWithEllipsis(account.address)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
    </Card>
  );
};
