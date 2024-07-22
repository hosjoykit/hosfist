<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NDataTable
      :size="xs ? 'small' : 'medium'"
      :scroll-x="xs ? 280 : 900"
      :columns="columns"
      :data="data"
      :pagination="false"
      :bordered="false"
      :loading="loading"
    ></NDataTable>
  </NConfigProvider>
</template>

<script setup lang="tsx">
import MoraType from '@/components/MoraType.vue'
import { GameResult } from '@/types/baseType'
import { myGameResult } from '@/utils/mora_util'
import { addressFormat } from '@/utils/web3'
import dayjs from 'dayjs'
import { NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { onUnmounted } from 'vue'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { NConfigProvider } from 'naive-ui'
import { themeOverrides } from '@/plugins/navui'
import { computed } from 'vue'
import { BetLogData, rmNumBetTypeMap, useHosfist } from '@/hooks/contracts/hosfist'


const loading = ref(false)

const { xs } = useDisplay()


const { getGameLogs } = useHosfist()

const columns = computed<DataTableColumns<BetLogData>>(() => [
  {
    title: 'Player',
    key: 'account',
    align: 'center',
    render: rowData => <span>{addressFormat(rowData.account, 15)}</span>,
    width: 120,
  },
  {
    title: 'Play Time',
    key: 'microseconds',
    align: 'center',
    render: rowData => (
      <span>{dayjs(+(BigInt(rowData.microseconds) / 1000n).toString()).format('YYYY-MM-DD HH:mm:ss')}</span>
    ),
    width: 160,
  },
  {
    title: 'Player Bet',
    key: 'bet_type',
    align: 'center',
    render: rowData => (
      <div class=" center">
        <div class="relative center">
          <MoraType type={rowData.bet_type} size={30}></MoraType>
        </div>
      </div>
    ),
    width: 100,

  },
  {
    title: 'Rival Bet',
    key: 'rm_num',
    align: 'center',
    render: rowData => (
      <div class=" center">
        <div class="relative center">
          <MoraType type={rmNumBetTypeMap(+rowData.rm_num)} size={30}></MoraType>
        </div>
      </div>
    ),
    width: 100,

  },
  {
    title: 'Result',
    key: 'result',
    align: 'center',
    render: rowData => {
      const res = myGameResult(rowData.bet_type, rmNumBetTypeMap(+rowData.rm_num))
      return (
        <span class={{ 'text-[#02BA50]': res === GameResult.Win, 'text-[#FF3955]': res === GameResult.Lose }}>
          {(() => {
            if (res === GameResult.Draw) return 'Draw'
            if (res === GameResult.Win) return 'Win'
            return 'Lose'
          })()}
        </span>
      )
    },
    width: 100,

  }
])

const data = ref<BetLogData[]>([])

const refreshLogs = async () => {
  const res = await getGameLogs(1, 20)
  data.value = res
}
const isTimingRefreshLogs = ref(false)
const timingRefreshLogs = async () => {
  if (isTimingRefreshLogs.value) return
  isTimingRefreshLogs.value = true
  loading.value = true
  while (isTimingRefreshLogs.value) {
    try {
      await refreshLogs()
      loading.value = false
    } catch (error) {
      /* empty */
    }
    await new Promise<void>(resolve => setTimeout(resolve, 8000))
  }
}

timingRefreshLogs()
onUnmounted(() => {
  isTimingRefreshLogs.value = false
})
</script>

<style lang="scss" scoped></style>
