<script setup lang="ts">
import * as icons from 'lucide-vue-next'

import IconComponent from '@/components/icons/IconComponent.vue'
const props = defineProps<{
  item: {
    label: string
    route: string
    icon: string
  }
}>()
</script>

<template>
  <li>
    <router-link
      :to="props.item.route"
      class="flex items-center gap-3.5 font-nunito text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
    >
      <icon-component :name="props.item.icon as keyof typeof icons" stroke-width="2px" />
      {{ props.item.label }}
    </router-link>
  </li>
</template>

<style scoped></style>
