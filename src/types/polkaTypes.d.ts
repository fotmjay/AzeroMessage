export type accountBalance = {
  amount: number;
  chainTokens: string;
};

export type MessageFromDatabase = {
  from: string;
  to: string;
  timestamp: number;
  text: string;
  explorerLink: string;
  encrypted: boolean;
};
