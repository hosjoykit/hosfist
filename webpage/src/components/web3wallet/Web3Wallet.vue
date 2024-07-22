<template>
  <v-dialog v-model="dialog" width="auto">
    <v-card max-width="400" width="90vw">
      <section v-if="isConnect">
        <div class="flex items-center justify-end py-2 pr-2">
          <div
            class="text-black duration-150 cursor-pointer opacity-40 hover:opacity-75 center"
            @click="dialog = false"
          >
            <v-icon size="26" icon="mdi-close-circle-outline" />
          </div>
        </div>
        <div class="flex items-center justify-between px-4 py-2">
          <div class="font-bold">Address</div>
          <div class="flex items-center">
            <div class="mr-1 text-gray-500">{{ addressFormat(address) }}</div>
            <div
              @click="copyHandler(address)"
              class="text-gray-500 center pt-[2px] cursor-pointer hover:text-gray-700 duration-150"
            >
              <v-icon size="14" icon="mdi-content-copy" />
            </div>
          </div>
        </div>
        <div class="w-full bg-gray-300 opacity-60 h-[1px]"></div>
        <div class="flex items-center justify-between px-4 py-2">
          <div class="font-bold">Network</div>
          <div class="text-gray-500">{{ network }}</div>
        </div>
        <div class="w-full bg-gray-300 opacity-60 h-[1px]"></div>
        <div
          @click="logout"
          class="flex items-center justify-center px-4 py-3 duration-300 cursor-pointer hover:bg-gray-100"
        >
          <div class="mr-1 center mt-0.5"><v-icon size="20" icon="mdi-location-exit" /></div>
          <div class="text-base">Disconnect</div>
        </div>
      </section>
      <section v-else>
        <template v-for="(item, index) in wallets" :key="index">
          <div
            @click="item.click"
            class="flex items-center justify-between px-4 py-3 duration-300 cursor-pointer hover:bg-gray-100"
          >
            <div class="text-[18px] font-bold mr-1">{{ item.name }}</div>

            <div class="overflow-hidden rounded-md center">
              <img :src="item.icon" class="w-[22px]" alt="petra" />
            </div>
          </div>
          <div v-if="index + 1 != wallets.length" class="w-full bg-gray-300 opacity-60 h-[1px]"></div>
        </template>
      </section>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { addressFormat } from '@/utils/web3'
import { dialog, loginGoogle, loginPetra, useWeb3Wallet } from './Web3Wallet'
import petraPng from '@/assets/images/web3wallet/petra.png'
import googlePng from '@/assets/images/web3wallet/google.png'
import copy from 'copy-to-clipboard'
import { notyf } from '@/utils/notyf'
const { isConnect, address, network, logout } = useWeb3Wallet()
const wallets = [
  {
    name: 'Petra',
    icon: petraPng,
    click: loginPetra
  },
  {
    name: 'Google',
    icon: googlePng,
    click: loginGoogle
  }
]

const copyHandler = (text: string) => {
  copy(text)
  notyf.success('Copied successfully')
}
</script>

<style lang="scss" scoped></style>
