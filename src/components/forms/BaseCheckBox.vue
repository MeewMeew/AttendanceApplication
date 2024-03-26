<script setup lang="ts">
import { ref } from 'vue'

import IconComponent from '@/components/icons/IconComponent.vue'

const checkboxToggle = ref<boolean>(false)
const props = defineProps<{
  title: string
}>()
const emit = defineEmits<{
  (event: 'change', value: boolean): void
}>()

function toggleCheckbox() {
  checkboxToggle.value = !checkboxToggle.value
  emit('change', checkboxToggle.value)
}
</script>

<template>
  <div>
    <label for="checkboxLabelThree" class="flex cursor-pointer select-none items-center">
      <div class="relative">
        <input type="checkbox" id="checkboxLabelThree" class="sr-only" @change="toggleCheckbox" />
        <div
          :class="checkboxToggle && 'border-primary bg-gray dark:bg-transparent'"
          class="box mr-4 flex h-5 w-5 items-center justify-center rounded border border-primary"
        >
          <span :class="checkboxToggle && '!opacity-100'" class="text-primary opacity-0">
            <icon-component name="Check" size="16" stroke-width="2" />
          </span>
        </div>
      </div>
      <span class="text-sm text-black dark:text-white">{{ props.title }}</span>
    </label>
  </div>
</template>
