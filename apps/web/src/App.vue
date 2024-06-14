<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="flex flex-row items-center justify-between bg-slate-200 p-4 gap-4">
    <p class="space-x-2">
      <img alt="Vue logo" class="w-8 inline" src="@/assets/logo.svg" />

      <span>Real-time Trivia Game</span>
    </p>

    <nav class="space-x-2">
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'login' }">Login</RouterLink>
      <RouterLink :to="{ name: 'match' }">Match</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
