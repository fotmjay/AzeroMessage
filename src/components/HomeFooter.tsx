import { Typography, Link, Box } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";

export const HomeFooter = () => {
  return (
    <Box sx={{ marginTop: "10px" }}>
      <Typography textAlign="center" paddingBottom="3px">
        &copy; 2023 AzeroMessage - FotmJay
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center" paddingBottom="0px" gap="3px">
        <Link href="https://www.twitter.com/fotmjay" target="_blank">
          <TwitterIcon />
        </Link>
        <Link href="https://www.github.com/fotmjay" target="_blank">
          <GitHubIcon />
        </Link>
      </Box>
    </Box>
  );
};
