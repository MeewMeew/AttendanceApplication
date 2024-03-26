<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { onMounted, ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const devices = ref<MediaDeviceInfo[]>([])
const selectedDevice = ref<MediaDeviceInfo | null>(null)
const props = defineProps<{
  isOpen: boolean
  title: string
}>()

const emit = defineEmits(['close', 'close-with-data'])

interface Data {
  rawValue: string
}

onMounted(async () => {
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
    ({ kind }) => kind === 'videoinput'
  )

  if (devices.value.length > 0) {
    selectedDevice.value = devices.value[0]
  }
})

function onDetect(value: Data[]) {
  emit('close-with-data', value)
}

function paintOutline(detectedCodes: any, ctx: any) {
  for (const detectedCode of detectedCodes) {
    const cornerPoints = detectedCode.cornerPoints.slice(0, 4)

    ctx.strokeStyle = 'blue'
    ctx.strokeSize = 2

    ctx.beginPath()
    ctx.moveTo(cornerPoints[0].x, cornerPoints[0].y)
    for (let i = 1; i < cornerPoints.length; i++) {
      ctx.lineTo(cornerPoints[i].x, cornerPoints[i].y)
    }
    ctx.lineTo(cornerPoints[0].x, cornerPoints[0].y)
    ctx.closePath()
    ctx.stroke()
  }
}
</script>

<template>
  <TransitionRoot appear :show="props.isOpen" as="template">
    <Dialog as="div" @close="emit('close')" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black"
            >
              <DialogTitle
                as="h3"
                class="text-gray-900 text-lg font-medium leading-6 dark:text-white"
              >
                {{ props.title }}
              </DialogTitle>
              <div class="my-2 flex h-full w-full">
                <qrcode-stream @detect="onDetect" :track="paintOutline" />
              </div>
              <div class="mt-4 flex items-center justify-end">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="emit('close')"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
