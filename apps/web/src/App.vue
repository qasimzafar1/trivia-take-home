<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue';
import { useUserStore } from './stores/user.store';
import router from './router';

const userStore = useUserStore();
const user = computed(() => userStore.user);

const logout = () => {
  userStore.clearUser();
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  router.push('/')
};
</script>

<template>
  <header class="flex flex-row items-center justify-between bg-slate-200 p-4 gap-4">
    <p class="space-x-2">
      <img alt="Vue logo" class="w-8 inline" src="@/assets/logo.svg" />

      <span>Real-time Trivia Game</span>
    </p>

    <nav class="space-x-2" v-if="user">
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'match' }">Match</RouterLink>
      <RouterLink :to="{ name: 'question' }">Question</RouterLink>
      <button @click="logout">Logout</button>
    </nav>

    <nav class="space-x-2" v-else>
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'login' }">Login</RouterLink>
      <RouterLink :to="{ name: 'signup' }">Sign up</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
