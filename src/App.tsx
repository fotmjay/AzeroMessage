import type { accountBalance } from "./types/polkaTypes";
import { BaseAppLayout } from "./components/layout/BaseAppLayout";
import { Container, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import {
  CurrentConnectedWalletContext,
  MediaSmallContext,
  ProveOwnershipContext,
  UseWalletContext,
} from "./helpers/Contexts";
import { HomeFooter } from "./components/HomeFooter";
import { MainLayout } from "./components/layout/MainLayout";
import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "./constants/themes";
import { getBalanceFromChain } from "./chainRequests/balanceRequest";
import { useApi, useWallet } from "useink";

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    localStorage.getItem("darkMode") === "false" ? false : true
  );
  const [encryptionAddresses, setEncryptionAddresses] = useState({ myPubKey: "", encPrivKey: "" });
  const [ownershipProven, setOwnershipProven] = useState(false);
  const [selectedAccountBalance, setSelectedAccountBalance] = useState<accountBalance>();
  const [showFaq, setShowFaq] = useState(false);
  const chainNode = useApi("aleph");
  const mediaSmall = useMediaQuery("(max-width:500px)");
  const { account, connect, disconnect, accounts, setAccount } = useWallet();

  useEffect(() => {
    const encPrivKey = sessionStorage.getItem(`encryptedPrivateKey:${account?.address}`);
    const myPubKey = sessionStorage.getItem(`myPublicKey:${account?.address}`);
    if (!encPrivKey || !myPubKey) {
      setOwnershipProven(false);
      setEncryptionAddresses({ myPubKey: "", encPrivKey: "" });
    } else {
      setOwnershipProven(true);
      setEncryptionAddresses({ myPubKey, encPrivKey });
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
      <CurrentConnectedWalletContext.Provider
        value={{ account: account || undefined, provider: chainNode || undefined }}
      >
        <ProveOwnershipContext.Provider
          value={{ ownershipProven, setOwnershipProven, encAddresses: encryptionAddresses }}
        >
          <MediaSmallContext.Provider value={mediaSmall}>
            <UseWalletContext.Provider value={{ connect, disconnect, accounts, setAccount }}>
              <CssBaseline />
              <Container sx={{ height: "100vh", minWidth: "330px" }}>
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
                    setShowFaq={setShowFaq}
                  />
                </Container>
                <MainLayout showFaq={showFaq} setShowFaq={setShowFaq} />
                <HomeFooter />
              </Container>
            </UseWalletContext.Provider>
          </MediaSmallContext.Provider>
        </ProveOwnershipContext.Provider>
      </CurrentConnectedWalletContext.Provider>
    </ThemeProvider>
  );
}

export default App;
