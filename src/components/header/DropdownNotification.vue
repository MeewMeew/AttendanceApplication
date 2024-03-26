<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'

import IconComponent from '@/components/icons/IconComponent.vue'

type NotificationItem = {
  title: string
  details: string
  time: string
  route?: string
}

const notificationItems = ref<NotificationItem[]>([])
const notificationEmpty = computed(() => notificationItems.value.length == 0)
const notifying = ref(!notificationEmpty.value)
const target = ref(null)
const dropdownOpen = ref(false)

onClickOutside(target, () => (dropdownOpen.value = false))
</script>

<template>
  <li class="relative" ref="target">
    <button
      aria-label="Notification"
      class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      @click.prevent="(dropdownOpen = !dropdownOpen), (notifying = false)"
    >
      <span
        :class="!notifying && 'hidden'"
        class="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1"
      >
        <span
          class="absolute right-0 -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"
        ></span>
      </span>
      <icon-component name="BellRing" size="20px" class="duration-300 ease-in-out" />
    </button>

    <div
      v-show="dropdownOpen"
      class="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80"
    >
      <div class="px-4.5 py-3">
        <h5 class="text-sm font-medium text-bodydark2">Notification</h5>
      </div>

      <ul class="flex h-auto flex-col overflow-y-auto">
        <template v-for="(item, index) in notificationItems" :key="index">
          <li>
            <component
              :is="item.route ? 'router-link' : 'button'"
              class="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              :to="item.route"
            >
              <p class="text-sm">
                <span class="text-black dark:text-white">{{ item.title }}</span>
                {{ item.details }}
              </p>

              <p class="text-xs">{{ item.time }}</p>
            </component>
          </li>
        </template>
        <li v-show="notificationEmpty">
          <p class="text-center text-sm font-normal text-bodydark2">No new notifications</p>
        </li>
      </ul>
    </div>
  </li>
</template>
