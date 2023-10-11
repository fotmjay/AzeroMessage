import { Container } from "@mui/material";
import { useWallet } from "useink";
import { Web3ConnectionSection } from "./components/web3/Web3ConnectionSection";

function App() {
  const { account, connect, disconnect, accounts, setAccount } = useWallet();
  return (
    <Container sx={{ width: "450px" }}>
      <Web3ConnectionSection
        account={account}
        connect={connect}
        disconnect={disconnect}
        accounts={accounts}
        setAccount={setAccount}
      />
    </Container>
  );
}

export default App;
