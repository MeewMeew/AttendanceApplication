<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { filter, includes, orderBy as lOrderBy, some } from 'lodash'
import { notify } from 'notiwind'
import { validate } from 'uuid'
import { onMounted, ref, watch } from 'vue'

import HeaderWrapper from '@/components/common/HeaderWrapper.vue'
import ModalNotify from '@/components/common/ModalNotify.vue'
import BaseButton from '@/components/forms/BaseButton.vue'
import IconComponent from '@/components/icons/IconComponent.vue'
import PopupScanQrCode from '@/components/qrcode/PopupScanQrCode.vue'
import { Client, type IClient } from '@/database/database'
import { extractSignToken, m2s } from '@/libs/utils'
import { db } from '@/shared/firebase'
import type { ILucideIcon } from '@/shared/types'

const emit = defineEmits<{
  (event: 'loading', data: boolean): void
}>()

const ascending = ref<boolean>(true)
const iconName = ref<ILucideIcon>('ArrowDownZA')
const currentSortKey = ref<string>('')
const _clients = ref<IClient[]>([])
const clients = ref<IClient[]>([])
const search = ref<string>('')
const isModalDeleteOpen = ref<boolean>(false)
const idSelected = ref<string>('')
const isPopupOpen = ref<boolean>(false)
const headers = ref([
  {
    key: 'index',
    name: 'Thứ tự'
  },
  {
    key: 'name',
    name: 'Tên client',
    width: 'small'
  },
  {
    key: 'id',
    name: 'Client ID'
  },
  {
    key: 'status',
    name: 'Trạng thái'
  }
])

onMounted(() => {
  emit('loading', true)
  onSnapshot(query(collection(db, 'clients'), orderBy('createdAt')), (snapshot) => {
    const data = snapshot.docs
      .map((doc) => doc.data() as IClient)
      .map((client, index) => ({
        ...client,
        index: index + 1
      }))
    _clients.value = data
    clients.value = data
    emit('loading', false)
  })
})

watch(
  search,
  useDebounceFn(() => {
    clients.value = filter(_clients.value, (client) =>
      some([client.name.toLowerCase(), client.id.toLowerCase()], (value) =>
        includes(value, search.value.toLowerCase())
      )
    )
  }, 200)
)

function sort(key: string) {
  ascending.value = !ascending.value
  currentSortKey.value = key
  iconName.value = ascending.value ? 'ArrowDownAZ' : 'ArrowUpZA'
  clients.value = lOrderBy(_clients.value, [key], [ascending.value ? 'asc' : 'desc'])
}

function switchStatus(id: string, currentStatus: 'online' | 'offline') {
  const status = currentStatus === 'online' ? 'offline' : 'online'
  Client.update({
    id: id,
    status: status
  }).then(() =>
    notify(
      {
        group: 'app',
        text: `Turn ${status === 'online' ? 'on' : 'off'} device successfully !`
      },
      3000
    )
  )
}
function deleteDevice(id: string) {
  isModalDeleteOpen.value = true
  idSelected.value = id
}

async function onScannerClose(
  data: {
    rawValue: string
  }[]
) {
  const id = extractSignToken(data[0].rawValue)
  if (validate(id)) {
    const time = m2s(Date.now())
    const data = {
      id: id,
      name: 'Device-' + time,
      createdAt: time,
      status: 'offline'
    } as IClient
    await Client.create(data)
    await Client.toggle(id)
    notify({
      group: 'app',
      text: `Create device ${data.name} successfully`
    })
  } else notify({ group: 'app', text: 'Invalid QR code', type: 'error' })
  isPopupOpen.value = false
}

function onAcceptDelete() {
  Client.delete(idSelected.value)
    .then(() => {
      notify({
        group: 'app',
        text: 'Delete device successfully'
      })
      isModalDeleteOpen.value = false
    })
    .catch(() => {
      notify({
        group: 'app',
        text: 'Delete device failed',
        type: 'error'
      })
      isModalDeleteOpen.value = false
    })
}

function onCancelDelete() {
  isModalDeleteOpen.value = false
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
      <base-button color="default" type="button" @click="isPopupOpen = true" icon="Plus" />
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
          <tr v-for="item in clients" :key="item.index">
            <td class="px-4 py-5">
              <p class="text-center font-medium text-black dark:text-white">{{ item.index }}</p>
            </td>
            <td class="px-4 py-5">
              <p class="text-center font-medium text-black dark:text-white">{{ item.name }}</p>
            </td>
            <td class="px-4 py-5">
              <p class="truncate text-center text-black dark:text-white">{{ item.id }}</p>
            </td>
            <td class="mx-auto flex w-full items-center justify-center py-5">
              <p
                class="inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium"
                :class="{
                  'bg-warning text-warning': item.status === 'offline',
                  'bg-success text-success': item.status === 'online'
                }"
              >
                {{ item.status }}
              </p>
            </td>
            <td class="mx-auto p-1">
              <div class="flex w-full items-center justify-center space-x-3">
                <button class="outline-0 ring-0" aria-label="power">
                  <icon-component
                    @click="() => switchStatus(item.id, item.status)"
                    :name="item.status === 'offline' ? 'Power' : 'PowerOff'"
                    size="22px"
                    stroke-width="2px"
                    class="hover:text-primary dark:text-white"
                  />
                </button>

                <router-link
                  :to="{ name: 'device-update', params: { id: item.id } }"
                  class="hover:text-primary"
                  :name="item.id"
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
                    @click="deleteDevice(item.id)"
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
    <modal-notify
      :is-open="isModalDeleteOpen"
      @close="isModalDeleteOpen = false"
      @accept="onAcceptDelete"
      @cancel="onCancelDelete"
      :is-yes-no="true"
      title="Chú ý"
      message="Hành động này không thể hoàn tác, có chắc chắn muốn xoá không?"
      button-cancel-text="Hủy"
      button-accept-text="Xác nhận"
    />
    <popup-scan-qr-code
      title="Scan QR code from client to login"
      :is-open="isPopupOpen"
      @close="isPopupOpen = false"
      @close-with-data="onScannerClose"
    />
  </div>
</template>
