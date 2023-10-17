import { Typography, Button, Collapse, Container } from "@mui/material";
import { FAQ } from "./FAQ";
import { useState } from "react";

export const HomeFooter = () => {
  const [faqIsOpen, setFaqIsOpen] = useState(false);
  return (
    <Container sx={{ marginTop: "10px" }}>
      <Typography textAlign="center" paddingBottom="10px">
        &copy; 2023 - FotmJay
      </Typography>
      <Button
        onClick={() => setFaqIsOpen((toggle) => !toggle)}
        variant="outlined"
        sx={{ display: "block", marginX: "auto" }}
      >
        FAQ
      </Button>
      <Collapse in={faqIsOpen}>
        <FAQ />
      </Collapse>
    </Container>
  );
};
