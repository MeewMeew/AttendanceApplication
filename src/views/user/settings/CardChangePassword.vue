<script setup lang="ts">
import { updatePassword } from 'firebase/auth'
import { notify } from 'notiwind'
import { computed, ref } from 'vue'

import BaseCard from '@/components/common/BaseCard.vue'
import ModalNotify from '@/components/common/ModalNotify.vue'
import BaseButton from '@/components/forms/BaseButton.vue'
import BaseCheckBox from '@/components/forms/BaseCheckBox.vue'
import InputGroup from '@/components/forms/InputGroup.vue'
import { auth } from '@/shared/firebase'

const password = ref<string>('')
const confirmPassword = ref<string>('')
const isOpen = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const inputType = computed(() => (showPassword.value ? 'text' : 'password'))

async function onSubmit() {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z\d!@#$%^&*()-_+=]{8,}$/
  if (!regex.test(password.value)) {
    isOpen.value = true
    return
  }
  await updatePassword(auth.currentUser!, password.value)
    .then(() => {
      password.value = ''
      confirmPassword.value = ''
    })
    .then(() =>
      notify({
        group: 'app',
        text: 'Password changed successfully'
      })
    )
    .catch((error) => {
      notify({
        group: 'app',
        type: 'error',
        text: error.message
      })
    })
  await auth.currentUser?.reload()
}

function onShowPassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div>
    <base-card title="Change password">
      <form class="flex flex-col gap-3 px-3 py-3" @submit.prevent="onSubmit">
        <input-group label="New password" :type="inputType" required v-model="password" />
        <input-group
          label="Confirm new password"
          :type="inputType"
          required
          v-model="confirmPassword"
        />
        <base-check-box title="Show password" @change="onShowPassword" />
        <base-button color="default" type="submit">Change</base-button>
      </form>
    </base-card>
    <modal-notify
      :is-open="isOpen"
      title="Format wrong"
      message="Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character"
      button-accept-text="OK"
      @close="isOpen = false"
      @accept="isOpen = false"
      ref=""
    />
  </div>
</template>

<style scoped></style>
