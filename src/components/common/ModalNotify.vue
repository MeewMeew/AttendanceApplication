<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

interface IProps {
  isOpen: boolean
  title: string
  message: string
  buttonAcceptText?: string
  buttonCancelText?: string
  isYesNo?: boolean
  onAccept?: () => void
  onCancel?: () => void
}

const props = defineProps<IProps>()
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'accept'): void
  (event: 'cancel'): void
}>()
</script>

<template>
  <transition-root appear :show="props.isOpen" as="template">
    <Dialog as="div" @close="emit('close')" class="relative z-10">
      <transition-child
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </transition-child>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <transition-child
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <dialog-panel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <dialog-title as="h3" class="text-gray-900 text-lg font-medium leading-6">
                {{ props.title }}
              </dialog-title>
              <div class="mt-2">
                <p class="text-gray-500 text-sm">
                  {{ props.message }}
                </p>
              </div>

              <div class="mt-4 flex justify-end">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    v-if="isYesNo"
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-warning hover:bg-amber-900 focus:outline-none"
                    @click="onCancel"
                  >
                    {{ props.buttonCancelText ?? 'Hủy' }}
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-warning bg-opacity-10 px-4 py-2 text-sm font-medium text-warning hover:bg-amber-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="emit('accept')"
                  >
                    {{ props.buttonAcceptText ?? 'Xác nhận' }}
                  </button>
                </div>
              </div>
            </dialog-panel>
          </transition-child>
        </div>
      </div>
    </Dialog>
  </transition-root>
</template>
