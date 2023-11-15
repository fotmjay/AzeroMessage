import { Card, Box, Typography, Divider, Link } from "@mui/material";
import { MessageFromDatabase } from "../../types/polkaTypes";
import { Tooltip } from "react-tooltip";
import { formatTimestamp } from "../../helpers/timestampFormatting";

import { useResolveAddressToDomain } from "@azns/resolver-react";
import { useEffect, useState, useContext, SetStateAction } from "react";
import { decryptMessageWithEncryptedPrivateKey } from "../../helpers/encryptionHelper";
import { MediaSmallContext, ProveOwnershipContext } from "../../helpers/Contexts";
import { DecryptionFailedDialog } from "./DecryptionFailedDialog";
import { DecryptionPasswordDialog } from "./DecryptionPasswordDialog";
import { AddressField } from "./MessageComponent/AddressField";
import { EncryptedWarning } from "./MessageComponent/EncryptedWarning";
import { MessageTextBox } from "./MessageComponent/MessageTextBox";

type Props = {
  message: MessageFromDatabase;
  setDecryptionPassword: React.Dispatch<SetStateAction<string>>;
  decryptionPassword: string;
};

export const MessageCard = (props: Props) => {
  const [toggleShowAll, setToggleShowAll] = useState(false);
  const [locked, setLocked] = useState(true);
  const [textToShow, setTextToShow] = useState("");
  const [hasError, setHasError] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  // CONTEXT
  const { ownershipProven, encAddresses } = useContext(ProveOwnershipContext);
  const mediaSmall = useContext(MediaSmallContext);

  // RESOLVER HOOK
  const toResolver = useResolveAddressToDomain(props.message.to);
  const fromResolver = useResolveAddressToDomain(props.message.from);

  const unlockText = () => {
    if (
      !ownershipProven ||
      encAddresses === undefined ||
      encAddresses?.encPrivKey === "" ||
      encAddresses?.myPubKey === ""
    ) {
      console.error("You need to prove ownership.");
      return;
    }
    if (props.decryptionPassword === "") {
      setOpenPasswordDialog(true);
    } else {
      sendToDecrypt();
    }
  };

  const sendToDecrypt = async () => {
    try {
      // Only reached here if previous unlockText went through
      const decrypted = await decryptMessageWithEncryptedPrivateKey(
        props.message.text,
        encAddresses!.encPrivKey,
        encAddresses!.myPubKey,
        props.decryptionPassword
      );
      if (typeof decrypted === "string") {
        setTextToShow(decrypted);
        setLocked(false);
      } else {
        setHasError(true);
        props.setDecryptionPassword("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (props.message.encrypted !== true) {
      setLocked(false);
      setTextToShow(props.message.text);
    }
  }, [locked, props.message.text, props.message.encrypted]);

  return (
    <Card sx={{ position: "relative", margin: "10px", padding: "5px", border: "1px solid grey" }}>
      <Link target="_blank" rel="noopener" href={props.message.explorerLink} underline="always">
        <Typography textAlign="center">{formatTimestamp(props.message.timestamp)}</Typography>
      </Link>

      <Divider />

      <Box display={mediaSmall ? "block" : "flex"} justifyContent="space-around" alignItems="center">
        <AddressField target="From" address={props.message.from} domain={fromResolver.primaryDomain} />

        {!mediaSmall && <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />}

        <AddressField target="To" address={props.message.to} domain={toResolver.primaryDomain} />
        <Tooltip style={{ background: "gray", maxWidth: "100px" }} positionStrategy="fixed" openOnClick id="copiedTo" />
      </Box>

      <Divider sx={{ marginBottom: "5px" }} />

      <Box>
        {locked ? (
          <EncryptedWarning target={props.message.to} unlockText={unlockText} />
        ) : (
          <MessageTextBox setToggleShowAll={setToggleShowAll} toggleShowAll={toggleShowAll} messageText={textToShow} />
        )}
      </Box>
      <DecryptionFailedDialog setHasError={setHasError} hasError={hasError} />
      <DecryptionPasswordDialog
        decryptionPassword={props.decryptionPassword}
        setDecryptionPassword={props.setDecryptionPassword}
        openPasswordDialog={openPasswordDialog}
        setOpenPasswordDialog={setOpenPasswordDialog}
        sendToDecrypt={sendToDecrypt}
      />
    </Card>
  );
};
