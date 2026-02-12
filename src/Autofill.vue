<style>
.radio-active {
    @apply bg-indigo-100 text-indigo-500 border-indigo-300;
}
</style>
<template>
    <main class="p-2">
        <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-semibold text-gray-700">Choose Configuration</h3>
            <div class="flex gap-x-2">
                <button @click="openSidePanel" title="Open Side Panel (Always stay open)"
                    class="text-gray-500 hover:text-indigo-500 hover:scale-110 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-7 16H5V5h7z" />
                    </svg>
                </button>
                <button @click="openAsWindow" title="Open as floating window"
                    class="text-gray-500 hover:text-indigo-500 hover:scale-110 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                </button>
            </div>
        </div>
        <div id="list-config" class="grid grid-cols-2 border rounded gap-4 p-4">
            <label :for="'config' + i.name" name="config" v-for="(i, index) in configStore.configs"
                @click="selectConfig(i)"
                class="flex items-center p-3 w-full border rounded-lg text-sm focus:border-primary-focus focus:ring-primary-focus">
                <input type="radio" name="config" :value="i.name" v-model="selectedConfigName"
                    class="shrink-0 size-4 bg-transparent border-line-3 rounded-full shadow-2xs text-primary focus:ring-0 focus:ring-offset-0 checked:bg-primary-checked checked:border-primary-checked disabled:opacity-50 disabled:pointer-events-none"
                    :id="'config' + i.name">
                <span class="text-sm ms-3 text-muted-foreground-1" v-text="i.name"></span>
            </label>
        </div>
        <hr class="my-5">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Autofill</h3>
        <div class="border p-3 rounded grid grid-cols-3 gap-2">
            <button class="btn" @click="btnAnamnesa">Anamnesa</button>
            <button class="btn">Diagnosa</button>
            <button class="btn">Resep</button>
            <button class="btn">TB Paru</button>
        </div>
    </main>
</template>
<script setup>
import { onMounted, computed } from 'vue'
import { useConfigStore } from './store/config-store'

const configStore = useConfigStore()

// Computed property for v-model binding
const selectedConfigName = computed({
    get() {
        return configStore.activeConfig
    },
    set(value) {
        // This will be handled by selectConfig function
    }
})

// Load active config when component mounts
onMounted(async () => {
    const activeConfig = await configStore.getActiveConfig()
    const data = await configStore.getData()
})

const selectConfig = async (config) => {
    await configStore.setSelectedConfig(config)
}

const openAsWindow = () => {
    chrome.windows.create({
        url: chrome.runtime.getURL('index.html'),
        type: 'popup',
        width: 450,
        height: 600
    });
}

const openSidePanel = async () => {
    const window = await chrome.windows.getCurrent();
    await chrome.sidePanel.open({ windowId: window.id });
}

const btnAnamnesa = async () => {
    const configData = configStore.data;
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    await chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: fillAnamnesa,
        args: [configData]
    });
}


function fillAnamnesa(config) {
    console.log('Data yang diterima di browser:', config)
    function randomAngka(min = 1, max = 6) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const random = randomAngka(0, config.doctors.length)
    const dokter = config.doctors[random]
    console.log(dokter)
    const dokterTenagaMedis = document.querySelector('input[name="Anamnesa[dokter_id]"]');
    const dokterNama = document.querySelector('input[name="dokter_nama"]');
    const keluhanUtama = document.querySelector('#keluhan');

    dokterTenagaMedis.value = dokter.id;
    dokterNama.value = dokter.name;
    keluhanUtama.value = 'sakit kepala, pusing, mual';
}

</script>