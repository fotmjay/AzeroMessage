import { Typography } from "@mui/material";
import { shortenAddressWithEllipsis } from "../../../helpers/addressFormatting";
import { MediaSmallContext } from "../../../helpers/Contexts";
import { useContext } from "react";

type Props = {
  address: string;
  domain: string | null | undefined;
  target: string;
};

export const AddressField = (props: Props) => {
  const mediaSmall = useContext(MediaSmallContext);

  // Copy an address when you click on it
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Typography
      data-tooltip-id="copiedTo"
      data-tooltip-content="Copied to clipboard"
      onClick={() => copyText(props.address)}
      textAlign={mediaSmall ? "center" : "left"}
      display="block"
      variant="subtitle1"
      width="fit-content"
      marginX="auto"
      sx={{ cursor: "copy", "&:hover": { textShadow: "1px 1px 2px red, 0 0 1em blue" } }}
    >
      {props.target}: {props.domain || shortenAddressWithEllipsis(props.address)}
    </Typography>
  );
};
