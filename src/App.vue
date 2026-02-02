<template>
  <div class="w-[450px] max-w-[450px] bg-white">
    <header class="bg-indigo-500 text-white p-4 text-center font-semibold">
      <h1>Autofill Configuration</h1>
    </header>
    <div class="bg-gray-100 flex justify-between border-b">
      <button @click="tab = 'autofill'" :class="[
        'bg-gray-100 p-2 w-1/2 hover:bg-gray-50 text-sm text-gray-600',
        tab === 'autofill' ? 'bg-white border-b-2 border-indigo-500 font-semibold' : ''
      ]">
        Autofill
      </button>
      <button @click="tab = 'config'" :class="[
        'bg-gray-100 p-2 w-1/2 hover:bg-gray-50 text-sm text-gray-600',
        tab === 'config' ? 'bg-white border-b-2 border-indigo-500 font-semibold' : ''
      ]">
        Configurations
      </button>
    </div>
    <main class="p-4">
      <Autofill v-if="tab === 'autofill'" />
      <Configuration v-else />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Configuration from './Configuration.vue'
import Autofill from './Autofill.vue'

const tab = ref('config')
</script>