<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import IconComponent from '@/components/icons/IconComponent.vue'
import { capitalizeFirstLetter } from '@/libs/utils'
import { useSidebarStore } from '@/stores/sidebar'

import DropdownNotification from './DropdownNotification.vue'
import DropdownUser from './DropdownUser.vue'

const route = useRoute()
const currentPage = computed(() => capitalizeFirstLetter(route.name?.toString()!))

const { toggleSidebar } = useSidebarStore()
</script>

<template>
  <header
    class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
  >
    <div
      class="flex flex-grow items-center justify-between space-x-2 px-4 py-4 shadow-2 md:px-6 2xl:px-11"
    >
      <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
        <button
          class="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          @click="toggleSidebar"
          aria-label="open-sidebar"
        >
          <icon-component name="Menu" size="24px" class="dark:text-white" stroke-width="2" />
        </button>
      </div>
      <div class="flex flex-grow">
        <h1 class="text-xl font-semibold dark:font-medium dark:text-white">
          {{ currentPage }}
        </h1>
      </div>

      <div class="flex items-center gap-3 2xsm:gap-7">
        <ul class="flex items-center gap-2 2xsm:gap-4">
          <dropdown-notification />
        </ul>
        <dropdown-user />
      </div>
    </div>
  </header>
</template>
