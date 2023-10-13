import { useState } from "react";
import { MessageList } from "./MessageList";
import { SearchTextField } from "./SearchTextField";
import { Card } from "@mui/material";
import { Transfer } from "../../types/polkaTypes";

export const SearchSectionContainer = () => {
  const [transactionArray, setTransactionArray] = useState<Transfer[]>();

  return (
    <Card sx={{ position: "relative", overflow: "visible" }}>
      <SearchTextField setTransactionArray={setTransactionArray} />
      {transactionArray !== undefined && <MessageList transactionArray={transactionArray} />}
    </Card>
  );
};
