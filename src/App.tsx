import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { useApi, useWallet } from "useink";
import { useEffect, useState } from "react";
import { BaseAppLayout } from "./components/layout/BaseAppLayout";
import { MainLayout } from "./components/layout/MainLayout";
import { getBalanceFromChain } from "./chainRequests/balanceRequest";
import type { accountBalance } from "./types/polkaTypes";
import { HomeFooter } from "./components/HomeFooter";
import { darkTheme, lightTheme } from "./constants/themes";

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("darkMode") === "true");
  const { account, connect, disconnect, accounts, setAccount } = useWallet();
  const [selectedAccountBalance, setSelectedAccountBalance] = useState<accountBalance>();
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
    } else {
      setSelectedAccountBalance(undefined);
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
            provider={chainNode}
          />
        </Container>
        <MainLayout provider={chainNode} selectedAccount={account} />
        <HomeFooter />
      </Container>
    </ThemeProvider>
  );
}

export default App;
