<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import type { ILucideIcon } from '@/shared/types'

const emit = defineEmits<{
  (event: 'sort', data: string): void
}>()

const props = defineProps<{
  sortKey: string
  objectKey: string
  iconName: ILucideIcon
  columnName: string
  width?: string
}>()
</script>

<template>
  <th
    class="sticky top-0 bg-gray-2 px-4 py-4 font-medium text-black hover:cursor-pointer dark:bg-meta-4 dark:text-white"
    :class="{
      'min-w-[100px] max-w-[130px]': props.width === 'tiny',
      'min-w-[130px] max-w-[150px]': props.width === 'small',
      'min-w-[150px] max-w-[200px]': props.width === 'medium',
      'min-w-[200px] max-w-[250px]': props.width === 'large',
      'min-w-[250px] max-w-[300px]': props.width === 'huge'
    }"
    @click="emit('sort', props.objectKey)"
  >
    <div class="flex flex-1 items-center justify-center space-x-2">
      <span>{{ props.columnName }}</span>
      <icon-component
        v-if="props.sortKey === props.objectKey"
        :name="props.iconName"
        size="18px"
        stroke-width="1.5px"
      />
    </div>
  </th>
</template>

<style scoped></style>
