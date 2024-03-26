import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'

export const useUUIDStore = defineStore('uuid', () => {
  const uuid = useStorage('uuid', ref<string>(uuidv4()))

  function setUUID(newUUID: string) {
    uuid.value = newUUID
  }

  return { uuid, setUUID }
})