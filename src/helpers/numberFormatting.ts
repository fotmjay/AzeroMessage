import { BN } from "@polkadot/util";

export const manualBalanceFormat = (balance: string | number, decimals: number) => {
  const base = new BN(10).pow(new BN(decimals));
  const dm = new BN(balance).divmod(base);
  return parseFloat(dm.div.toString() + "." + dm.mod.toString());
};

export const formatBalanceWithUnits = (balance: number, units: string): string => {
  return `${balance.toFixed(3)} ${units}`;
};
