import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import LockIcon from "@mui/icons-material/Lock";
import { Card, Box, Typography, Divider, Link } from "@mui/material";
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
  const mediaSmall = useContext(MediaSmallContext);
  const toResolver = useResolveAddressToDomain(props.message.to);
  const fromResolver = useResolveAddressToDomain(props.message.from);

  const connectedWallet = useContext(CurrentConnectedWalletContext);

  // Copy an address when you click on it
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const unlockText = async () => {
    const encPrivKey = sessionStorage.getItem(`encryptedPrivateKey:${connectedWallet}`);
    const myPubKey = sessionStorage.getItem(`myPublicKey:${connectedWallet}`);
    if (!encPrivKey || !myPubKey) {
      console.log("prove ownership");
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

      setdecryptedText(decrypted);
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
              onClick={props.ownershipProven ? unlockText : undefined}
              display="block"
              width="fit-content"
              margin="auto"
              textAlign="center"
              sx={{ color: "error.main", cursor: props.ownershipProven ? "pointer" : "cursor" }}
              variant="body1"
            >
              {props.ownershipProven ? "click to unlock" : "prove ownership"}
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
    </Card>
  );
};
