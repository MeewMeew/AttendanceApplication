<script setup lang="ts">
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { notify } from 'notiwind'
import { ref } from 'vue'

import ModalNotify from '@/components/common/ModalNotify.vue'
import BaseButton from '@/components/forms/BaseButton.vue'
import IconComponent from '@/components/icons/IconComponent.vue'
import { User } from '@/database/database'
import { csvToArray, shortenFileName } from '@/libs/utils'
import router from '@/router'
import { auth } from '@/shared/firebase'
import PreviewCard from '@/views/dashboard/PreviewCard.vue'

type CsvData = {
  name: string
  email: string
  password: string
  class: string
  studentId: string
}

const isModalNotifySignOutOpen = ref<boolean>(false)
const importing = ref<boolean>(false)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadMessage = ref<HTMLElement | null>(null)
const dragging = ref<boolean>(false)
const csvFileName = ref<string>('')
const uploadJsonData = ref<CsvData[]>([])
const buttonUploadText = ref<string>('Choose file')

function onDragOver(e: DragEvent) {
  e.preventDefault()
  dragging.value = true
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
}

async function onDrop(e: DragEvent) {
  e.preventDefault()
  fileInput.value!.files = e.dataTransfer?.files!
  checkingFileBeforeUpload(fileInput.value!.files[0])
}

async function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  checkingFileBeforeUpload(file)
}

function checkingFileBeforeUpload(file?: File) {
  if (!file) return
  if (file.type !== 'text/csv') {
    return notify({
      group: 'app',
      text: 'File must be a .csv file',
      type: 'error'
    })
  }
  if (file.size > 10000000) {
    return notify({
      group: 'app',
      text: 'File must be less than 10MB',
      type: 'error'
    })
  }
  csvFileName.value = shortenFileName(file.name, 30)
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = async (event) => {
    const result = event.target?.result
    const data = csvToArray(result as string)
    if (data.length === 0) {
      return notify({
        group: 'app',
        text: 'File is empty',
        type: 'error'
      })
    }
    uploadJsonData.value = data
    buttonUploadText.value = `Import ${data.length} users`
  }
}

async function processUpload() {
  importing.value = true
  const count = [0, 0]
  if (uploadJsonData.value.length === 0) {
    return notify({
      group: 'app',
      text: 'File is empty',
      type: 'error'
    })
  }
  console.log(uploadJsonData.value)
  for (const row of uploadJsonData.value) {
    await createUserWithEmailAndPassword(auth, row!.email, row!.password)
      .then(({ user }) =>
        updateProfile(user, {
          displayName: row!.name
        }).then(() =>
          User.create({
            uid: user!.uid,
            email: row!.email,
            photoURL: '',
            displayName: row!.name,
            role: 'user',
            studentId: row!.studentId,
            class: row.class,
            createdAt: new Date().toISOString()
          }).then(() => {
            count[0]++
          })
        )
      )
      .catch(() => count[1]++)
      .finally(() => {
        uploadMessage.value!.innerText = `Importing... ${count[0] + count[1]}/${uploadJsonData.value.length} user(s)`
        if (count[0] + count[1] === uploadJsonData.value.length) {
          notify({
            group: 'app',
            text: `Imported ${count[0]}/${uploadJsonData.value.length} users successfully`,
            type: 'success'
          })
          importing.value = false
          csvFileName.value = ''
          fileInput.value!.value = ''
          buttonUploadText.value = 'Choose file'
        }
      })
  }
  await new Promise((resolve) => setTimeout(resolve, 1000))
  isModalNotifySignOutOpen.value = true
}

async function onAcceptSignOut() {
  console.log('Sign out')
  isModalNotifySignOutOpen.value = false
  await signOut(auth).then(() =>
    router.push('/sign-in').then(() => notify({ group: 'app', text: 'Sign out successfully' }))
  )
}
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <preview-card />

    <div class="mt-5 grid h-full w-full grid-cols-1 gap-4 rounded-sm md:gap-6">
      <div
        class="col-span-1 rounded-sm bg-white px-7.5 py-6 shadow-default transition-shadow duration-150 hover:shadow-lg dark:bg-boxdark"
      >
        <h3 class="mb-3 text-title-sm font-medium dark:text-whiten dark:opacity-50">
          Import students via CSV file
        </h3>
        <div class="flex w-full flex-col items-center justify-center" v-show="!importing">
          <label
            @click="() => fileInput!.click()"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
            for="dropzone-file"
            class="border-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 flex h-50 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed dark:border-bodydark2"
          >
            <div class="flex flex-col items-center justify-center pb-6 pt-5">
              <icon-component
                name="FileUp"
                class="text-gray-500 mb-4 h-8 w-8 dark:text-bodydark2"
                stroke-width="1.5"
              />
              <p class="text-gray-500 text-md mb-2 dark:text-bodydark2">
                <span class="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p class="text-gray-500 text-sm dark:text-bodydark2" v-if="!csvFileName">
                Must be a .csv file and less than 10MB
              </p>
              <p class="text-gray-500 text-sm dark:text-bodydark2" v-else>
                {{ csvFileName }}
              </p>
            </div>
            <input
              type="file"
              class="hidden"
              ref="fileInput"
              accept="text/csv"
              @change="onChange"
            />
          </label>
          <div class="mt-4">
            <base-button
              color="default"
              type="button"
              :text="buttonUploadText"
              @click="processUpload"
              :disabled="!csvFileName || importing"
            />
          </div>
        </div>
        <div class="flex w-full items-center justify-center" v-show="importing">
          <div class="flex flex-col items-center justify-center">
            <icon-component
              name="Loader2"
              class="h-10 w-10 animate-spin text-primary dark:text-primary"
              stroke-width="1.5"
            />
            <p class="text-gray-500 text-md mt-2 dark:text-bodydark2" ref="uploadMessage">
              Importing...
            </p>
          </div>
        </div>
      </div>
    </div>
    <modal-notify
      button-accept-text="Re-login"
      :is-open="isModalNotifySignOutOpen"
      title="Warning"
      message="This feature has some limitations, after successful login you need to log back into the system."
      @close="onAcceptSignOut"
      @accept="onAcceptSignOut"
    />
  </div>
</template>

<style scoped></style>
