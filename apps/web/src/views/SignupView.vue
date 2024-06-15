<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../utils/axios';

const username = ref('');
const password = ref('');
const router = useRouter();

const signup = async () => {
  try {
    const response = await api.post('/auth/signup', {
      username: username.value,
      password: password.value
    });

    if (response.status === 201) {
      router.push('/login');
    }
  } catch (error: any) {
    console.error(error);

    if (error.response && error.response.status === 400) {
      alert('User already exists');
    }
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <form @submit.prevent="signup">
      <div class="mb-4">
        <label for="username" class="block">Username</label>
        <input v-model="username" type="text" id="username" class="border p-2 w-full" required />
      </div>
      <div class="mb-4">
        <label for="password" class="block">Password</label>
        <input v-model="password" type="password" id="password" class="border p-2 w-full" required />
      </div>
      <button type="submit" class="bg-blue-500 text-white p-2">Signup</button>
    </form>
  </div>
</template>
