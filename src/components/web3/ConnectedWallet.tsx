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
import { useState } from "react";
import { WalletAccount } from "useink/core";
import { shortenAddressWithEllipsis } from "../../helpers/addressFormatting";

type Props = {
  account: WalletAccount | undefined;
  disconnect: () => void;
  accounts: WalletAccount[] | undefined;
  setAccount: (account: WalletAccount) => void;
};

export const ConnectedWallet = (props: Props) => {
  const [switchAccountToggle, setSwitchAccountToggle] = useState(false);

  const switchAccount = (e: SelectChangeEvent<WalletAccount>) => {
    if (props.accounts) {
      const accountChosen = props.accounts.find((account) => account.address === e.target.value);
      if (accountChosen !== undefined) {
        return props.setAccount(accountChosen);
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
      }}
    >
      <Typography variant="h6">{props.account ? props.account.name : null}</Typography>
      <Typography variant="body1">
        {props.account ? shortenAddressWithEllipsis(props.account.address) : null}
      </Typography>
      <Box width="100%" display="flex" justifyContent="space-between">
        {props.accounts!.length > 1 && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setSwitchAccountToggle((toggle) => !toggle)}
          >
            Switch
          </Button>
        )}

        <Button sx={{ marginLeft: "auto" }} size="small" variant="contained" color="error" onClick={props.disconnect}>
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
            defaultValue={props.account}
            value={props.account}
            size="small"
          >
            {props.accounts?.map((account) => {
              return (
                <MenuItem
                  sx={{
                    width: "100%",
                    border: account.address === props.account!.address ? "1px solid green" : "",
                  }}
                  key={account.address}
                  value={account.address}
                  defaultChecked
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
