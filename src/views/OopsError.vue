<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="container mx-auto flex flex-col items-center justify-center gap-8 py-16">
    <h1 class="text-3xl font-bold dark:text-white">OOPS!</h1>
    <h3 class="text-lg font-bold dark:text-white">Page not found: {{ route.path }}</h3>
  </main>
</template>
