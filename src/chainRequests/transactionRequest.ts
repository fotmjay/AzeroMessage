import { IApiProvider } from "useink";
import { ContractPromise, WalletAccount, WeightV2 } from "useink/core";
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
  toggleMultisend: boolean,
  setSubscriptionText: React.Dispatch<SetStateAction<string>>
) => {
  const addressToSend = toggleMultisend ? address.split(",") : address;
  const contract = new ContractPromise(provider.api, metadata, CONSTANT.CONTRACT.ADDRESS);
  const gasLimit = provider.api.registry.createType("WeightV2", {
    refTime: 200000000000,
    proofSize: 150000,
  });
  const feesForMessage = await getTransactionCost(
    contract,
    signerAccount,
    gasLimit,
    toggleMultisend ? addressToSend.length : 0
  );
  if (feesForMessage === 0) {
    setSubscriptionText("There was an error fetching the messaging fee.");
    return;
  } else {
    setSubscriptionText(`Fees will be ${parseInt(feesForMessage.toString(), 10) / 1000000000000} Azero`);
  }
  let transaction;
  if (toggleMultisend) {
    transaction = await contract.tx.bulkSendMessage(
      { gasLimit: gasLimit, storageDepositLimit: null, value: feesForMessage },
      addressToSend,
      message
    );
  } else {
    transaction = await contract.tx.sendMessage(
      { gasLimit: gasLimit, storageDepositLimit: null, value: feesForMessage },
      addressToSend,
      message,
      encrypted
    );
  }

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

const getTransactionCost = async (
  contract: ContractPromise,
  signerAccount: any,
  gasLimit: WeightV2,
  multisendNumber: number
) => {
  try {
    if (multisendNumber === 0) {
      const { output } = await contract.query.getStandardFee(signerAccount.address, {
        storageDepositLimit: null,
        gasLimit: gasLimit,
      });
      //@ts-ignore
      return new BN(output.toPrimitive().ok);
    } else {
      const baseFee = await contract.query.getBulkBaseFee(signerAccount.address, {
        storageDepositLimit: null,
        gasLimit: gasLimit,
      });
      const bulkVarFee = await contract.query.getBulkVarFee(signerAccount.address, {
        storageDepositLimit: null,
        gasLimit: gasLimit,
      });
      //@ts-ignore
      return new BN(baseFee.output?.toPrimitive().ok + bulkVarFee.output?.toPrimitive().ok * multisendNumber);
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};
