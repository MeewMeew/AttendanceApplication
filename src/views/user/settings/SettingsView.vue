<script setup lang="ts">
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import CardChangePassword from '@/views/user/settings/CardChangePassword.vue'
</script>

<template>
  <div>
    <base-breadcrumb current="Settings" from="User" from-route="/user" />
    <div class="grid grid-cols-12">
      <card-change-password class="col-span-12 md:col-span-6 xl:col-span-3" />
    </div>
  </div>
</template>

<style scoped></style>
