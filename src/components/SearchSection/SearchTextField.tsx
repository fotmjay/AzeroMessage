import { TextField, IconButton, InputAdornment, Typography, Divider } from "@mui/material";
import { SetStateAction, useState } from "react";
import { addressFormatValidation } from "../../helpers/validations";
import { axiosInstance } from "../../config/axios";
import { Transfer } from "../../types/polkaTypes";

type Props = {
  setTransactionArray: React.Dispatch<SetStateAction<Transfer[] | undefined>>;
};

export const SearchTextField = (props: Props) => {
  const [addressTextField, setAddressTextField] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressTextField(e.target.value);
  };

  const handleSearch = () => {
    if (!addressFormatValidation(addressTextField)) {
      setErrorMessage("The address you entered is not valid.");
      return;
    }
    axiosInstance
      .post("/api/v2/scan/transfers", { address: addressTextField, row: 100 })
      .then((res) => {
        props.setTransactionArray(res.data.data.transfers);
      })
      .catch((err) => console.error(err));

    setErrorMessage("");
  };

  return (
    <>
      <TextField
        fullWidth
        size="small"
        onChange={handleChange}
        value={addressTextField}
        placeholder="Enter address"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton
                sx={{ borderRadius: "0" }}
                type="button"
                onClick={handleSearch}
                size="small"
                edge="end"
                color="primary"
              >
                <Typography padding="0">SEARCH</Typography>
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {errorMessage.length > 0 && (
        <Typography sx={{ position: "absolute", top: "40px" }} gutterBottom textAlign="center" color="error">
          {errorMessage}
        </Typography>
      )}
    </>
  );
};
