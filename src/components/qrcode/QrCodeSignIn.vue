<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AnimateLoader from '@/components/common/AnimateLoader.vue'
import QrCode from '@/components/qrcode/QrCode.vue'
import { generateSignInToken } from '@/libs/utils'
import { useUUIDStore } from '@/stores/uuid'

const { uuid } = useUUIDStore()
const signInToken = ref<string>('')

onMounted(() => generateSignInToken(uuid).then((token) => (signInToken.value = token)))

const isTokenNull = computed(() => signInToken.value === '')
</script>

<template>
  <div class="mx-auto my-auto flex h-full w-full items-center justify-center">
    <animate-loader v-if="isTokenNull" class="py-10" />
    <qr-code :image-size="0.4" :value="signInToken" v-else />
  </div>
</template>

<style scoped></style>
