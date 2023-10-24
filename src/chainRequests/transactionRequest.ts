import { IApiProvider } from "useink";
import { ContractPromise, WalletAccount } from "useink/core";
import metadata from "../assets/azero_message.json";
import { CONSTANT } from "../constants/constants";
import { BN } from "@polkadot/util";
import { SetStateAction } from "react";

export const makeTransaction = async (
  provider: IApiProvider,
  signerAccount: WalletAccount,
  address: string,
  message: string,
  encrypted: boolean,
  setSubscriptionText: React.Dispatch<SetStateAction<string>>
) => {
  const contract = new ContractPromise(provider.api, metadata, CONSTANT.CONTRACT.ADDRESS);
  const gasLimit = provider.api?.registry.createType("WeightV2", {
    refTime: 4200000000,
    proofSize: 200000,
  });
  const transaction = await contract.tx.sendMessage(
    { gasLimit: gasLimit, storageDepositLimit: null, value: new BN("200000000001") },
    address,
    message,
    encrypted
  );

  const unsub = await transaction.signAndSend(signerAccount.address, { signer: signerAccount.signer }, (result) => {
    setSubscriptionText(`Status: ${result.status.defKeys[result.status.index]}`);
    if (result.status.isInBlock) {
      setSubscriptionText(`Transaction included in block.`);
    } else if (result.status.isFinalized) {
      setSubscriptionText(`Transaction finalized.`);
      unsub();
      setTimeout(() => setSubscriptionText(""), 1500);
    } else if (result.status.index > 6 || result.status.index === 4) {
      setSubscriptionText(`Error: Transaction ${result.status.defKeys[result.status.index]}`);
    }
  });
};
