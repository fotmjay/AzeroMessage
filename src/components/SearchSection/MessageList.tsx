import { Transfer } from "../../types/polkaTypes";
import { MessageCard } from "./MessageCard";

type Props = {
  transactionArray: Transfer[];
};

export const MessageList = (props: Props) => {
  const filteredArray = props.transactionArray.filter((transaction) => transaction.amount_v2 === "4206942069");
  console.log(filteredArray);

  return (
    filteredArray.length > 0 && filteredArray.map((transaction, i) => <MessageCard key={i} transaction={transaction} />)
  );
};
