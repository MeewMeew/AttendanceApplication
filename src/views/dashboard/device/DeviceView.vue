<script setup lang="ts">
import { ref } from 'vue'

import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import DeviceTable from '@/views/dashboard/device/DeviceTable.vue'

const isLoading = ref<boolean>(false)

function onTableLoading(loading: boolean) {
  isLoading.value = loading
}
</script>

<template>
  <div>
    <base-breadcrumb current="Device list" from="Dashboard" from-route="/dashboard" />
    <div class="app-scrollbar flex w-full flex-col items-center">
      <device-table @loading="onTableLoading" />
    </div>
  </div>
</template>

<style scoped></style>
