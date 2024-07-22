<template>
  <div class="flex items-center flex-nowrap">
    <div class="mr-1.5 text-base font-bold center" :style="{paddingTop: paddingTopMap[size]}">
      <img :src="levelPngs[level]" alt="levelPng" :style="{width: imageWidthMap[size]}" />
    </div>
    <div
      class="font-bold leading-none tracking-wider "
      :style="{color: levelTextColor[level], fontSize: textSizeMap[size]}"
      style="text-shadow: 0.6px 1px 1px #757a7899; line-height: 1"
    >
      LV.{{ level + 1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { FeeLevel } from '@/types/baseType';
import Level1Png from '@/assets/images/level/0.png'
import Level2Png from '@/assets/images/level/1.png'
import Level3Png from '@/assets/images/level/2.png'
import Level4Png from '@/assets/images/level/3.png'
import Level5Png from '@/assets/images/level/4.png'
import Level6Png from '@/assets/images/level/5.png'

const levelPngs = [Level1Png, Level2Png, Level3Png, Level4Png, Level5Png,Level6Png]

const levelTextColor = ['#707070', '#00ADEC','#0A74FE', '#FD7E00', '#F40E08', '#9E0CF4']

const imageWidthMap = {
  1: '20px',
  2: '26px'
}
const textSizeMap = {
  1: '17px',
  2: '20px'
}

const paddingTopMap = {
  1: '3px',
  2: '4px'
}

withDefaults(defineProps<{
  level: FeeLevel,
  size?: 1 | 2
}>(), {
  size: 1
})

</script>

<style lang="scss" scoped></style>
