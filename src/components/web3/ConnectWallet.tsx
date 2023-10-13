import { useAllWallets } from "useink";
import { List, ListItemText, ListItemButton, DialogContent } from "@mui/material";
import Avatar from "@mui/material/Avatar";

type Props = {
  connect: (walletName: string) => void;
};

type passedWallet = {
  installed: boolean;
  extensionName: string;
  installUrl: string;
};

export const ConnectWallet = (props: Props) => {
  // Get the valid wallet extensions and put the installed one at top of list.
  const wallets = useAllWallets().sort((w1, w2) => (w1.installed === w2.installed ? 0 : w1.installed ? -1 : 1));

  const handleClick = (isInstalled: boolean, wallet: passedWallet): void => {
    if (isInstalled) {
      props.connect(wallet.extensionName);
    } else {
      window.open(wallet.installUrl);
    }
  };

  return (
    <DialogContent>
      <List sx={{ width: "100%", maxWidth: 200 }}>
        {wallets.map((w) => {
          return (
            <ListItemButton sx={{ gap: "3px" }} onClick={() => handleClick(w.installed, w)} key={w.title}>
              <Avatar sx={{ width: "20px", height: "20px" }}>
                <img src={w.logo.src} alt={w.logo.alt} />
              </Avatar>
              <ListItemText
                primaryTypographyProps={{ variant: "body2", component: "h3", fontSize: "0.8rem" }}
                primary={w.installed ? `Connect to ${w.title}` : `Install ${w.title}`}
              />
            </ListItemButton>
          );
        })}
      </List>
    </DialogContent>
  );
};

//     <>
//       <p>You are connected as {account?.name || account.address}</p>

//       <button onClick={disconnect}>Disconnect Wallet</button>
//     </>
//   );
