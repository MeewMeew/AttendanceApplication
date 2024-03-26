<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { filter, includes, orderBy as lOrderBy, some } from 'lodash'
import { onMounted, ref, watch } from 'vue'

import HeaderWrapper from '@/components/common/HeaderWrapper.vue'
import IconComponent from '@/components/icons/IconComponent.vue'
import { type IUser } from '@/database/database'
import { db } from '@/shared/firebase'
import type { ILucideIcon } from '@/shared/types'

const emit = defineEmits<{
  (event: 'loading', data: boolean): void
}>()

const ascending = ref<boolean>(true)
const iconName = ref<ILucideIcon>('ArrowDownZA')
const currentSortKey = ref<string>('')
const _users = ref<IUser[]>([])
const users = ref<IUser[]>([])
const search = ref<string>('')
const headers = ref([
  {
    key: 'index',
    name: 'Thứ tự',
    width: 'tiny'
  },
  {
    key: 'displayName',
    name: 'Tên sinh viên',
    width: 'huge'
  },
  {
    key: 'studentId',
    name: 'Mã sinh viên',
    width: 'small'
  },
  {
    key: 'email',
    name: 'Email',
    width: 'large'
  }
])

onMounted(() => {
  emit('loading', true)
  onSnapshot(query(collection(db, 'users'), orderBy('createdAt')), (snapshot) => {
    const data = snapshot.docs
      .map((doc) => doc.data() as IUser)
      .map((user, index) => ({
        ...user,
        index: index + 1
      }))
    _users.value = data
    users.value = data
    emit('loading', false)
  })
})

watch(
  search,
  useDebounceFn(() => {
    users.value = filter(_users.value, (user) =>
      some(
        [user.displayName.toLowerCase(), user.uid.toLowerCase(), user.email.toLowerCase()],
        (value) => includes(value, search.value.toLowerCase())
      )
    )
  }, 200)
)

function sort(key: string) {
  ascending.value = !ascending.value
  currentSortKey.value = key
  iconName.value = ascending.value ? 'ArrowDownAZ' : 'ArrowUpZA'
  users.value = lOrderBy(_users.value, [key], [ascending.value ? 'asc' : 'desc'])
}
</script>

<template>
  <div
    class="w-full rounded border border-stroke bg-white px-5 pb-6 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="mb-2 flex min-w-[200px] items-center justify-between space-x-1">
      <input
        v-model="search"
        type="text"
        placeholder="Search something..."
        class="w-full max-w-[400px] rounded border-[2px] border-stroke border-opacity-50 bg-transparent px-5 py-2 font-normal text-black outline-none transition focus:border-as-purple-600 active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-as-purple-600"
      />
    </div>
    <div class="app-scrollbar mb-6 max-h-[500px] max-w-full overflow-x-auto overflow-y-auto pr-0.5">
      <table class="relative w-full table-auto">
        <thead>
          <tr class="text-center">
            <header-wrapper
              v-for="(h, index) in headers"
              :sort-key="currentSortKey"
              :icon-name="iconName"
              :object-key="h.key"
              :column-name="h.name"
              :width="h?.width"
              :key="index"
              @sort="sort"
            />
            <th
              class="pointer-events-none sticky top-0 min-w-[200px] bg-gray-2 px-4 py-4 text-center font-medium text-black dark:bg-meta-4 dark:text-white"
            >
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users" :key="item.index">
            <td class="px-4 py-5">
              <p class="text-center font-medium text-black dark:text-white">{{ item.index }}</p>
            </td>
            <td class="px-4 py-5">
              <p class="text-center font-medium text-black dark:text-white">
                {{ item.displayName }}
              </p>
            </td>
            <td class="px-4 py-5">
              <p class="text-center font-medium text-black dark:text-white">
                {{ item.studentId }}
              </p>
            </td>
            <td class="px-4 py-5">
              <p class="text-center font-medium text-black dark:text-white">
                {{ item.email }}
              </p>
            </td>
            <td class="mx-auto p-1">
              <div class="flex w-full items-center justify-center space-x-3">
                <router-link
                  :to="{ name: 'student-modify', params: { id: item.uid } }"
                  class="hover:text-primary"
                  :name="item.uid"
                >
                  <icon-component
                    name="Settings2"
                    size="24px"
                    stroke-width="2px"
                    class="hover:text-primary dark:text-white"
                  />
                </router-link>

                <button class="outline-0 ring-0" aria-label="delete">
                  <icon-component
                    name="Trash2"
                    size="24px"
                    stroke-width="2px"
                    class="hover:text-primary dark:text-white"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
