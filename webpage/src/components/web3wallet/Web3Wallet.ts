import { usePetra } from '@/hooks/usePetra'
import { once } from 'lodash'
import { nextTick, readonly, ref } from 'vue'
import { GetLoginInfo, LoginInfo, Network, WalletName } from './types'
import { InputEntryFunctionData, PendingTransactionResponse } from '@aptos-labs/ts-sdk'
import { useGoogle } from '@/hooks/useGoogle'

export const dialog = ref(false)

const address = ref('')
const isConnect = ref(false)
const connectWallet = ref<WalletName>()
const network = ref<Network>()

const setLoginInfo = (_address: string, wallet: WalletName, _network: Network) => {
  address.value = _address
  connectWallet.value = wallet
  isConnect.value = true
  network.value = _network
  localStorage.setItem(
    'web3_wallet_login_info',
    JSON.stringify({ address: _address, wallet, network: _network, isConnect: true } as LoginInfo)
  )
}

const getLoginInfo: GetLoginInfo = () => {
  const loginInfoJSON = localStorage.getItem('web3_wallet_login_info')
  if (loginInfoJSON) return JSON.parse(loginInfoJSON) as LoginInfo
}

const resetLoginInfo = () => {
  address.value = ''
  connectWallet.value = undefined
  isConnect.value = false
  network.value = undefined
  localStorage.removeItem('web3_wallet_login_info')
}

const initState = once(async () => {
  const loginInfo = getLoginInfo()
  if (!loginInfo) return
  if (!loginInfo.isConnect) return
  address.value = loginInfo.address
  connectWallet.value = loginInfo.wallet
  isConnect.value = loginInfo.isConnect
  network.value = loginInfo.network
  if (loginInfo.wallet === 'Petra') {
    const isConnected = await usePetra().isConnected()
    if (isConnected) return usePetra().listen(getLoginInfo, setLoginInfo, resetLoginInfo)
    resetLoginInfo()
  }
  if (loginInfo.wallet === 'Google') {
    useGoogle().initState(getLoginInfo, setLoginInfo, resetLoginInfo)
  }
})

export const loginPetra = async () => {
  const account = await usePetra().connect()
  const _network = await usePetra().network()
  dialog.value = false
  await new Promise(resolve => setTimeout(resolve, 400))
  setLoginInfo(account.address, 'Petra', _network)
  usePetra().listen(getLoginInfo, setLoginInfo, resetLoginInfo)
}

export const loginGoogle = async () => {
  useGoogle().login();
}

export const logout = async () => {
  dialog.value = false
  await new Promise(resolve => setTimeout(resolve, 400))
  if (connectWallet.value === 'Petra') {
    await usePetra().disconnect()
  }
  if (connectWallet.value === 'Google') {
    useGoogle().logout()
  }
  resetLoginInfo();
}

const preVerification = async (network?: Network) => {
  const oldinfo = getLoginInfo()
  if (!isConnect.value || !address.value || !oldinfo) {
    openDialog()
    throw new Error('')
  }
  const info = getLoginInfo()
  if (!info) throw new Error('Please connect your wallet first')
  if (network && network !== info.network) throw new Error(`Please switch to ${network} network`)
  return info
}

const signAndSubmitTransaction = async (data: InputEntryFunctionData): Promise<PendingTransactionResponse> => {
  if (connectWallet.value === 'Petra') {
    return await usePetra().signAndSubmitTransaction({
      arguments: data.functionArguments,
      function: data.function,
      type_arguments: data.typeArguments
    })
  }
  if (connectWallet.value === 'Google') {
    return await useGoogle().signAndSubmitTransaction(data)
  }
  throw new Error('No wallet support yet')
}

const openDialog = () => {
  dialog.value = true
}


export const useWeb3Wallet = () => {
  initState()
  return {
    address: readonly(address),
    isConnect: readonly(isConnect),
    network: readonly(network),
    logout,
    openDialog,
    preVerification,
    signAndSubmitTransaction,
    setLoginInfo
  }
}
