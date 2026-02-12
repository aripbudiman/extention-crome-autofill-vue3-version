<template>
    <div id="page-configuration">
        <div class="flex justify-between items-center my-2">
            <h4 class="text-gray-800 text-sm font-semibold">Saved Configurations</h4>
            <button @click="showForm = !showForm"
                class="px-2 py-1 bg-indigo-500 text-white text-xs rounded-md hover:scale-105 hover:shadow-md hover:transition-all">+
                New
                Config</button>
        </div>
        <div class="my-3 flex flex-col gap-y-3">
            <div class="bg-slate-50 border border-gray-200 rounded p-3" v-for="config in configStore.configs">
                <div class="flex justify-between">
                    <div>
                        <h2 class="text-sm" v-text="config.name"></h2>
                        <p class="text-xs text-slate-500" v-text="config.description"></p>
                    </div>
                    <div class="flex gap-x-1">
                        <button class="btn-sm hover:bg-indigo-50 hover:border-indigo-300"
                            @click="editConfig(config, configStore.configs.indexOf(config))">✏️</button>
                        <button class="btn-sm hover:bg-red-50 hover:border-red-300">🗑</button>
                    </div>
                </div>
                <hr class="my-2.5">
                <div class="flex gap-x-3">
                    <p class="text-[11px] text-gray-500">🧑🏻‍⚕️ {{ config.doctors.length }} doctor(s)</p>
                    <p class="text-[11px] text-gray-500">📝 {{ config.doctors[0].name }}</p>
                    <p class="text-[11px] text-gray-500">📅 {{ formatDate(config.createdAt) }}</p>
                </div>
            </div>
        </div>
        <div class="border p-4 rounded-lg my-8" id="section-configuration-form" v-if="showForm">
            <div class="flex justify-between border-b-2 pb-4">
                <h2 class="text-sm font-semibold text-gray-700">{{ editingIndex !== null ? 'Edit Configuration' :
                    'Create New Configuration' }}</h2>
                <button class="text-gray-400" @click="showForm = !showForm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="m12 13.4l-2.917 2.925q-.277.275-.704.275t-.704-.275q-.275-.275-.275-.7t.275-.7L10.6 12L7.675 9.108Q7.4 8.831 7.4 8.404t.275-.704q.275-.275.7-.275t.7.275L12 10.625L14.892 7.7q.277-.275.704-.275t.704.275q.3.3.3.713t-.3.687L13.375 12l2.925 2.917q.275.277.275.704t-.275.704q-.3.3-.712.3t-.688-.3z" />
                    </svg>
                </button>
            </div>
            <div class="my-4">
                <label for="name" class="label">Configuration Name *</label>
                <input type="text" id="name" class="form-input" placeholder="Devlopment"
                    v-model="configStore.currentConfig.name">
            </div>
            <div class="my-4">
                <label for="name" class="label">Description</label>
                <textarea id="name" rows="2" class="form-input" placeholder="e.g., Configuration for puskesmas"
                    v-model="configStore.currentConfig.description"></textarea>
            </div>
            <hr class="my-4">
            <div class="flex justify-between items-center">
                <h2 class="uppercase text-sm font-semibold text-slate-500">Doctors List</h2>
                <button class="btn-sm hover:text-indigo-500 hover:border-indigo-500" @click="configStore.addRowDoctor">+
                    Add
                    Doctor</button>
            </div>
            <div class="py-3 flex flex-col gap-y-3">
                <div class="bg-slate-50 border border-gray-200 rounded  p-4"
                    v-for="(doctor, index) in configStore.currentConfig.doctors" :key="index">
                    <div class="header-list-dokter flex justify-between items-center">
                        <h3 class="text-sm  text-gray-800">Doctor #{{ index + 1 }}</h3>
                        <button class="btn-outline-red" @click="configStore.removeRowDoctor(index)">Remove</button>
                    </div>
                    <div class="grid grid-cols-2 gap-x-3 mt-2">
                        <div>
                            <label for="name" class="label">Doctor ID *</label>
                            <input type="text" id="name" class="form-input" v-model="doctor.id"
                                placeholder="0000000000001">
                        </div>
                        <div>
                            <label for="name" class="label">Doctor Name *</label>
                            <input type="text" id="name" class="form-input" v-model="doctor.name"
                                placeholder="Dr. John Doe">
                        </div>
                    </div>
                </div>
            </div>
            <hr class="my-3">
            <div class="flex justify-end gap-x-2">
                <button class="btn-sm btn-slate">Cancel</button>
                <button class="btn-sm btn-indigo" @click="saveConfig">{{ editingIndex !== null ? 'Update Configuration'
                    : 'Save Configuration' }}</button>
            </div>
        </div>
        <div class="flex justify-end">
            <button class="btn-sm hover:text-indigo-500 hover:border-indigo-500">📤 Export All</button>
        </div>
    </div>
</template>
<script setup>
import { useConfigStore } from './store/config-store'
import { ref } from 'vue'
import { onMounted } from 'vue'

const configStore = useConfigStore()
const showForm = ref(false)
const editingIndex = ref(null)

onMounted(async () => {
    await configStore.loadConfigs()
    console.log(configStore.configs)
})

function editConfig(config, index) {
    editingIndex.value = index
    configStore.loadConfigToEdit(index)
    showForm.value = true
}

function saveConfig() {
    if (editingIndex.value !== null) {
        // Update existing config
        configStore.updateConfig(editingIndex.value)
        editingIndex.value = null
    } else {
        // Create new config
        configStore.addConfig()
    }
    showForm.value = false
    configStore.resetCurrentConfig()
}

function formatDate(isoString) {
    const date = new Date(isoString);

    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

</script>