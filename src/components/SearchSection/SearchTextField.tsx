import { TextField, IconButton, InputAdornment, Divider, Button, CircularProgress } from "@mui/material";
import { SetStateAction, useState } from "react";
import { addressFormatValidation } from "../../helpers/validations";
import { axiosInstance } from "../../config/axios";
import { MessageFromDatabase } from "../../types/polkaTypes";

type Props = {
  setMessageList: React.Dispatch<SetStateAction<MessageFromDatabase[] | undefined>>;
  setErrorMessage: React.Dispatch<SetStateAction<string>>;
};

export const SearchTextField = (props: Props) => {
  const [addressTextField, setAddressTextField] = useState("");
  const [toggleMessageFrom, setToggleMessageFrom] = useState(false);
  const [disabledSearch, setDisabledSearch] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressTextField(e.target.value);
  };

  const handleSearch = () => {
    if (!addressFormatValidation(addressTextField)) {
      props.setMessageList(undefined);
      props.setErrorMessage("The address you entered is not valid.");
      return;
    }
    props.setErrorMessage("");
    setDisabledSearch(true);
    const fromOrTo = toggleMessageFrom ? "sender" : "receiver";
    axiosInstance
      .get(`/api/messages/${fromOrTo}/${addressTextField}`)
      .then((res) => {
        props.setMessageList(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        if (err.code === "ECONNABORTED") {
          props.setErrorMessage(
            "Due to free hosting, servers shut down when unused.  Should be good in 30 seconds or so."
          );
        } else {
          props.setErrorMessage(err.message);
        }
      })
      .finally(() => setDisabledSearch(false));
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
                {toggleMessageFrom ? "Sent from" : "Sent to"}
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </InputAdornment>
          ),
          sx: { paddingLeft: "10px", borderBottomLeftRadius: "0", borderBottomRightRadius: "0" },
        }}
      />
      <Button
        sx={{ borderTopLeftRadius: "0", borderTopRightRadius: "0" }}
        variant="contained"
        onClick={handleSearch}
        fullWidth
        disabled={disabledSearch}
      >
        {disabledSearch ? <CircularProgress /> : "Search"}
      </Button>
    </>
  );
};
