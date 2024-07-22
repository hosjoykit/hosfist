import { Aptos, AptosConfig, EphemeralKeyPair, InputEntryFunctionData } from '@aptos-labs/ts-sdk'
import { getLocalEphemeralKeyPair, storeEphemeralKeyPair } from './ephemeral'
import { jwtDecode } from 'jwt-decode'
import { getLocalKeylessAccount, storeKeylessAccount } from './keyless'
import { useNetworkConfig } from '@/config/env.config'
import { useWeb3Wallet } from '@/components/web3wallet/Web3Wallet'
import { GetLoginInfo, Network, networkMap, ResetLoginInfo, SetLoginInfo } from '@/components/web3wallet/types'

const redirectUri = 'http://localhost:3000/google/callback'
const clientId = '723768046425-f2o18feptepvtfduccjelho26dq2revv.apps.googleusercontent.com'
// Get the nonce associated with ephemeralKeyPair

const parseJWTFromURL = (url: string): string | null => {
  const urlObject = new URL(url)
  const fragment = urlObject.hash.substring(1)
  const params = new URLSearchParams(fragment)
  return params.get('id_token')
}

const login = () => {
  const ephemeralKeyPair = EphemeralKeyPair.generate()
  const nonce = ephemeralKeyPair.nonce

  storeEphemeralKeyPair(ephemeralKeyPair)
  const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&scope=openid+email+profile&nonce=${nonce}&redirect_uri=${redirectUri}&client_id=${clientId}`
  window.open(loginUrl, '_blank')
}

const initState = (getLoginInfo: GetLoginInfo, setLoginInfo: SetLoginInfo, resetLoginInfo: ResetLoginInfo) => {
  const oldInfo = getLoginInfo();
  const account = getLocalKeylessAccount()
  if (account) {
    if (!oldInfo) return setLoginInfo(account.accountAddress.toString(), 'Google', networkMap(useNetworkConfig));
    if (oldInfo.address !== account.accountAddress.toString()) return setLoginInfo(account.accountAddress.toString(), 'Google', networkMap(useNetworkConfig));
  } else {
    if (oldInfo) resetLoginInfo();
  }
}

const callback = async (setLoginInfo: SetLoginInfo,) => {
  const token = parseJWTFromURL(location.href)
  if (!token) throw new Error('login fall')

  const payload = jwtDecode<{ nonce: string }>(token)
  const jwtNonce = payload.nonce

  const ekp = getLocalEphemeralKeyPair()

  // Validate the EphemeralKeyPair
  if (!ekp || ekp.nonce !== jwtNonce || ekp.isExpired()) {
    throw new Error('Ephemeral key pair not found or expired')
  }
  const aptos = new Aptos(new AptosConfig({ network: useNetworkConfig })) // Configure your network here
  const keylessAccount = await aptos.deriveKeylessAccount({
    jwt: token,
    ephemeralKeyPair: ekp
  })

  storeKeylessAccount(keylessAccount)
  setLoginInfo(keylessAccount.accountAddress.toString(), 'Google', networkMap(useNetworkConfig))
}

const logout = () => {
  localStorage.removeItem('@aptos/account')
}

const signAndSubmitTransaction = async (data: InputEntryFunctionData) => {
  const aptos = new Aptos(new AptosConfig({ network: useNetworkConfig }))
  const account = getLocalKeylessAccount()
  if (!account) {
    throw new Error('please login in first')
  }
  const txSimple = await aptos.transaction.build.simple({
    sender: account.accountAddress,
    data,
  })

  const committedTxn = await aptos.signAndSubmitTransaction({ signer: account, transaction: txSimple });
  return committedTxn;
}

export const useGoogle = () => {
  return {
    login,
    callback,
    initState,
    signAndSubmitTransaction,
    logout,
  }
}
