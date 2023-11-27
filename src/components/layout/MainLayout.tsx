import { Box, Button, Container, Tab, Tabs, Typography } from "@mui/material";
import React, { SetStateAction, useContext, useState } from "react";
import { SearchSectionContainer } from "../SearchSection/SearchSectionContainer";
import { SendingSectionContainer } from "../SendSection/SendingSectionContainer";
import { FAQ } from "../FAQ";
import { LatestMessagesContainer } from "../LatestMessagesContainer";
import { PublicBoard } from "../PublicBoard";
import { MediaSizeContext } from "../../helpers/Contexts";

type Props = {
  showFaq: boolean;
  setShowFaq: React.Dispatch<SetStateAction<boolean>>;
};

export const MainLayout = (props: Props) => {
  const [chosenTab, setChosenTab] = useState(0);
  const mediaSize = useContext(MediaSizeContext);
  const [showPublicBoard, setShowPublicBoard] = useState(true);

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
    <Container
      sx={{
        display: mediaSize.medium || showPublicBoard === false ? "block" : "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ maxWidth: "500px", marginX: "auto", paddingTop: "20px", paddingX: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "center", columnGap: "15px" }}>
          <Typography variant="subtitle1" component="h3" textAlign="center" color="primary.main" fontWeight="500">
            PUBLIC BOARD
          </Typography>
          <Button
            sx={{ minWidth: "fit-content", minHeight: "fit-content", paddingX: "5px", paddingY: 0 }}
            variant="contained"
            size="small"
            onClick={() => setShowPublicBoard((toggle) => !toggle)}
          >
            {showPublicBoard ? "Hide" : "Show"}
          </Button>
        </Box>
        <Typography textAlign="center" variant="subtitle2" gutterBottom={true}>
          Send a message to azeromessage.azero to publish!
        </Typography>
        <PublicBoard setShowPublicBoard={setShowPublicBoard} showPublicBoard={showPublicBoard} />
      </Box>
      <Box paddingTop="19px">
        <Tabs
          variant="fullWidth"
          sx={{ maxWidth: "500px", margin: "auto", paddingTop: 0 }}
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
