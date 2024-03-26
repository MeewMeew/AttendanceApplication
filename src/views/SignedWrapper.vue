<script setup lang="ts">
import HeaderArea from '@/components/header/HeaderArea.vue'
import SidebarArea from '@/components/sidebar/SidebarArea.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <sidebar-area />
    <div class="app-scrollbar relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <header-area />
      <main class="">
        <div class="mx-auto p-4 md:p-6 2xl:p-10">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
