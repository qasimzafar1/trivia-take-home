<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold text-center text-gray-700 mb-4">Create New Question</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="question" class="block text-gray-700 font-bold mb-2">Question</label>
        <input v-model="question" id="question" type="text" class="border rounded w-full py-2 px-3 text-gray-700"
          required />
      </div>
      <div v-for="(option, index) in options" :key="index" class="flex items-center space-x-2">
        <input v-model="option.value" type="text" placeholder="Option value"
          class="border rounded w-full py-2 px-3 text-gray-700" required />
        <label class="inline-flex items-center">
          <input type="checkbox" v-model="option.isCorrect" class="form-checkbox h-5 w-5 text-blue-600" />
          <span class="ml-2 text-gray-700">Correct</span>
        </label>
        <button type="button" @click="removeOption(index)"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Remove</button>
      </div>
      <button type="button" @click="addOption"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Option</button>
      <br />
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create
        Question</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '../utils/axios';
import { useUserStore } from '@/stores/user.store';
import router from '@/router';

const userStore = useUserStore()

if (!userStore.user) {
  router.push('/')
}

interface Option {
  value: string;
  isCorrect: boolean;
}

const question = ref('');
const options = ref<Option[]>([
  { value: '', isCorrect: false }
]);

const addOption = () => {
  options.value.push({ value: '', isCorrect: false });
};

const removeOption = (index: number) => {
  options.value.splice(index, 1);
};

const submitForm = async () => {
  if (question.value.trim() === '' || options.value.some(option => option.value.trim() === '')) {
    return;
  }

  try {
    const response = await api.post('/question', {
      question: question.value,
      options: options.value
    });

    if (response.status === 201) {
      alert("New question added!")
      question.value = '';
      options.value = [{ value: '', isCorrect: false }];
    }
  } catch (error) {
    console.error(error);
  }
};
</script>
