<script setup lang="ts">
import { notify } from 'notiwind'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/forms/BaseButton.vue'
import InputGroup from '@/components/forms/InputGroup.vue'
import { type IUser, User } from '@/database/database'

const route = useRoute()
const router = useRouter()
const user = ref<IUser>()
const loading = ref<boolean>(false)
const vModelReactive = reactive({
  studentId: undefined,
  displayName: undefined,
  class: undefined,
  totalOnTime: 0,
  totalLate: 0
})

const userId = computed(() => route.params.id as string)

async function fetchData() {
  // Fetch user data
  loading.value = true
  await User.read(userId.value)
    .then((data) => {
      if (data) user.value = data
      else router.push({ name: 'students' })
    })
    .catch(() => router.push({ name: 'students' }))
    .finally(() => (loading.value = false))
}

async function onSubmit() {
  loading.value = true
  await User.update({
    uid: userId.value,
    ...vModelReactive
  })
    .then(() => router.push({ name: 'students' }))
    .catch((error) => {
      console.error(error)
      notify({
        group: 'app',
        text: 'Update user failed',
        type: 'error'
      })
    })
    .finally(() => {
      loading.value = false
      notify({
        group: 'app',
        text: 'Update user successfully'
      })
    })
}

onMounted(() => fetchData())
</script>

<template>
  <div>
    <base-breadcrumb current="Modify student" from="Dashboard" from-route="/dashboard" />
    <div class="flex w-full min-w-[370px] flex-1 justify-center">
      <base-card :title="'Student id: ' + userId" class="w-full max-w-2xl">
        <form @submit.prevent="onSubmit">
          <div class="flex flex-col gap-3 px-9 py-4">
            <input-group
              v-model="vModelReactive.displayName"
              label="Name"
              :placeholder="user?.displayName"
            />
            <input-group
              v-model="vModelReactive.studentId"
              label="Student ID"
              :placeholder="user?.studentId"
            />
            <input-group v-model="vModelReactive.class" label="Class" :placeholder="user?.class" />
          </div>
          <div class="flex w-full justify-end p-5">
            <base-button color="default" type="submit" text="Save" :disabled="loading" />
          </div>
        </form>
      </base-card>
    </div>
  </div>
</template>

<style scoped></style>
