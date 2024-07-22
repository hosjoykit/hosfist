import BigNumber from 'bignumber.js'

export const addressFormat = (address: string, addressStrNum: number = 15) => {
  if (address === 'All') return address
  if (address.length < 15) return address
  addressStrNum = addressStrNum > 15 ? addressStrNum : 15
  if (addressStrNum >= address.length) return address
  const starAndEndNum = Math.floor(BigNumber(addressStrNum).minus(3).div(2).toNumber())
  return `${address.slice(0, starAndEndNum)}...${address.slice(address.length - starAndEndNum)}`
}


export const getUUID = () => {
  const time = new Date().getTime()
  const mantissa = Array.from({ length: 16 - `${time}`.length }, () => Math.floor(Math.random() * 10)).join('')
  return BigInt(`${time}${mantissa}`)
}
