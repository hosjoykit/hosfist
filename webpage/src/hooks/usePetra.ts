import { GetLoginInfo, Network, ResetLoginInfo, SetLoginInfo, WalletName } from '@/components/web3wallet/types'
import { once } from 'lodash'

const isPetraInstalled = !!(window as any).aptos

const getAptosWallet = (): any => {
  if ('aptos' in window) {
    return window.aptos
  } else {
    window.open('https://petra.app/', `_blank`)
  }
}

type Account = { address: string; publicKey: string }

const connect = async (): Promise<Account> => {
  const wallet = getAptosWallet()
  await wallet.connect()
  const account = await wallet.account()
  return account
}

const isConnected = () => {
  return getAptosWallet().isConnected()
}

const account = () => {
  return getAptosWallet().account()
}

const network = () => {
  return getAptosWallet().network()
}

let isEnableListen = false;
let isUseListen = false;

const listen = (getLoginInfo: GetLoginInfo, setLoginInfo: SetLoginInfo, resetLoginInfo: ResetLoginInfo) => {
  isEnableListen = true;
  if (isUseListen) return;
  isUseListen = true;
  const wallet = getAptosWallet()
  wallet.onAccountChange((newAccount: Account | undefined) => {
    if (!isEnableListen) return;
    const oldInfo = getLoginInfo()
    if (newAccount) {
      if (oldInfo) {
        setLoginInfo(newAccount.address, 'Petra', oldInfo.network)
      } else {
        network().then((newNetwork: Network) => {
          setLoginInfo(newAccount.address, 'Petra', newNetwork)
        })
      }
    } else {
      resetLoginInfo()
    }
  })

  wallet.onNetworkChange(async (newNetwork: {chainId: string, name: Network, url: string}) => {
    if (!isEnableListen) return;
    const isConnectedTemp = await isConnected()
    if (!isConnectedTemp) return resetLoginInfo()
    const oldInfo = getLoginInfo()
    if (oldInfo) {
      setLoginInfo(oldInfo.address, 'Petra', newNetwork.name)
    } else {
      const accountTemp = await account()
      setLoginInfo(accountTemp.address, 'Petra', newNetwork.name)
    }
  })

  wallet.onDisconnect(() => {
    if (!isEnableListen) return;
    resetLoginInfo();
  });
}

const disconnect = () => {
  isEnableListen = false;
  const wallet = getAptosWallet();
  return wallet.disconnect();
}

const signAndSubmitTransaction = (transaction: any) => {
  return getAptosWallet().signAndSubmitTransaction({payload: transaction})
}

export const usePetra = () => ({
  getAptosWallet,
  account,
  connect,
  network,
  isConnected,
  disconnect,
  listen,
  signAndSubmitTransaction
})
