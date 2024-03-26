<script setup lang="ts">
import { doc, onSnapshot } from 'firebase/firestore'
import { notify } from 'notiwind'
import { computed, onMounted, ref } from 'vue'

import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/forms/BaseButton.vue'
import PopupScanQrCode from '@/components/qrcode/PopupScanQrCode.vue'
import { Attendance, type IUser, Token, User } from '@/database/database'
import { formatISODate, parseISODate, today } from '@/libs/time'
import { AttendanceStatus, TimeRange } from '@/shared/constants'
import { db } from '@/shared/firebase'
import { useUserStore } from '@/stores/user'
import UserAvatar from '@/views/user/UserAvatar.vue'

const userStore = useUserStore()

const isPopupOpen = ref<boolean>(false)
const user = ref<IUser>()

const lastAttendance = computed(() => formatISODate(user.value?.lastAttendance!))
const totalOnTime = computed(() => user.value?.totalOnTime || 0)
const totalLate = computed(() => user.value?.totalLate || 0)

async function onScannerClose(
  data: {
    rawValue: string
  }[]
) {
  if (data.length === 0) return
  const [firstData] = data
  isPopupOpen.value = false

  const date = new Date().toISOString()

  const check = await Attendance.isSigned({
    id: firstData.rawValue,
    userId: userStore.user!.uid
  })

  if (check) {
    notify({
      group: 'app',
      type: 'error',
      text: 'You have already signed this attendance'
    })
    return
  }

  const status = await getAttendanceStatus(date)
  const { clientId } = await Token.readToken(firstData.rawValue)
  await Attendance.sign({
    id: firstData.rawValue,
    userId: userStore.user!.uid,
    date: date,
    clientId: clientId,
    status: status
  })

  await Token.deleteToken(firstData.rawValue)

  await User.update({
    uid: userStore.user!.uid,
    lastAttendance: date,
    totalOnTime:
      status === AttendanceStatus.ONTIME ? user.value!.totalOnTime + 1 : user.value!.totalOnTime,
    totalLate: status === AttendanceStatus.LATE ? user.value!.totalLate + 1 : user.value!.totalLate
  })
  notify({
    group: 'app',
    text: 'Attendance success'
  })
}

async function getAttendanceStatus(date: string) {
  const parse = parseISODate(date)
  if (parse.hour < TimeRange.START_TIME) return AttendanceStatus.ONTIME
  else if (parse.hour > TimeRange.START_TIME) return AttendanceStatus.LATE
  return AttendanceStatus.ABSENT
}

onMounted(() => {
  onSnapshot(doc(db, 'users', userStore.user!.uid), (doc) => {
    if (!doc.exists()) return
    user.value = doc.data() as IUser
  })
  User.read(userStore.user!.uid).then((data) => (user.value = data))
})
</script>

<template>
  <div class="flex w-full min-w-[370px] flex-1 justify-center">
    <base-card title="Student profile" class="w-full max-w-4xl">
      <div class="flex flex-col items-center justify-center py-3">
        <user-avatar />
      </div>
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div class="flex flex-col px-9 py-4">
          <h3 class="text-lg font-medium text-black dark:text-white">Information</h3>
          <p class="text-lg font-normal text-black dark:text-white">
            Student name: <span>{{ user?.displayName }}</span>
          </p>
          <p class="text-lg font-normal text-black dark:text-white">
            Student ID: <span>{{ user?.studentId }}</span>
          </p>
          <p class="text-lg font-normal text-black dark:text-white">
            Class: <span>{{ user?.class }}</span>
          </p>
          <p class="text-lg font-normal text-black dark:text-white">
            Email: <span>{{ user?.email }}</span>
          </p>
        </div>
        <div class="flex flex-col px-9 py-4">
          <h3 class="text-lg font-medium text-black dark:text-white">Attendance</h3>
          <p class="text-lg font-normal text-black dark:text-white">
            Total ontime: <span>{{ totalOnTime }}</span>
          </p>
          <p class="text-lg font-normal text-black dark:text-white">
            Total late: <span>{{ totalLate }}</span>
          </p>
        </div>
      </div>
      <div class="my-5 grid grid-cols-4 items-center gap-3 px-9">
        <p class="col-span-4 text-lg font-normal text-black dark:text-white lg:col-span-3">
          Last attendance: <span>{{ lastAttendance }}</span>
        </p>
        <base-button
          class="col-span-4 lg:col-span-1"
          color="default"
          type="button"
          :disabled="today(user?.lastAttendance!)"
          @click="isPopupOpen = true"
          :text="today(user?.lastAttendance!) ? 'Already signed' : 'Sign attendance'"
        />
      </div>
    </base-card>

    <popup-scan-qr-code
      title="Scan QR code to attendance"
      :is-open="isPopupOpen"
      @close="isPopupOpen = false"
      @close-with-data="onScannerClose"
    />
  </div>
</template>

<style scoped></style>
