import { useWeb3Wallet } from "@/components/web3wallet/Web3Wallet";
import { Network, networkMap } from "@/components/web3wallet/types";
import { useNetworkConfig } from "@/config/env.config";
import { BetType } from "@/types/baseType";
import { Account, Aptos, AptosConfig, Network as NetworkAptos, Ed25519PrivateKey,Serializer, InputViewFunctionData, TypeTag, TypeTagSigner } from "@aptos-labs/ts-sdk";

export type Event<T = any> = {
  guid: {
      creation_number: string;
      account_address: string;
  };
  sequence_number: string;
  type: string;
  data: T;
}

export type BetLogData = {
  account: string;
  bet_type: BetType;
  rm_num: string;
  microseconds: string;
}

export const rmNumBetTypeMap = (rmNum: number) => {
  if (rmNum < 12) return BetType.Scissors
  if (rmNum < 24) return BetType.Rock
  return BetType.Cloth
}

const HosFistAddress = '0x5ac02f516237aa285f3adb7c16ac6c4c90975a087c80c9a570ea2ea4f7248471'

export const useHosfist = () => {
  const config = new AptosConfig({ network: useNetworkConfig });
  const aptos = new Aptos(config);

  const betHandler = async (betNum: BetType) => {
    const { preVerification, signAndSubmitTransaction } = useWeb3Wallet()
    const info = await preVerification(networkMap(useNetworkConfig))
    if (!info) throw new Error('Please connect your wallet first');

    const balance = await aptos.getAccountAPTAmount({
      accountAddress: info.address
    })
    if (balance < 10000000) {
      await fetch(`https://faucet.testnet.aptoslabs.com/mint?amount=100000000&address=${info.address}`, {
        method: 'post'
      })
    }
    const pendingTxn = await signAndSubmitTransaction({
      function: `${HosFistAddress}::hosfist::bet_handler`,
      functionArguments:[betNum],
      typeArguments: [],
    })
    const response = await aptos.waitForTransaction({
      transactionHash: pendingTxn.hash,
    });
    if (!response.success) throw new Error('bet faill')
    const event = ((response as any).events as Event[]).find(item => item.type === `${HosFistAddress}::hosfist::BetLog`)
    if (!event) throw new Error('bet faill')
    return (event as Event<BetLogData>).data;
  }

  const getGameLogs = async (page: number, pageSize: number) => {
    const res = await aptos.event.getModuleEventsByEventType({eventType: `${HosFistAddress}::hosfist::BetLog`, options: {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: [{transaction_block_height: 'desc'}]
    }})
    return res.map(item => item.data as BetLogData);
  }

  return {
    betHandler,
    getGameLogs
  }


}
