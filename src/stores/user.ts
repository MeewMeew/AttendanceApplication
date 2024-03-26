import { type RemovableRef, useStorage } from '@vueuse/core'
import { onAuthStateChanged } from 'firebase/auth'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { type IUser, User } from '@/database/database'
import { auth } from '@/shared/firebase'

export const useUserStore = defineStore('user', () => {
  const user = useStorage('user', ref<IUser | null>(null), localStorage, {
    serializer:{
      read: (v: any) => JSON.parse(v) as IUser,
      write: (v: any) => JSON.stringify(v),
    }
  }) as RemovableRef<IUser>

  function setUser(_user: IUser | null) {
    user.value = _user || null
  }

  function fetch() {
    const unsubscribe =  onAuthStateChanged(auth, (user) =>{
      if (user) {
        User.read(user.uid).then(setUser).then(unsubscribe)
      }
    })
  }

  function clear() {
    setUser(null)
  }

  return { user, setUser, fetch, clear }
})
