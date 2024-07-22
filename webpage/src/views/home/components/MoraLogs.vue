<template>
  <div class="mt-6 overflow-hidden bg-white rounded-xl">
    <div class="flex items-center justify-between px-4" :style="{ borderBottom: '1px solid #cccccc43' }">
      <div className="flex flex-1 w-10 items-center">
        <div className="center mr-1">
          <img src="@/assets/images/green_dot.svg" alt="green_dot" class="w-[18px] h-[18px]" />
        </div>
      </div>
      <v-tabs v-model="tab" color="#0098EA" class="text-[#758293]" align-tabs="end">
        <v-tab :value="1"><span class="normal-case">All Mora</span></v-tab>
      </v-tabs>
    </div>
    <v-window disabled v-model="tab" :touch="{end: () => {}}">
      <v-window-item :value="1">
        <DataLogAllMora />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataLogAllMora from './DataLogAllMora.vue'

const tab = ref(1)
</script>

<style lang="scss" scoped></style>
