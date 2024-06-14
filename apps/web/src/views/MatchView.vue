<template>
  <div>
    <h1>TODO: Implement me</h1>
  </div>
</template>

<script setup lang="ts">
import { nextTick, watchEffect } from 'vue'
import { SocketGlobal } from '../realtime/socket-global'

const socketServer = SocketGlobal.getSocket()

function onConnect() {
  console.log('Connected to server')
}

function onConnectError(error: Error) {
  console.error('Error connecting to server', error)
}

function onDisconnect(reason: string) {
  console.log('Disconnected from server due to', reason)
}

watchEffect(async (onUnmounted) => {
  await nextTick() // untrack below

  socketServer.connect()
  socketServer.on('connect', onConnect)
  socketServer.on('connect_error', onConnectError)
  socketServer.on('disconnect', onDisconnect)

  onUnmounted(() => {
    socketServer.disconnect()
    socketServer.off('connect', onConnect)
    socketServer.off('connect_error', onConnectError)
    socketServer.off('disconnect', onDisconnect)
  })
})
</script>
