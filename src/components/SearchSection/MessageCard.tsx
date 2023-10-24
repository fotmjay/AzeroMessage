import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import LockIcon from "@mui/icons-material/Lock";
import { Card, Box, Typography, Divider, Link, Dialog, Button } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";
import { Tooltip } from "react-tooltip";
import { formatTimestamp } from "../../helpers/timestampFormatting";
import { shortenAddressWithEllipsis } from "../../helpers/addressFormatting";
import { truncateText } from "../../helpers/textTruncate";
import { useResolveAddressToDomain } from "@azns/resolver-react";
import { useEffect, useState, useContext } from "react";
import { decryptMessageWithEncryptedPrivateKey } from "../../helpers/encryptionHelper";
import { CurrentConnectedWalletContext, MediaSmallContext } from "../../helpers/Contexts";

type Props = {
  message: MessageFromDatabase;
  ownershipProven: boolean;
};

const textLengthToTruncate = 150;

export const MessageCard = (props: Props) => {
  const [toggleShowAll, setToggleShowAll] = useState(false);
  const [locked, setLocked] = useState(props.message.encrypted || false);
  const [decryptedText, setdecryptedText] = useState("");
  const [hasError, setHasError] = useState(false);

  // CONTEXT
  const connectedWallet = useContext(CurrentConnectedWalletContext);
  const mediaSmall = useContext(MediaSmallContext);

  // RESOLVER HOOK
  const toResolver = useResolveAddressToDomain(props.message.to);
  const fromResolver = useResolveAddressToDomain(props.message.from);

  // Copy an address when you click on it
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const unlockText = async () => {
    const encPrivKey = sessionStorage.getItem(`encryptedPrivateKey:${connectedWallet}`);
    const myPubKey = sessionStorage.getItem(`myPublicKey:${connectedWallet}`);
    if (!encPrivKey || !myPubKey) {
      console.error("You need to prove ownership.");
      return;
    }
    const pswPrompt = prompt() || "";
    try {
      const decrypted = await decryptMessageWithEncryptedPrivateKey(
        props.message.text,
        encPrivKey,
        myPubKey,
        pswPrompt
      );
      if (typeof decrypted === "string") {
        setdecryptedText(decrypted);
      } else {
        setHasError(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (decryptedText) {
      setLocked(false);
    }
  }, [decryptedText]);

  const textToShow = decryptedText ? decryptedText : props.message.text;

  return (
    <Card sx={{ position: "relative", margin: "10px", padding: "5px", border: "1px solid grey" }}>
      <Link target="_blank" rel="noopener" href={props.message.explorerLink} underline="always">
        <Typography textAlign="center">{formatTimestamp(props.message.timestamp)}</Typography>
      </Link>
      <Divider />
      <Box display={mediaSmall ? "block" : "flex"} justifyContent="space-around" alignItems="center">
        <Typography
          data-tooltip-id="copiedTo"
          data-tooltip-content="Copied to clipboard"
          onClick={() => copyText(props.message.from)}
          textAlign={mediaSmall ? "center" : "left"}
          display="block"
          variant="subtitle1"
          width="fit-content"
          marginX="auto"
          sx={{ cursor: "copy", "&:hover": { textShadow: "1px 1px 2px red, 0 0 1em blue" } }}
        >
          From: {fromResolver.primaryDomain || shortenAddressWithEllipsis(props.message.from)}
        </Typography>

        {!mediaSmall && <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />}

        <Typography
          data-tooltip-id="copiedTo"
          data-tooltip-content="Copied to clipboard"
          onClick={() => copyText(props.message.from)}
          textAlign={mediaSmall ? "center" : "right"}
          display="block"
          width="fit-content"
          marginX="auto"
          variant="subtitle1"
          sx={{ cursor: "copy", "&:hover": { textShadow: "1px 1px 2px red, 0 0 1em blue" } }}
        >
          To: {toResolver.primaryDomain || shortenAddressWithEllipsis(props.message.to)}
        </Typography>
        <Tooltip style={{ background: "gray", maxWidth: "100px" }} positionStrategy="fixed" openOnClick id="copiedTo" />
      </Box>
      <Divider sx={{ marginBottom: "5px" }} />
      <Box>
        {locked && (
          <Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <LockIcon sx={{ fontSize: "2rem", color: "error.main" }} />
              <Typography display="block" textAlign="center" sx={{ color: "error.main" }} variant="h4">
                ENCRYPTED
              </Typography>
            </Box>
            <Typography
              onClick={props.ownershipProven && connectedWallet === props.message.to ? unlockText : undefined}
              display="block"
              width="fit-content"
              margin="auto"
              textAlign="center"
              sx={{
                color: "error.main",
                cursor: props.ownershipProven && connectedWallet === props.message.to ? "pointer" : "cursor",
              }}
              variant="body1"
            >
              {props.ownershipProven && connectedWallet === props.message.to ? "click to unlock" : "prove ownership"}
            </Typography>
          </Box>
        )}
        {!locked && (
          <Typography display="block" sx={{ overflowWrap: "break-word" }} variant="body1">
            {toggleShowAll ? textToShow : truncateText(textToShow, textLengthToTruncate)}
          </Typography>
        )}
      </Box>
      {!locked && textToShow.length > textLengthToTruncate && (
        <Typography fontSize="0.25rem" position="absolute" right="0" bottom="0" paddingRight="5px" color="primary">
          {toggleShowAll ? (
            <KeyboardDoubleArrowUpIcon
              sx={{ cursor: "pointer" }}
              onClick={() => setToggleShowAll((toggle) => !toggle)}
            />
          ) : (
            <KeyboardDoubleArrowDownIcon
              sx={{ cursor: "pointer" }}
              onClick={() => setToggleShowAll((toggle) => !toggle)}
            />
          )}
        </Typography>
      )}
      <Dialog
        fullWidth
        open={hasError}
        onClose={() => setHasError(false)}
        sx={{
          marginX: "auto",
          display: "block",
          maxWidth: "500px",
          top: mediaSmall ? "0" : "-40%",
        }}
      >
        <Box>
          <Card sx={{ padding: "15px", border: "1px solid" }}>
            <Typography variant="h4">Decryption Failed</Typography>
            <Divider sx={{ marginY: "10px" }} />
            <Typography gutterBottom variant="body1">
              Please ensure you have the right password and try again.
            </Typography>
            <Button onClick={() => setHasError(false)} sx={{ display: "block", marginLeft: "auto" }} variant="outlined">
              Close
            </Button>
          </Card>
        </Box>
      </Dialog>
    </Card>
  );
};
