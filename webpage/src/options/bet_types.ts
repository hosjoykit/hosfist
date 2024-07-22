import scissorsPng from '@/assets/images/scissors.png'
import rockPng from '@/assets/images/rock.png'
import clothPng from '@/assets/images/cloth.png'
import { BetType } from '@/types/baseType'

type Option = {
  value: BetType
  bg: string
  img: string
}

export const betTypeOptions: Option[] = [
  {
    value: BetType.Scissors,
    bg: '#86BEBB',
    img: scissorsPng
  },
  {
    value: BetType.Rock,
    bg: '#E0808B',
    img: rockPng
  },
  {
    value: BetType.Cloth,
    bg: '#84BC7F',
    img: clothPng
  }
]

export const betTypeMap: Record<BetType, Option> = betTypeOptions.reduce((a, b) => ({ ...a, [b.value]: b }), {}) as any
