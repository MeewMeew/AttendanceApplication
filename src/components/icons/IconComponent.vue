<script setup lang="ts">
import { computed, type PropType } from 'vue'

import { getIcon } from '@/libs/utils'
import type { ILucideIcon } from '@/shared/types'

const props = defineProps({
  name: {
    type: String as PropType<ILucideIcon>,
    required: true
  },
  size: String,
  color: String,
  strokeWidth: String
})

const icon = computed(() => getIcon(props.name))
</script>

<template>
  <component :is="icon" :size="size" :color="color" :stroke-width="strokeWidth" />
</template>
