<script setup lang="ts">
import { ref } from 'vue'

import IconComponent from '@/components/icons/IconComponent.vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()

const props = defineProps(['items', 'page'])
const items = ref(props.items)

const handleItemClick = (index: number) => {
  sidebarStore.selected =
    sidebarStore.selected === props.items[index].label ? '' : props.items[index].label
}
</script>

<template>
  <ul class="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
    <template v-for="(childItem, index) in items" :key="index">
      <li class="inline-flex">
        <icon-component v-if="childItem.icon" :name="childItem.icon" class="text-white" />
        <router-link
          :to="childItem.route"
          @click="handleItemClick(index)"
          class="group relative flex items-center gap-2.5 rounded-md px-2 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
          :class="{ '!text-white': childItem.label === sidebarStore.selected }"
        >
          {{ childItem.label }}
        </router-link>
      </li>
    </template>
  </ul>
</template>
