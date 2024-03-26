<script setup lang="ts">
import IconComponent from '@/components/icons/IconComponent.vue'
import { useDarkModeStore } from '@/stores/darkMode'

const darkModeStore = useDarkModeStore()
</script>

<template>
  <label
    :class="{
      'bg-stroke': !darkModeStore.darkMode
    }"
    class="relative m-0 block h-6 w-[54px] cursor-pointer rounded-full border border-stroke dark:border-2 dark:border-strokedark"
    @click="darkModeStore.toggleDarkMode"
  >
    <input class="absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0" type="checkbox" />
    <span
      :class="{ 'right-1 translate-x-full': darkModeStore.darkMode }"
      class="absolute left-1 top-1/2 flex h-5 w-5.5 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear"
    >
      <span class="dark:hidden">
        <icon-component color="#969aa1" name="Moon" size="12px" stroke-width="2px" />
      </span>
      <span class="hidden dark:inline-block">
        <icon-component color="#969aa1" name="Sun" size="12px" stroke-width="2.5px" />
      </span>
    </span>
  </label>
</template>

<style scoped></style>
