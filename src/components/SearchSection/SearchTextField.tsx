import { TextField, IconButton, InputAdornment, Typography, Divider } from "@mui/material";
import { SetStateAction, useState } from "react";
import { addressFormatValidation } from "../../helpers/validations";
import { axiosInstance } from "../../config/axios";
import { MessageFromDatabase } from "../../types/polkaTypes";

type Props = {
  setMessageList: React.Dispatch<SetStateAction<MessageFromDatabase[] | undefined>>;
};

export const SearchTextField = (props: Props) => {
  const [addressTextField, setAddressTextField] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [toggleMessageFrom, setToggleMessageFrom] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressTextField(e.target.value);
  };

  const handleSearch = () => {
    if (!addressFormatValidation(addressTextField)) {
      props.setMessageList(undefined);
      setErrorMessage("The address you entered is not valid.");
      return;
    }
    const fromOrTo = toggleMessageFrom ? "sender" : "receiver";
    axiosInstance
      .get(`/api/messages/${fromOrTo}/${addressTextField.toLowerCase()}`)
      .then((res) => {
        props.setMessageList(res.data.data);
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
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                sx={{ borderRadius: "0" }}
                type="button"
                onClick={() => setToggleMessageFrom((toggle) => !toggle)}
                size="small"
                edge="start"
                color="primary"
              >
                {toggleMessageFrom ? "Sent from:" : "Sent to:"}
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </InputAdornment>
          ),
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
                Search
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
