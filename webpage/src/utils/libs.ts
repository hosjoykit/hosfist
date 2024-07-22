import BigNumber from "bignumber.js"

// 将抽点修改成百分比的数
export const ratioAsPercentage = (ratio: number) => {
  return BigNumber(ratio).times(100).toNumber()
}


// 将抽点Bigint修改成百分比的数
export const ratioBigintAsPercentage = (ratio: bigint) => {
  return BigNumber(ratio.toString()).div(10000).toNumber()
}


// 将抽点Bigint修改抽点number数
export const ratioBigintAsNumber = (ratio: bigint) => {
  return BigNumber(ratio.toString()).div(1000000).toNumber()
}


// 将抽点百分比的数转换为Bigint的数 1% => 10000
export const ratioPercentageAsBigint = (ratio: string) => {
  const ratioTemp = ratio.replace('%', '')
  return BigInt(BigNumber(ratioTemp).times(10000).toString())
}

// 生成邀请人uid
export const randomReferrerUID = (size: number) => {
  const strLib = `abcdefghijklmnopqrstuvwxyz1234567890`
  return Array.from({length: size}, () => strLib[Math.floor((Math.random() * strLib.length))]).join('')
}
