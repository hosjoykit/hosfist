import { Network as NetworkAptos } from '@aptos-labs/ts-sdk'

export type WalletName = 'Petra' | 'Google'

export enum Network {
  Testnet = 'Testnet',
  Mainnet = 'Mainnet',
  Devnet = 'Devnet',
  Custom = 'Custom',
  Local = 'Local',
}

export const networkMap = (useNetwork: NetworkAptos) => ({
  [NetworkAptos.TESTNET]: Network.Testnet,
  [NetworkAptos.MAINNET]: Network.Mainnet,
  [NetworkAptos.DEVNET]: Network.Devnet,
  [NetworkAptos.CUSTOM]: Network.Custom,
  [NetworkAptos.LOCAL]: Network.Local,
}[useNetwork])


export type LoginInfo = {
  address: string
  wallet: WalletName
  network: Network
  isConnect: boolean
}

export type GetLoginInfo = () => LoginInfo | undefined
export type SetLoginInfo =  (_address: string, wallet: WalletName, _network: Network) => void
export type ResetLoginInfo = () => void
