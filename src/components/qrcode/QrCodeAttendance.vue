<script setup lang="ts">
import { doc, onSnapshot } from 'firebase/firestore'
import { onMounted, ref } from 'vue'

import AnimateLoader from '@/components/common/AnimateLoader.vue'
import QrCode from '@/components/qrcode/QrCode.vue'
import { type IClient } from '@/database/database'
import { generateAttendanceToken } from '@/libs/utils'
import { db } from '@/shared/firebase'
import { useUUIDStore } from '@/stores/uuid'

const { uuid } = useUUIDStore()
const token = ref<string>('')

onMounted(() => {
  generateAttendanceToken(uuid)
    .then((_token) => (token.value = _token))
    .then(() => {
      onSnapshot(doc(db, 'clients', uuid), (snapshot) => {
        const client = snapshot.data() as IClient
        if (!client.token || client.token != token.value) {
          generateAttendanceToken(client.id).then((_token) => (token.value = _token))
        }
      })
    })
})
</script>

<template>
  <div class="mx-auto flex h-auto w-auto">
    <animate-loader v-if="!token" class="py-10" />
    <qr-code :image-size="0.4" :value="token" v-else />
  </div>
</template>

<style scoped></style>
