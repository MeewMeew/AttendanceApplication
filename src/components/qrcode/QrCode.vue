<script setup lang="ts">
import QrCode from 'qrcode-vue3'

const props = defineProps<{
  value: string
  imageSize: number
  darkMode?: boolean
}>()
</script>

<template>
  <qr-code
    :width="400"
    :height="400"
    :value="props.value"
    :key="props.value"
    :background-options="{ color: '#f1f1f1' }"
    :qr-options="{ errorCorrectionLevel: 'H' }"
    :image-options="{ hideBackgroundDots: true, imageSize: props.imageSize, margin: 10 }"
    :corners-square-options="{ type: 'dots', color: '#34495E' }"
    :corners-dot-options="{ type: undefined, color: '#41B883' }"
    :dots-options="{
      type: 'extra-rounded',
      color: '#41B883',
      gradient: {
        type: 'linear',
        rotation: 0,
        colorStops: [
          { offset: 0, color: '#41B883' },
          { offset: 1, color: '#34495E' }
        ]
      }
    }"
    image="images/logo.svg"
    :download="false"
  />
</template>

<style scoped></style>
