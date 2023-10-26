import { useAllWallets } from "useink";
import { List, ListItemText, ListItemButton, Card, Divider, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { UseWalletContext } from "../../helpers/Contexts";
import { useContext } from "react";

type passedWallet = {
  installed: boolean;
  extensionName: string;
  installUrl: string;
};

export const ConnectWallet = () => {
  // Get the valid wallet extensions and put the installed one at top of list.
  const wallets = useAllWallets().sort((w1, w2) => (w1.installed === w2.installed ? 0 : w1.installed ? -1 : 1));
  const { connect } = useContext(UseWalletContext);

  const handleClick = (isInstalled: boolean, wallet: passedWallet): void => {
    if (isInstalled && connect) {
      connect(wallet.extensionName);
    } else {
      window.open(wallet.installUrl);
    }
  };

  return (
    <Card sx={{ padding: "15px", border: "1px solid" }}>
      <Typography variant="h4">Connect Wallet</Typography>
      <Divider sx={{ marginY: "10px" }} />

      <List sx={{ width: "100%", maxWidth: "400px" }}>
        {wallets.map((w) => {
          return (
            <ListItemButton sx={{ gap: "3px" }} onClick={() => handleClick(w.installed, w)} key={w.title}>
              <Avatar sx={{ width: "20px", height: "20px" }}>
                <img src={w.logo.src} alt={w.logo.alt} />
              </Avatar>
              <ListItemText
                primaryTypographyProps={{ variant: "body2", component: "h3", fontSize: "1rem" }}
                primary={w.installed ? `Connect to ${w.title}` : `Install ${w.title}`}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );
};
