<template>
  <div class="container mx-auto p-4">
    <h1 v-if="matchState === ServerToClientEvent.WAITING_FOR_PLAYERS"
      class="text-2xl font-semibold text-center text-gray-700">Waiting for other player...</h1>
    <div v-else-if="matchState === ServerToClientEvent.MATCH_STARTED">
      <div v-if="currentQuestion">
        <h1 class="text-2xl font-semibold text-center text-gray-700">{{ currentQuestion?.question }}</h1>
        <div class="mt-4 space-y-2">
          <div v-for="option in currentQuestion?.options" :key="option.value" class="flex justify-center">
            <button @click="submitAnswer(option.id)"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {{ option.value }}
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <h1 class="text-2xl font-semibold text-center text-gray-700">Waiting for other player...</h1>
      </div>

    </div>
    <h1 v-else-if="matchState === ServerToClientEvent.MATCH_FINISHED"
      class="text-2xl font-semibold text-center text-gray-700">
      Match Finished! {{ winnerText }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watchEffect } from 'vue'
import { SocketGlobal } from '../realtime/socket-global'
import { useUserStore } from '../stores/user.store';
import { ClientToServerEvent, ServerToClientEvent } from 'realtime/realtime';
import router from '@/router';
import api from '../utils/axios';
import { useMatchStore, type Question } from '@/stores/match.store';

const socketServer = SocketGlobal.getSocket()
const userStore = useUserStore();
const matchStore = useMatchStore();

if (!userStore.user) {
  router.push('/')
}

const matchState = ref(ServerToClientEvent.WAITING_FOR_PLAYERS);
const currentQuestion = ref<Question | null>(null);
const winnerText = ref<string | null>(null);

const fetchQuestionDetails = async (id: number) => {
  try {
    const response = await api.get(`/question/${id}`);
    const data = response.data;
    matchStore.setQuestion(data.question)
    currentQuestion.value = data.question
  } catch (error) {
    console.error(error);
  }
};

function submitAnswer(option: number) {
  if (currentQuestion.value) {
    socketServer.emit(ClientToServerEvent.ANSWER, userStore.user!.id, option)
    currentQuestion.value = null
  }
}

function onConnect() {
  console.log('Connected to server')
  socketServer.emit(ClientToServerEvent.JOIN_QUEUE, userStore.user?.id!)
}

function onConnectError(error: Error) {
  console.error('Error connecting to server', error)
}

function onDisconnect(reason: string) {
  console.log('Disconnected from server due to', reason)
}

function onWaitingForPlayer() {
  console.log('Waiting for another player...');
}

function onMatchStarted(questionId: number) {
  matchState.value = ServerToClientEvent.MATCH_STARTED
  fetchQuestionDetails(questionId)
}

function onMatchFinished(winnerId: number) {
  console.log(winnerId)
  matchState.value = ServerToClientEvent.MATCH_FINISHED
  if (userStore.user?.id === winnerId) {
    winnerText.value = 'You won! 🎉'
  } else if (winnerId === null) {
    winnerText.value = 'Its a draw!'
  } else {
    winnerText.value = 'You lost!'
  }
}

watchEffect(async (onUnmounted) => {
  await nextTick() // untrack below

  socketServer.connect()
  socketServer.on('connect', onConnect)
  socketServer.on('connect_error', onConnectError)
  socketServer.on('disconnect', onDisconnect)
  socketServer.on(ServerToClientEvent.WAITING_FOR_PLAYERS, onWaitingForPlayer);
  socketServer.on(ServerToClientEvent.MATCH_STARTED, onMatchStarted);
  socketServer.on(ServerToClientEvent.MATCH_FINISHED, onMatchFinished);

  onUnmounted(() => {
    socketServer.disconnect()
    socketServer.off('connect', onConnect)
    socketServer.off('connect_error', onConnectError)
    socketServer.off('disconnect', onDisconnect)
    socketServer.on(ServerToClientEvent.WAITING_FOR_PLAYERS, onWaitingForPlayer);
  })
})
</script>
