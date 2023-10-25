import type { accountBalance } from "./types/polkaTypes";
import { BaseAppLayout } from "./components/layout/BaseAppLayout";
import { Container, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { CurrentConnectedWalletContext, MediaSmallContext } from "./helpers/Contexts";
import { HomeFooter } from "./components/HomeFooter";
import { MainLayout } from "./components/layout/MainLayout";
import { darkTheme, lightTheme } from "./constants/themes";
import { getBalanceFromChain } from "./chainRequests/balanceRequest";
import { useApi, useWallet } from "useink";
import { useEffect, useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("darkMode") === "true");
  const [ownershipProven, setOwnershipProven] = useState(false);
  const [selectedAccountBalance, setSelectedAccountBalance] = useState<accountBalance>();
  const { account, connect, disconnect, accounts, setAccount } = useWallet();
  const mediaSmall = useMediaQuery("(max-width:450px)");
  const chainNode = useApi("aleph");

  useEffect(() => {
    const encPrivKey = sessionStorage.getItem(`encryptedPrivateKey:${account?.address}`);
    const myPubKey = sessionStorage.getItem(`myPublicKey:${account?.address}`);
    if (!encPrivKey || !myPubKey) {
      setOwnershipProven(false);
    } else {
      setOwnershipProven(true);
    }
  }, [account, ownershipProven]);

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
      <CurrentConnectedWalletContext.Provider value={account?.address}>
        <MediaSmallContext.Provider value={mediaSmall}>
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
                ownershipProven={ownershipProven}
                selectedAccountBalance={selectedAccountBalance}
                darkMode={darkMode}
                switchTheme={switchTheme}
                account={account}
                connect={connect}
                disconnect={disconnect}
                accounts={accounts}
                setAccount={setAccount}
                provider={chainNode}
                setOwnershipProven={setOwnershipProven}
              />
            </Container>
            <MainLayout ownershipProven={ownershipProven} provider={chainNode} selectedAccount={account} />
            <HomeFooter />
          </Container>
        </MediaSmallContext.Provider>
      </CurrentConnectedWalletContext.Provider>
    </ThemeProvider>
  );
}

export default App;
