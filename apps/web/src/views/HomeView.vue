<script setup lang="ts">
import { useUserStore } from '../stores/user.store'
const userStore = useUserStore()
</script>

<template>
  <h1>TODO: Implement me</h1>

  <p>User: {{ userStore.user.username }}</p>
</template>
