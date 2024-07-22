<template>
  <v-dialog v-model="dialog" width="400">
    <div class="w-full bg-white rounded-xl">
      <div class="flex justify-end px-3 pt-3">
        <v-btn density="compact" elevation="0" @click="dialog = false" icon="mdi-close"></v-btn>
      </div>
      <div class="pb-8 xs:px-4 sm:px-6 md:px-8">
        <div class="mb-3 text-lg font-bold text-red-500">
          {{text}}
        </div>

        <v-btn @click="submit" color="primary" class="mt-3 rounded-lg"  width="100%" elevation="0">
          <span class="text-[15px] normal-case">One more round</span>
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { ref } from 'vue'

let resolve: () => void, reject: (reason?: any) => void

const dialog = ref(false)
const text = ref('')

watch(dialog, (val) => {
  if (!val) setTimeout(() => reject(new Error('Cancelled')))
})

const submit = () => {
  resolve()
  dialog.value = false
}

const show = (_text: string) => {
  text.value = _text;
  dialog.value = true
  return new Promise<void>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  })
}

defineExpose({show})
</script>

<style lang="scss" scoped></style>
