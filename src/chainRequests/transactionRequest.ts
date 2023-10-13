import { IApiProvider } from "useink";
import { WalletAccount } from "useink/core";

export const makeTransaction = async (
  provider: IApiProvider,
  signerAccount: WalletAccount,
  setSubscriptionText: React.Dispatch<React.SetStateAction<string>>
) => {
  const toArray = [
    {
      address: "5DXv1GkX3eKeZZaqrZUHEkbKECgmERrWpuPjFAmDLeS8cd4U", // Bob (with 42 ss58 prefix)
      amount: 4_206_942_069,
    },
  ];

  // https://polkadot.js.org/docs/api/cookbook/tx#how-can-i-batch-transactions
  const callArr = toArray.map((toInfo) => {
    const { amount, address: toAddress } = toInfo;
    const transfer = provider.api.tx.balances.transferKeepAlive(toAddress, amount);

    return transfer;
  });
  callArr.push(await provider.api.tx.system.remarkWithEvent("hi how u doing"));
  const SENDER = signerAccount.address;
  provider.api.tx.utility.batch(callArr).signAndSend(SENDER, { signer: signerAccount.signer }, (result) => {
    setSubscriptionText(`Status: ${result.status.defKeys[result.status.index]}`);
    if (result.status.isInBlock) {
      setSubscriptionText(`Transaction included in block.`);
    } else if (result.status.isFinalized) {
      setSubscriptionText(`Transaction finalized.`);
      setTimeout(() => setSubscriptionText(""), 1500);
    } else if (result.status.index > 6 || result.status.index === 4) {
      setSubscriptionText(`Error: Transaction ${result.status.defKeys[result.status.index]}`);
    }
  });

  //   try {
  //     await provider.api.tx.balances
  //       .transferKeepAlive("5DXv1GkX3eKeZZaqrZUHEkbKECgmERrWpuPjFAmDLeS8cd4U", 1_000_000_000_000)
  //       .signAndSend(SENDER, { signer: signerAccount.signer }, (result) => {
  //         setSubscriptionText(`Status: ${result.status.defKeys[result.status.index]}`);
  //         if (result.status.isInBlock) {
  //           setSubscriptionText(`Transaction included in block.`);
  //         } else if (result.status.isFinalized) {
  //           setSubscriptionText(`Transaction finalized.`);
  //           setTimeout(() => setSubscriptionText(""), 1500);
  //         } else if (result.status.index > 6 || result.status.index === 4) {
  //           setSubscriptionText(`Error: Transaction ${result.status.defKeys[result.status.index]}`);
  //         }
  //       });
  //   } catch (err) {
  //     setSubscriptionText("UNKNOWN_ERROR");
  //     console.error(err);
  //   }
};
