<template>
  <div class="w-full px-4 pt-4 pb-4 bg-white pt-md-10 px-md-6 rounded-xl">

    <template v-if="status === Status.NoMara">
      <div class="flex items-center justify-center space-x-2 md:space-x-6">
        <div
          class="flex-1 w-10 max-w-[200px] mora-item-box rounded-full"
          v-for="item in betTypeOptions"
          :key="item.value"
          :style="{
            border: item.value === moraType ? '5px solid #0098ea' : '5px solid #0098ea00'
          }"
          @click="moraItemHandler(item.value)"
        >
          <v-responsive :aspect-ratio="1" class="w-full">
            <div
              class="relative w-full h-full rounded-full cursor-pointer center"
              :style="{ background: item.bg }"
              style="border: 2px solid #fff"
            >
              <img :src="item.img" alt="moraType" class="w-[60%] h-auto mx-auto" />
            </div>
          </v-responsive>
        </div>
      </div>

      <div class="flex justify-center mt-6 mt-lg-10">
        <v-btn
          @click="moraSendHandler"
          :loading="loading"
          color="primary"
          variant="elevated"
          elevation="0"
          size="large"
          class="rounded-lg"
          style="width: 100%"
        >
          <div class="normal-case">Play HosFist</div>
        </v-btn>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-around mb-2">
        <div class="flex-1 w-10 max-w-[160px] md:max-w-[200px] rounded-full" style="border: 5px solid #0098ea">
          <v-responsive :aspect-ratio="1" class="w-full">
            <div v-if="!getLeftOption" class="w-full h-full center text-[38px] text-gray-600">?</div>
            <div
              v-else
              class="relative w-full h-full rounded-full cursor-pointer center"
              :style="{
                background: getLeftOption.bg
              }"
              style="border: 2px solid #fff"
            >
              <img :src="getLeftOption.img" alt="moraType" class="w-[60%] h-auto mx-auto" />
            </div>
          </v-responsive>
        </div>
        <div class="text-[#eccd66] mx-6 md:mx-8 text-[34px] md:text-[40px] font-semibold">VS</div>
        <div class="flex-1 w-10 max-w-[160px] md:max-w-[200px] rounded-full" style="border: 5px solid #0098ea">
          <v-responsive :aspect-ratio="1" class="w-full">
            <div v-if="!getRightOption" class="w-full h-full center text-[38px] text-gray-600">?</div>
            <div
              v-else
              class="relative w-full h-full rounded-full cursor-pointer center"
              :style="{
                background: getRightOption.bg
              }"
              style="border: 2px solid #fff"
            >
              <img :src="getRightOption.img" alt="moraType" class="w-[60%] h-auto mx-auto" />
            </div>
          </v-responsive>
        </div>
      </div>
      <div
        v-if="status === Status.Win"
        class="text-xl font-bold text-center text-[#02BA50] flex items-center justify-center"
      >
        <div>😀</div>
        <div>You Win</div>
      </div>
      <div
        v-else-if="status === Status.Lose"
        class="text-xl font-bold text-center text-[#FF3955] flex items-center justify-center"
      >
        <div>😭</div>
        <div>You Lose</div>
      </div>
      <div v-else class="flex items-center justify-center text-xl font-bold text-center text-gray-600">
        <div>Draw</div>
      </div>

      <div  class="flex justify-center mt-4">
        <v-btn
          color="primary"
          variant="elevated"
          elevation="0"
          class="rounded-lg"
          @click="clearStatusInfo"
          style="width: 100%; max-width: 300px"
        >
          <div class="normal-case">One more round</div>
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { notyf } from '@/utils/notyf'
import { computed } from 'vue'
import { BetType } from '@/types/baseType'
import { betTypeOptions } from '@/options/bet_types'
import { BetLogData, useHosfist } from '@/hooks/contracts/hosfist'

const { betHandler } = useHosfist()

// 当前动作状态
enum Status {
  NoMara, // 等待出拳
  WaitingRival, // 已出拳，等待对手出拳
  Win, //  胜利 赢
  Lose, // 失败 输
  Draw // 平局
}

const rmNumBetTypeMap = (rmNum: number) => {
  if (rmNum < 12) return BetType.Scissors
  if (rmNum < 24) return BetType.Rock
  return BetType.Cloth
}

const betInfo = ref<BetLogData>()


const loading = ref(false)

const moraType = ref<BetType>(betTypeOptions[0].value)

const status = computed(() => {
  const info = betInfo.value
  if (!info) return Status.NoMara;
  const p1Bet = info.bet_type
  const p2Bet = rmNumBetTypeMap(+info.rm_num)
  if (p1Bet === p2Bet) {
    return Status.Draw
  }
  let p1Res = Status.Lose
  if (
    (p1Bet == BetType.Rock && p2Bet == BetType.Scissors) ||
    (p1Bet == BetType.Scissors && p2Bet == BetType.Cloth) ||
    (p1Bet == BetType.Cloth && p2Bet == BetType.Rock)
  ) {
    p1Res = Status.Win
  }
  return p1Res;
})


const getLeftOption = computed(() => {
  const info = betInfo.value
  if (!info) return;
  return betTypeOptions.find(item => item.value === info.bet_type)
})

const getRightOption = computed(() => {
  const info = betInfo.value
  if (!info) return;
  const betType = rmNumBetTypeMap(+info.rm_num)
  return betTypeOptions.find(item => item.value === betType)
})


const moraItemHandler = (value: BetType) => {
  moraType.value = value
}

const moraSendHandler = async () => {
  loading.value = true
  try {
    const data = await betHandler(moraType.value);
    betInfo.value = data;
  } catch (error) {
    if ((error as Error).message) {
      notyf.error((error as Error).message)
    }
  }
  loading.value = false
}


const clearStatusInfo = () => {
  betInfo.value = undefined
}


// watchEffect(() => {
//   if (address.value && isConnectWalletNetwork.value) {
//     initState()
//   }
// })





</script>

<style lang="scss" scoped>
.mora-item-box {
  transition-duration: 150ms;
  &:hover {
    transform: scale(1.1);
  }
}
</style>
