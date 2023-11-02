import { Card, Link, List, ListItem, Typography } from "@mui/material";
import { CONSTANT } from "../constants/constants";

export const FAQ = () => {
  return (
    <Card
      sx={{
        maxWidth: "500px",
        marginX: "auto",
        marginTop: "15px",
        marginBottom: "25px",
        border: "1px solid",
        padding: "10px",
      }}
    >
      <Typography
        sx={{ textDecorationLine: "underline", textDecorationThickness: "0.5px" }}
        textAlign="center"
        variant="h4"
        component="h3"
        paddingY="15px"
      >
        Frequently Asked Questions
      </Typography>
      <Typography fontWeight="bold" paddingX="5px">
        How does it work?
      </Typography>
      <Typography paddingX="15px">
        Search an Aleph Zero address and see what messages were sent to (or from!) it on the blockchain.
      </Typography>

      <Typography fontWeight="bold" paddingX="5px">
        How do I send a message?
      </Typography>
      <List sx={{ listStyleType: "digit", listStylePosition: "inside" }} dense={true} disablePadding>
        <ListItem sx={{ display: "list-item", paddingY: 0 }}>
          Connect your wallet using your preferred extension.
        </ListItem>
        <ListItem sx={{ display: "list-item", paddingY: 0 }}>Enter the address you want to send a message to.</ListItem>
        <ListItem sx={{ display: "list-item", paddingY: 0 }}>
          Type in your message ({CONSTANT.MAXMESSAGELENGTH} characters maximum!).
        </ListItem>
        <ListItem sx={{ display: "list-item", paddingY: 0 }}>
          Click "Send" and approve your transaction in your wallet.
        </ListItem>
        <ListItem sx={{ paddingY: 0, color: "warning.main" }}>
          **** There is a 0.05 AZERO fee to send a message. ****
        </ListItem>
      </List>
      <Typography fontWeight="bold" paddingX="5px">
        Encryption? How does it work?
      </Typography>
      <Typography paddingX="15px">
        Everyone can send encrypted messages. To receive encrypted messages, you need to enable encryption by choosing a
        password in your settings.
      </Typography>
      <Typography paddingX="15px" color="warning.main">
        Encrypted messages CANNOT be sent to users who have not enabled it as they won't be able to decrypt them.
      </Typography>
      <Typography fontWeight="bold" paddingX="5px">
        I changed my password and can't decrypt messages anymore, why?
      </Typography>
      <Typography paddingX="15px">
        A new encryption keypair is generated every time you set a password. This makes all previously received messages
        non-decryptable, while all newly-received encrypted messages will be decryptable only with that fresh password.
      </Typography>
      <Typography fontWeight="bold" paddingX="5px">
        Can I see the code?
      </Typography>
      <Typography paddingX="15px">
        Sure thing! All parts (smart-contract, back-end and front-end) are available on
        <Link sx={{ color: "lightblue" }} target="_blank" href="https://www.github.com/fotmJay">
          Github
        </Link>
        .
      </Typography>

      <Typography fontWeight="bold" paddingX="5px">
        Is it safe?
      </Typography>
      <Typography paddingX="15px" paddingBottom="15px">
        It hasn't been audited. Use at your own risk.
      </Typography>
    </Card>
  );
};
