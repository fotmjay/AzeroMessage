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
        console.log(accountChosen);
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
        padding: "20px",
        width: "fit-content",
        gap: "5px",
      }}
    >
      <Typography>{props.account ? props.account.name : null}</Typography>
      <Typography>{props.account ? props.account.address : null}</Typography>
      <Box width="100%" display="flex" justifyContent="space-between">
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => setSwitchAccountToggle((toggle) => !toggle)}
        >
          Switch Account
        </Button>
        <Button size="small" variant="contained" color="error" onClick={props.disconnect}>
          Disconnect
        </Button>
      </Box>
      {switchAccountToggle && (
        <FormControl sx={{ marginTop: "20px" }} fullWidth>
          <InputLabel id="demo-simple-select-label">Switch</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.account}
            label="account"
            onChange={switchAccount}
            defaultValue={props.account}
          >
            {props.accounts?.map((account) => {
              return (
                <MenuItem sx={{ width: "fit-content" }} key={account.address} value={account.address}>
                  {account.address}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
    </Card>
  );
};
