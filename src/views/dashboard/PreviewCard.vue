<script setup lang="ts">
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { onMounted, ref } from 'vue'

import IconComponent from '@/components/icons/IconComponent.vue'
import { type IClient } from '@/database/database'
import { db } from '@/shared/firebase'

const clientOnline = ref<number>(0)
const totalDevices = ref<number>(0)
const totalUsers = ref<number>(0)

onMounted(() => {
  onSnapshot(collection(db, 'clients'), (snapshot) => {
    const data = snapshot.docs.map((doc) => doc.data() as IClient)
    clientOnline.value = data.filter((client) => client.status === 'online').length
    totalDevices.value = data.length
  })

  onSnapshot(query(collection(db, 'users'), where('role', '==', 'user')), (snapshot) => {
    totalUsers.value = snapshot.docs.length
  })
})
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
    <!--   Device card start   -->
    <router-link
      to="/dashboard/devices"
      class="rounded-sm bg-white px-7.5 py-6 shadow-default transition-shadow duration-150 hover:cursor-pointer hover:shadow-lg dark:bg-boxdark"
    >
      <div
        class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"
      >
        <icon-component name="Monitor" size="24px" class="dark:text-white" stroke-width="1.5px" />
      </div>
      <div class="mt-4 flex items-end justify-between">
        <div>
          <h4 class="text-title-md font-medium text-black dark:text-white">{{ totalDevices }}</h4>
          <span class="text-sm font-medium opacity-50 dark:text-whiten">Total Devices</span>
        </div>
        <div>
          <h4 class="text-title-md font-medium text-black dark:text-white">
            {{ clientOnline }}
          </h4>
          <span class="text-sm font-medium text-green-500 dark:text-green-400 dark:opacity-50"
            >Online</span
          >
        </div>
      </div>
    </router-link>
    <!--   User card start   -->
    <router-link
      to="/dashboard/students"
      class="rounded-sm bg-white px-7.5 py-6 shadow-default transition-shadow duration-150 hover:cursor-pointer hover:shadow-lg dark:bg-boxdark"
    >
      <div
        class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"
      >
        <icon-component
          name="UsersRound"
          size="24px"
          class="dark:text-white"
          stroke-width="1.5px"
        />
      </div>
      <div class="mt-4 flex items-end justify-between">
        <div>
          <h4 class="text-title-md font-medium text-black dark:text-white">{{ totalUsers }}</h4>
          <span class="text-sm font-medium opacity-50 dark:text-whiten">Total Students</span>
        </div>
      </div>
    </router-link>
    <!--   Experiment card start   -->
    <div
      class="rounded-sm bg-white px-7.5 py-6 shadow-default transition-shadow duration-150 hover:cursor-pointer hover:shadow-lg dark:bg-boxdark"
    >
      <div
        class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"
      >
        <icon-component
          name="FlaskConical"
          size="24px"
          class="dark:text-white"
          stroke-width="1.5px"
        />
      </div>
      <div class="mt-4 flex items-end justify-between">
        <div>
          <h4 class="text-title-md font-medium text-black dark:text-white">wip</h4>
          <span class="text-sm font-medium opacity-50 dark:text-whiten">wip</span>
        </div>
      </div>
    </div>
    <!--   Experiment card start   -->
    <div
      class="rounded-sm bg-white px-7.5 py-6 shadow-default transition-shadow duration-150 hover:cursor-pointer hover:shadow-lg dark:bg-boxdark"
    >
      <div
        class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"
      >
        <icon-component
          name="FlaskConical"
          size="24px"
          class="dark:text-white"
          stroke-width="1.5px"
        />
      </div>
      <div class="mt-4 flex items-end justify-between">
        <div>
          <h4 class="text-title-md font-medium text-black dark:text-white">wip</h4>
          <span class="text-sm font-medium opacity-50 dark:text-whiten">wip</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
