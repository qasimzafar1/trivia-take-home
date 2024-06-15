<script setup lang="ts">
import { useUserStore } from '../stores/user.store'
const userStore = useUserStore()
</script>

<template>
  <div class="container mx-auto p-4">
    <div v-if="userStore.user">
      <h1 class="text-2xl font-semibold text-center text-gray-700">Welcome, {{ userStore.user?.username }}</h1>
    </div>
    <div v-else>
      <h1 class="text-2xl font-semibold text-center text-gray-700">Please login to continue</h1>
    </div>
  </div>
</template>
