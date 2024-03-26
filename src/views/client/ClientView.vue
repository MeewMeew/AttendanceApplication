<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import BaseCard from '@/components/common/BaseCard.vue'
import LandingHeader from '@/components/header/LandingHeader.vue'
import QrCodeAttendance from '@/components/qrcode/QrCodeAttendance.vue'
import { Client } from '@/database/database'
import { useUUIDStore } from '@/stores/uuid'

const router = useRouter()
const { uuid } = useUUIDStore()

onMounted(() =>
  Client.read(uuid).then((client) => {
    if (client && client.status === 'offline') {
      router.push('/sign-in')
    }
  })
)
</script>

<template>
  <div class="h-screen min-w-[400px]">
    <landing-header simple class="py-3" />
    <div class="flex w-full flex-col items-center justify-center py-16">
      <base-card title="Attendance QR Code" class="w-full max-w-2xl">
        <div class="flex items-center justify-center p-10">
          <qr-code-attendance />
        </div>
      </base-card>
    </div>
  </div>
</template>

<style scoped lang="postcss">
html {
  @apply bg-[#f1f1f1] dark:bg-[#f1f1f1];
}
</style>
