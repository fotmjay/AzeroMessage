import { Box, Container, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { SearchSectionContainer } from "../SearchSection/SearchSectionContainer";
import { SendingSectionContainer } from "../SendSection/SendingSectionContainer";
import { IApiProvider } from "useink";
import { WalletAccount } from "useink/core";

type Props = {
  provider: IApiProvider | undefined;
  selectedAccount: WalletAccount | undefined;
};
export const MainLayout = (props: Props) => {
  const [toggleSendingTab, setToggleSendingTab] = useState(false);

  const handleChange = () => {
    setToggleSendingTab((toggle) => !toggle);
  };

  return (
    <Container sx={{ display: "block" }}>
      <Box>
        <Tabs
          variant="fullWidth"
          sx={{ maxWidth: "450px", margin: "auto" }}
          value={toggleSendingTab}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
        >
          <Tab value={false} label="Read Messages" />
          <Tab value={true} label="Send Messages" />
        </Tabs>
        {toggleSendingTab ? (
          <SendingSectionContainer provider={props.provider} selectedAccount={props.selectedAccount} />
        ) : (
          <SearchSectionContainer />
        )}
      </Box>
    </Container>
  );
};
