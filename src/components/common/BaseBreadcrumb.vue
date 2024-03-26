<script setup lang="ts">
const props = defineProps<{
  from: string
  fromRoute: string
  current: string
}>()
</script>

<template>
  <div class="mb-6 flex w-full flex-col justify-start gap-3 sm:flex-row sm:items-center">
    <nav>
      <ol class="flex items-center gap-2">
        <li>
          <router-link class="font-medium dark:text-white" :to="props.fromRoute">
            {{ props.from }} /
          </router-link>
        </li>
        <li class="cursor-pointer font-medium text-primary">{{ props.current }}</li>
      </ol>
    </nav>
  </div>
</template>
