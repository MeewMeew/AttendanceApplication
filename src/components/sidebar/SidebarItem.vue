<script setup lang="ts">
import { useRoute } from 'vue-router'

import IconComponent from '@/components/icons/IconComponent.vue'
import { useSidebarStore } from '@/stores/sidebar'

import SidebarDropdown from './SidebarDropdown.vue'

const sidebarStore = useSidebarStore()

const props = defineProps(['item', 'index'])
const currentPage = useRoute().name

interface SidebarItem {
  label: string
}

const handleItemClick = () => {
  sidebarStore.page = sidebarStore.page === props.item.label ? '' : props.item.label
  sidebarStore.selected = props.item.label
  if (props.item.children) {
    return props.item.children.some((child: SidebarItem) => sidebarStore.selected === child.label)
  }
}
</script>

<template>
  <li>
    <component
      :is="props.item.route ? 'router-link' : 'div'"
      :to="props.item.route"
      class="group relative flex cursor-pointer items-center justify-between gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
      @click.prevent="handleItemClick"
      :class="{
        'bg-graydark dark:bg-meta-4': sidebarStore.page === props.item.label
      }"
    >
      <div class="flex flex-1 space-x-2">
        <icon-component :name="item.icon" />
        <span
          class="text-bodydark2 duration-300 ease-in-out hover:text-white"
          :class="{ '!text-white': item.label === sidebarStore.selected }"
          >{{ item.label }}</span
        >
      </div>
      <icon-component
        v-if="item.children"
        name="ChevronDown"
        class="duration-300 ease-in-out"
        :class="{ '-rotate-180': sidebarStore.page === item.label }"
      />
    </component>

    <div class="translate transform overflow-hidden" v-show="sidebarStore.page === item.label">
      <SidebarDropdown
        v-if="item.children"
        :items="item.children"
        :currentPage="currentPage"
        :page="item.label"
      />
    </div>
  </li>
</template>
