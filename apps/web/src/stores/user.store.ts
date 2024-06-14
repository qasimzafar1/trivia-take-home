import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // TODO: Implement user store handling authentication
  const user = ref({ username: 'Dummy' })

  return { user }
})
