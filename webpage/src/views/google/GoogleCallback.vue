<template>
  <div class="center text-[22px] min-h-[500px]">
    <template v-if="loading">
      <div class="center">
        <v-progress-circular :size="60" :width="8" color="primary" indeterminate></v-progress-circular>
      </div>
      <div class="mt-4 center">logging in .....</div>
    </template>
    <template v-else>
      <div class="text-center text-red-500 text-[40px]">😭</div>
      <div class="mt-4 text-center text-red-500 text-[24px] font-bold">{{ errorText }}</div>
      <v-btn class="mt-6" color="primary" elevation="0" variant="elevated" @click="router.replace('/')">Go Home</v-btn>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useWeb3Wallet } from '@/components/web3wallet/Web3Wallet'
import { useGoogle } from '@/hooks/useGoogle'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(true)
const errorText = ref('')

useGoogle()
  .callback(useWeb3Wallet().setLoginInfo)
  .then(() => {
    router.replace('/')
  })
  .catch(err => {
    loading.value = false
    errorText.value = (err as Error).message
    console.log(err)
  })
</script>

<style lang="scss" scoped></style>
