<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.store';
import api from '../utils/axios';

const username = ref('');
const password = ref('');
const router = useRouter();
const userStore = useUserStore();

const login = async () => {
  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    });
    const data = response.data;
    if (data.token) {
      userStore.setUser(data.user, data.token);
      localStorage.setItem('token', data.token);
      router.push('/');
    }
  } catch (error: any) {
    console.error(error);

    if (error.response && error.response.status === 400) {
      alert('Invalid username or password');
    }
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <form @submit.prevent="login">
      <div class="mb-4">
        <label for="username" class="block">Username</label>
        <input v-model="username" type="text" id="username" class="border p-2 w-full" required />
      </div>
      <div class="mb-4">
        <label for="password" class="block">Password</label>
        <input v-model="password" type="password" id="password" class="border p-2 w-full" required />
      </div>
      <button type="submit" class="bg-blue-500 text-white p-2">Login</button>
    </form>
  </div>
</template>
