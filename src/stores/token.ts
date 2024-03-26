import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'

export const useSignInToken = defineStore('signin-token-qr', () => {
  const token = useStorage('signin-token-qr', ref<string>(''))

  function setToken(newToken: string) {
    token.value = newToken
  }

  return { token, setToken }
})