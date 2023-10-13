import { SetStateAction } from "react";
import { IApiProvider } from "useink";
import { manualBalanceFormat } from "../helpers/numberFormatting";
import type { accountBalance } from "../types/polkaTypes";

export const getBalanceFromChain = async (
  provider: IApiProvider,
  address: string,
  onSuccess: React.Dispatch<SetStateAction<accountBalance | undefined>>
) => {
  try {
    const balance = await provider.api.query.system.account(address);
    const decimals = await provider.api.registry;
    const formatted = manualBalanceFormat(balance.data.free.toPrimitive(), decimals.chainDecimals[0]);
    onSuccess({ amount: formatted, chainTokens: decimals.chainTokens[0] });
  } catch (error) {
    console.error(error);
  }
};
