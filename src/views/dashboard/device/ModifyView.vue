<script setup lang="ts">
import { notify } from 'notiwind'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/forms/BaseButton.vue'
import { Client, type IClient } from '@/database/database'

const route = useRoute()
const router = useRouter()
const client = ref<IClient>()
const deviceName = ref<string>('')
const additionalData = ref<string>('')
const switcherToggle = ref<boolean>(false)
const error = ref<boolean>(false)
const loading = ref<boolean>(true)

const clientId = computed(() => route.params?.id as string)

function fetchingData() {
  Client.read(clientId.value)
    .then((data) => {
      if (data) {
        client.value = data
        deviceName.value = data.name
        additionalData.value = data.additionalData!
        switcherToggle.value = data.status === 'online'
      } else router.push({ name: '404' })
    })
    .catch(() => {
      error.value = true
      router.push({ name: '404' })
    })
    .finally(() => {
      loading.value = false
    })
}

async function onSaveClick() {
  if (client.value) {
    client.value.name = deviceName.value || client.value.name
    client.value.additionalData = additionalData.value
    await Client.update(client.value)
      .then(() => {
        notify({
          group: 'app',
          text: 'Update device successfully'
        })
      })
      .finally(() => router.push('/dashboard/devices'))
  }
}

function onSwitchChange() {
  if (client.value) {
    switcherToggle.value = !switcherToggle.value
    client.value.status = switcherToggle.value ? 'online' : 'offline'
  }
}

onMounted(() => fetchingData())
</script>

<template>
  <div>
    <base-breadcrumb current="Modify device" from="Dashboard" from-route="/dashboard" />
    <div class="mx-auto max-w-2xl overflow-hidden">
      <base-card :title="'Client Id: ' + clientId">
        <div class="flex flex-col gap-5 p-5">
          <div>
            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
              >Device name </label
            ><input
              type="text"
              v-model="deviceName"
              :placeholder="client?.name"
              class="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>
        <div class="flex flex-col gap-5 p-5">
          <div>
            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
              >Additinonal data </label
            ><input
              type="text"
              v-model="additionalData"
              placeholder="classname, room, etc."
              class="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>
        <div class="flex items-center justify-between gap-5 p-5">
          <div>
            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
              >Device status
              <p
                class="inline-flex rounded-lg bg-opacity-10 px-2 py-1 text-xs font-medium"
                :class="{
                  'bg-warning text-warning': client?.status === 'offline',
                  'bg-success text-success': client?.status === 'online'
                }"
              >
                {{ client?.status }}
              </p>
            </label>
            <label for="toggle3" class="flex flex-1 cursor-pointer select-none items-center">
              <div class="relative">
                <input type="checkbox" id="toggle3" class="sr-only" @change="onSwitchChange" />
                <div class="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                <div
                  :class="switcherToggle && '!right-1 !translate-x-full !bg-primary dark:!bg-white'"
                  class="dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition"
                >
                  <span
                    :class="switcherToggle && '!block'"
                    class="hidden text-white dark:text-bodydark"
                  >
                    <svg
                      class="fill-current stroke-current"
                      width="11"
                      height="8"
                      viewBox="0 0 11 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                        fill=""
                        stroke=""
                        stroke-width="0.4"
                      ></path>
                    </svg>
                  </span>
                  <span :class="switcherToggle && 'hidden'">
                    <svg
                      class="h-4 w-4 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
            </label>
          </div>
          <div class="flex flex-col space-y-2">
            <span class="text-sm font-normal text-black dark:text-white">Save config</span>
            <base-button color="default" type="button" text="Save" @click="onSaveClick" />
          </div>
        </div>
      </base-card>
    </div>
  </div>
</template>

<style scoped></style>
