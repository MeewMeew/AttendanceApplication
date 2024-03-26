<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { nextTick, onBeforeMount, ref } from 'vue'

import IconComponent from '@/components/icons/IconComponent.vue'
import { User } from '@/database/database'
import { appname } from '@/shared/constants'
import type { Menus } from '@/shared/types'
import { useSidebarStore } from '@/stores/sidebar'
import { useUserStore } from '@/stores/user'

import SidebarItem from './SidebarItem.vue'

const userStore = useUserStore()
const sidebarStore = useSidebarStore()
const target = ref(null)

const menuGroups = ref<Menus>([
  {
    name: 'USER',
    menuItems: [
      {
        icon: 'UserRound',
        label: 'Profile',
        route: '/user'
      },
      {
        icon: 'Settings',
        label: 'Settings',
        route: '/user/settings'
      }
    ]
  }
])

onBeforeMount(() => {
  nextTick().then(() => {
    User.read(userStore.user!.uid).then((data) => {
      if (data && data.role === 'admin') {
        menuGroups.value.push({
          name: 'ADMIN',
          menuItems: [
            {
              icon: 'LayoutDashboard',
              label: 'Dashboard',
              route: '/dashboard'
            },
            {
              icon: 'MonitorSmartphone',
              label: 'Devices',
              children: [
                {
                  icon: 'ListOrdered',
                  label: 'Device List',
                  route: '/dashboard/devices'
                }
              ]
            },
            {
              icon: 'UsersRound',
              label: 'Students',
              children: [
                {
                  icon: 'BookUser',
                  label: 'Student List',
                  route: '/dashboard/students'
                }
              ]
            }
          ]
        })
      }
    })
  })
})

onClickOutside(target, () => (sidebarStore.isSidebarOpen = false))
</script>

<template>
  <aside
    class="absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black shadow-lg duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen
    }"
    ref="target"
  >
    <div>
      <div
        class="flex items-center justify-between gap-2 border-b border-stroke border-opacity-20 px-4 py-5.5 dark:border-strokedark dark:border-opacity-100 dark:bg-boxdark lg:py-6.5"
      >
        <router-link to="/" class="flex flex-row items-center space-x-2">
          <img src="@/assets/logo.svg" alt="Logo" class="h-6 w-6" />
          <h1 class="text-xl text-white dark:text-white">{{ appname }}</h1>
        </router-link>

        <button
          class="block lg:hidden"
          @click="sidebarStore.isSidebarOpen = false"
          name="close-sidebar"
        >
          <icon-component
            :name="'X'"
            stroke-width="2px"
            class="dark:text-white"
            color="#fff"
            size="24px"
          />
        </button>
      </div>

      <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav class="px-4 py-4 lg:px-6">
          <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
            <div>
              <h3 class="mb-4 ml-4 text-sm font-medium text-bodydark2">{{ menuGroup.name }}</h3>
              <ul class="mb-6 flex flex-col gap-1.5">
                <sidebar-item
                  v-for="(menuItem, index) in menuGroup.menuItems"
                  :item="menuItem"
                  :key="index"
                  :index="index"
                />
              </ul>
            </div>
          </template>
        </nav>
      </div>
    </div>
  </aside>
</template>
