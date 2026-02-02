import {
    defineStore
} from "pinia";

export const useConfigStore = defineStore("config", {
    state: () => ({
        configs: [],
        currentConfig: { // Config yang sedang di-edit
            name: null,
            description: null,
            doctors: [{
                id: null,
                name: null
            }],
            createdAt: null,
            updatedAt: null
        }
    }),
    getters: {},
    actions: {
        addRowDoctor() {
            this.currentConfig.doctors.push({
                id: null,
                name: null
            })
        },
        removeRowDoctor(idx) {
            this.currentConfig.doctors.splice(idx, 1);
        },
        async saveConfigs() {
            chrome.storage.local.set({
                configs: this.configs
            }, () => {
                console.log('Configs saved');
            });
        }
    }
});