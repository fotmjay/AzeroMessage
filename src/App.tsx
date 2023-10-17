import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  responsiveFontSizes,
  Typography,
  Button,
  Collapse,
} from "@mui/material";

import { useApi, useWallet } from "useink";
import { useEffect, useState } from "react";
import { BaseAppLayout } from "./components/layout/BaseAppLayout";
import { MainLayout } from "./components/layout/MainLayout";
import { getBalanceFromChain } from "./chainRequests/balanceRequest";
import type { accountBalance } from "./types/polkaTypes";
import { FAQ } from "./components/FAQ";

const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
    },
    typography: {
      fontSize: 10,
      fontFamily: "Roboto, Arial, serif",
      fontWeightRegular: "200",
    },
  })
);

const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
    },
    typography: {
      fontSize: 10,
      fontFamily: "Roboto, Arial, serif",
      fontWeightRegular: "200",
    },
  })
);

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("darkMode") === "true");
  const { account, connect, disconnect, accounts, setAccount } = useWallet();
  const [selectedAccountBalance, setSelectedAccountBalance] = useState<accountBalance>();
  const [faqIsOpen, setFaqIsOpen] = useState(false);
  const chainNode = useApi("aleph");

  function switchTheme() {
    setDarkMode((darkMode) => {
      localStorage.setItem("darkMode", `${!darkMode}`);
      return !darkMode;
    });
  }

  useEffect(() => {
    if (account && chainNode) {
      getBalanceFromChain(chainNode, account.address, setSelectedAccountBalance);
    }
  }, [account, chainNode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container sx={{ height: "100vh" }}>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <BaseAppLayout
            selectedAccountBalance={selectedAccountBalance}
            darkMode={darkMode}
            switchTheme={switchTheme}
            account={account}
            connect={connect}
            disconnect={disconnect}
            accounts={accounts}
            setAccount={setAccount}
          />
        </Container>
        <MainLayout provider={chainNode} selectedAccount={account} />

        <Typography textAlign="center" paddingBottom="10px">
          &copy; 2023 - FotmJay
        </Typography>
        <Button
          onClick={() => setFaqIsOpen((toggle) => !toggle)}
          variant="outlined"
          sx={{ display: "block", marginX: "auto" }}
        >
          FAQ
        </Button>
        <Collapse in={faqIsOpen}>
          <FAQ />
        </Collapse>
      </Container>
    </ThemeProvider>
  );
}

export default App;
