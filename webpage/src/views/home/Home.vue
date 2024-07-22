<template>
  <div class="">
    <!-- <ReferrerBox /> -->
    <MoraAction />
    <MoraLogs />
    <div class="h-[40px]"></div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import MoraAction from './components/MoraAction.vue'
import MoraLogs from './components/MoraLogs.vue'
const router = useRouter();
const route = useRoute();
</script>
