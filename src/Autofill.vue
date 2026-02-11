<style>
.radio-active {
    @apply bg-indigo-100 text-indigo-500 border-indigo-300;
}
</style>
<template>
    <main class="p-2">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Choose Configuration</h3>
        <div id="list-config" class="grid grid-cols-2 border rounded gap-4 p-4">
            <label :for="'config' + i.name" name="config" v-for="(i, index) in configStore.configs" @click="selectConfig(i)"
                class="flex items-center p-3 w-full border rounded-lg text-sm focus:border-primary-focus focus:ring-primary-focus">
                <input type="radio" name="config" :value="i.name"
                    class="shrink-0 size-4 bg-transparent border-line-3 rounded-full shadow-2xs text-primary focus:ring-0 focus:ring-offset-0 checked:bg-primary-checked checked:border-primary-checked disabled:opacity-50 disabled:pointer-events-none"
                    :id="'config' + i.name">
                <span class="text-sm ms-3 text-muted-foreground-1" v-text="i.name"></span>
            </label>
        </div>
        <hr class="my-5">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Autofill</h3>
        <div class="border p-3 rounded grid grid-cols-3 gap-2">
            <button class="btn">Anamnesa</button>
            <button class="btn">Diagnosa</button>
            <button class="btn">Resep</button>
            <button class="btn">TB Paru</button>
        </div>
    </main>
</template>
<script setup>
import { useConfigStore } from './store/config-store'

const configStore = useConfigStore()

const selectConfig = async (config) => {
    await configStore.setSelectedConfig(config)
}

</script>