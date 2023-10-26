import { Box, Container, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { SearchSectionContainer } from "../SearchSection/SearchSectionContainer";
import { SendingSectionContainer } from "../SendSection/SendingSectionContainer";
import { IApiProvider } from "useink";
import { WalletAccount } from "useink/core";
import { FAQ } from "../FAQ";

type Props = {
  provider: IApiProvider | undefined;
  selectedAccount: WalletAccount | undefined;
};
export const MainLayout = (props: Props) => {
  const [chosenTab, setChosenTab] = useState(0);

  const handleChange = (_e: React.SyntheticEvent, newTab: number) => {
    setChosenTab(newTab);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Container sx={{ display: "block" }}>
      <Box>
        <Tabs
          variant="fullWidth"
          sx={{ maxWidth: "500px", margin: "auto" }}
          value={chosenTab}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
        >
          <Tab label="Read Messages" {...a11yProps(0)} />
          <Tab label="Send Messages" {...a11yProps(1)} />
          <Tab label="FAQ" {...a11yProps(2)} />
        </Tabs>
        <SearchSectionContainer chosenTab={chosenTab} index={0} />
        <SendingSectionContainer
          provider={props.provider}
          selectedAccount={props.selectedAccount}
          chosenTab={chosenTab}
          index={1}
        />
        <FAQ chosenTab={chosenTab} index={2} />
      </Box>
    </Container>
  );
};
