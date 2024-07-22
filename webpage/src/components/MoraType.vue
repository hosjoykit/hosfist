<template>
  <div
    class="relative rounded-full cursor-pointer center"
    :style="{ background: betTypeMap[type].bg, width: side, height: side }"
  >
    <img :src="betTypeMap[type].img" alt="betType" class="w-[60%] h-auto mx-auto" />
  </div>
</template>

<script setup lang="ts">
import { BetType } from '@/types/baseType'
import { betTypeMap } from '@/options/bet_types'
import { computed } from 'vue';

const props = defineProps<{
  type: BetType,
  size: string | number
}>()
const side = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})
</script>

<style lang="scss" scoped></style>
