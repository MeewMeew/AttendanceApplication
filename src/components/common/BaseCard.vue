<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div
    class="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
      <h3 class="font-medium text-black dark:text-white">{{ props.title }}</h3>
    </div>
    <slot />
  </div>
</template>
