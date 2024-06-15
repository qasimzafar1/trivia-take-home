import { defineStore } from 'pinia'

interface User {
  id: number
  username: string
}

interface State {
  user: User | null
  token: string | null
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    user: null,
    token: null
  }),
  actions: {
    setUser(user: User, token: string) {
      this.user = user
      this.token = token
    },
    clearUser() {
      this.user = null
      this.token = null
    }
  }
})
