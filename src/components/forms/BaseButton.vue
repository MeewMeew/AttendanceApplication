<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import type { ILucideIcon } from '@/shared/types'

const props = defineProps<{
  type: 'button' | 'submit' | 'reset'
  color: 'default' | 'alternative' | 'dark' | 'light' | 'green' | 'red' | 'yellow' | 'purple'
  text?: string
  icon?: ILucideIcon
  disabled?: boolean
  iconClass?: string | string[]
  defaultClass?: string | string[]
  ariaLabel?: string
}>()
</script>

<template>
  <button
    :disabled="props.disabled"
    :type="props.type"
    :class="[
      'rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4',
      {
        'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800':
          props.color === 'default',
        'text-gray-900 border-gray-200 hover:bg-gray-100 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white':
          props.color === 'alternative',
        'bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700':
          props.color === 'dark',
        'text-gray-900 border-gray-300 hover:bg-gray-100 focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700':
          props.color === 'light',
        'bg-green-700 text-white hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800':
          props.color === 'green',
        'bg-red-700 text-white hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900':
          props.color === 'red',
        'bg-yellow-400 text-white hover:bg-yellow-500 focus:ring-yellow-300 dark:focus:ring-yellow-900':
          props.color === 'yellow',
        'bg-purple-700 text-white hover:bg-purple-800 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900':
          props.color === 'purple'
      },
      props.disabled && 'cursor-not-allowed opacity-50'
    ]"
    :aria-label="props.ariaLabel || props.text"
  >
    {{ props.text }}
    <icon-component
      v-if="props.icon"
      :name="props.icon"
      stroke-width="2px"
      :class="props.iconClass"
    />
    <slot />
  </button>
</template>

<style scoped></style>
