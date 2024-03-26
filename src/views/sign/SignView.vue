<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { notify } from 'notiwind'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import InputGroup from '@/components/forms/InputGroup.vue'
import IconApp from '@/components/icons/IconApp.vue'
import IconComponent from '@/components/icons/IconComponent.vue'
import QrCode from '@/components/qrcode/QrCodeSignIn.vue'
import { type IQrSign, User } from '@/database/database'
import { auth, db } from '@/shared/firebase'
import { useUserStore } from '@/stores/user'
import { useUUIDStore } from '@/stores/uuid'

const { uuid } = useUUIDStore()
const userStore = useUserStore()
const router = useRouter()
const email = ref<string>('')
const password = ref<string>('')
const isShowQRCode = ref<boolean>(false)
const messageError = ref<string>('')
const loading = ref<boolean>(false)

const docData = ref<IQrSign>({} as IQrSign)

onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) router.push({ name: 'dashboard' }).then(() => unsubscribe())
  })
  const unsubscribeAuth = onSnapshot(doc(db, 'signs', uuid), (snapshot) => {
    docData.value = snapshot.data() as IQrSign
    if (docData.value?.status === 'signed') {
      unsubscribeAuth()
    }
  })
})

interface IError {
  code: string
  message: string
}

const goToHome = () => router.push('/')
function handleSignIn() {
  loading.value = true
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(({ user }) =>
      User.read(user.uid)
        .then((data) => (userStore.setUser(data), data))
        .then((data) =>
          router.push(data.role === 'user' ? '/user' : '/dashboard').then(() =>
            notify({
              group: 'app',
              title: 'Login success',
              text: 'Welcome back'
            })
          )
        )
    )
    .catch((error: unknown) => {
      const err = error as IError
      if (err.code === 'auth/user-not-found') {
        messageError.value = 'User not found'
      } else if (err.code === 'auth/wrong-password') {
        messageError.value = 'Wrong password'
      } else if (err.code === 'auth/invalid-email') {
        messageError.value = 'Invalid email'
      } else if (err.code === 'auth/invalid-credential') {
        messageError.value = 'Invalid credential'
      } else {
        messageError.value = 'Error'
      }
      notify({
        group: 'app',
        type: 'error',
        title: 'Login failed',
        text: messageError.value
      })
      loading.value = false
    })
}
</script>

<template>
  <div class="flex h-screen flex-col justify-center py-12 font-nunito">
    <div
      class="xs:p-0 mx-auto w-full min-w-[340px] px-2 pt-10 transition-all duration-150 sm:max-w-[500px] md:max-w-xl md:px-10"
    >
      <div class="flex w-full flex-col items-center">
        <icon-app class="h-10 w-10 self-center" />
        <h1 class="mb-5 text-center text-2xl font-bold dark:text-white">Welcome back</h1>
      </div>
      <div class="flex flex-col space-x-2">
        <div class="w-full rounded-lg bg-white shadow dark:bg-boxdark">
          <transition-root
            :show="!isShowQRCode"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-0"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <form class="px-5 pt-5" @submit.prevent="handleSignIn">
              <input-group
                label="E-mail"
                type="text"
                placeholder="Nhập email"
                custom-classes="mb-2"
                v-model="email"
                required
              />
              <input-group
                label="Password"
                type="password"
                placeholder="Nhập mật khẩu"
                custom-classes="mb-5"
                v-model="password"
                required
              />
              <button
                :disabled="loading"
                type="submit"
                class="group inline-flex w-full items-center justify-center rounded-lg bg-blue-500 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-600 hover:shadow-md focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <icon-component
                  class="animate-spin"
                  name="Loader2"
                  size="20"
                  stroke-width="2px"
                  v-if="loading"
                />
                <span class="inline-block" v-else>Đăng nhập</span>
              </button>
            </form>
          </transition-root>
          <transition-root
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-0"
            leave-from="opacity-100"
            leave-to="opacity-0"
            :show="isShowQRCode"
          >
            <qr-code class="px-5 pt-5" />
          </transition-root>
          <div class="relative flex items-center px-6 py-3 opacity-50">
            <div class="flex-grow border-t opacity-50 dark:border-t-bodydark1"></div>
            <span class="text-gray-400 mx-4 flex-shrink text-sm text-opacity-50 dark:text-whiten"
              >Hoặc</span
            >
            <div class="flex-grow border-t opacity-50 dark:border-t-bodydark1"></div>
          </div>
          <div class="px-5 pb-4">
            <button
              type="button"
              @click="isShowQRCode = !isShowQRCode"
              class="flex w-full items-center justify-center rounded-lg border border-neutral-300 border-opacity-80 py-2 text-center text-sm font-normal text-neutral-600 shadow-sm outline-none ring-0 transition duration-200 hover:shadow-md"
            >
              <div v-if="!isShowQRCode" class="inline-flex items-center justify-center space-x-1">
                <icon-component
                  name="QrCode"
                  size="24px"
                  class="text-black-2 opacity-75 dark:text-whiten"
                  stroke-width="1.5"
                />
                <span class="opacity-75 dark:text-white">Đăng nhập bằng QR Code</span>
              </div>
              <div v-else class="inline-flex items-center justify-center space-x-1">
                <icon-component
                  name="User"
                  size="24px"
                  class="text-black-2 opacity-75 dark:text-whiten"
                  stroke-width="1.5"
                />
                <span class="opacity-75 dark:text-white">Đăng nhập bằng tài khoản</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="py-5">
        <div class="whitespace-nowrap text-center sm:text-left">
          <button
            @click="goToHome"
            class="text-gray-500 focus:bg-gray-300 focus:ring-gray-400 group group flex cursor-pointer items-center justify-center rounded-lg px-5 py-4 text-sm font-normal ring-inset transition duration-200 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
          >
            <icon-component
              name="ArrowLeft"
              stroke-width="2px"
              size="16px"
              class="duration-150 ease-in group-hover:-translate-x-1 dark:text-white dark:group-hover:text-black"
            />
            <span class="ml-1 inline-block dark:text-white dark:group-hover:text-black"
              >Quay về trang chủ</span
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
