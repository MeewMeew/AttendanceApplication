<script setup lang="ts">
import { updateProfile } from 'firebase/auth'
import { notify } from 'notiwind'
import { computed, onMounted, ref } from 'vue'

import IconComponent from '@/components/icons/IconComponent.vue'
import { type IUser, User } from '@/database/database'
import { Storage } from '@/database/storage'
import * as utils from '@/libs/utils'
import { auth } from '@/shared/firebase'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const avatarLoading = ref<boolean>(false)
const avatar = ref<HTMLInputElement | null>(null)
const user = ref<IUser>()

const acronym = computed(() => {
  const name = user.value?.displayName || user.value?.email || ''
  return utils.getAcronym(name)
})

function onAvatarChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    avatarLoading.value = true
    const file = target.files[0]
    // check file type
    if (!file.type.startsWith('image')) {
      notify({
        group: 'app',
        type: 'error',
        text: 'Invalid file type'
      })
      avatarLoading.value = false
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function (readerEvent) {
      const img = new Image()
      img.src = readerEvent.target!.result as string
      img.onload = function () {
        const maxSize = 512
        const squareSize = Math.min(img.width, img.height)
        const offsetX = (img.width - squareSize) / 2
        const offsetY = (img.height - squareSize) / 2

        const canvas = document.createElement('canvas')
        canvas.width = maxSize
        canvas.height = maxSize
        const ctx = canvas.getContext('2d')
        ctx!.drawImage(img, offsetX, offsetY, squareSize, squareSize, 0, 0, maxSize, maxSize)
        canvas.toBlob((blob) => {
          if (blob) {
            Storage.uploadFile(`${userStore.user!.uid}/images/avatar.jpg`, blob)
              .then((url) => {
                updateProfile(auth.currentUser!, { photoURL: url }).then(() =>
                  User.update({ uid: userStore.user!.uid, photoURL: url }).then(() => {
                    userStore.setUser({ ...userStore.user!, photoURL: url })
                    notify({
                      group: 'app',
                      text: 'Avatar updated'
                    })
                    avatarLoading.value = false
                  })
                )
              })
              .catch((error) => {
                console.error('Error uploading avatar', error)
                notify({
                  group: 'app',
                  type: 'error',
                  text: 'Error uploading avatar'
                })
                avatarLoading.value = false
              })
          }
        })
      }
    }
  }
}

onMounted(() => User.read(userStore.user!.uid).then((data) => (user.value = data)))
</script>

<template>
  <div class="mx-auto my-3">
    <label
      class="relative h-[150px] max-h-[150px] w-[150px] max-w-[150px] cursor-pointer rounded-full"
    >
      <template v-if="!avatarLoading">
        <img
          v-if="userStore.user?.photoURL"
          :src="userStore.user.photoURL as string"
          alt="User"
          class="h-[150px] max-h-[150px] w-[150px] max-w-[150px] rounded-full group-hover:opacity-50"
        />
        <span
          v-else
          class="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-blue-700 text-xl uppercase text-white group-hover:opacity-50"
          >{{ acronym }}</span
        >
        <div
          class="absolute top-0 flex h-full w-full items-center justify-center rounded-full bg-black opacity-0 transition-all duration-100 hover:cursor-pointer hover:opacity-80"
        >
          <icon-component name="Camera" class="text-white" size="30" stroke-width="1.5" />
          <input
            type="file"
            accept="image/*"
            ref="avatar"
            class="hidden"
            @change="onAvatarChange"
          />
        </div>
      </template>
      <template v-else>
        <div
          class="flex h-[150px] w-[150px] items-center justify-center rounded-full border border-bodydark2"
        >
          <icon-component
            name="Loader2"
            size="40"
            stroke-width="2"
            class="animate-spin dark:text-white"
          />
        </div>
      </template>
    </label>
  </div>
</template>

<style scoped></style>
