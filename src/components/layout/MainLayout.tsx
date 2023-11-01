import { Box, Container, Tab, Tabs } from "@mui/material";
import React, { SetStateAction, useEffect, useState } from "react";
import { SearchSectionContainer } from "../SearchSection/SearchSectionContainer";
import { SendingSectionContainer } from "../SendSection/SendingSectionContainer";
import { FAQ } from "../FAQ";
import { LatestMessagesContainer } from "../LatestMessagesContainer";

type Props = {
  showFaq: boolean;
  setShowFaq: React.Dispatch<SetStateAction<boolean>>;
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
          <Tab label="Read Messages" {...a11yProps(0)} onClick={() => props.setShowFaq(false)} />
          <Tab label="Send Messages" {...a11yProps(1)} onClick={() => props.setShowFaq(false)} />
          <Tab label="Latest messages" {...a11yProps(2)} onClick={() => props.setShowFaq(false)} />
        </Tabs>
        <SearchSectionContainer chosenTab={props.showFaq ? -1 : chosenTab} index={0} />
        <SendingSectionContainer chosenTab={props.showFaq ? -1 : chosenTab} index={1} />
        <LatestMessagesContainer chosenTab={props.showFaq ? -1 : chosenTab} index={2} />
        {props.showFaq && <FAQ />}
      </Box>
    </Container>
  );
};
