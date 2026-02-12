import {
    defineStore
} from "pinia";
import {
    toRaw
} from "vue";

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
        },
        activeConfig: null,
    }),
    getters: {
        getAllConfigs: (state) => state.configs,
        getCurrentConfig: (state) => state.currentConfig,
    },
    actions: {
        // Get active config from storage
        async getActiveConfig() {
            if (chrome?.storage?.local) {
                return new Promise((resolve, reject) => {
                    chrome.storage.local.get('activeConfig', (result) => {
                        if (chrome.runtime.lastError) {
                            console.error('Error loading activeConfig:', chrome.runtime.lastError);
                            reject(chrome.runtime.lastError);
                        } else {
                            this.activeConfig = result.activeConfig || null;
                            resolve(this.activeConfig);
                        }
                    });
                });
            } else {
                try {
                    const activeConfig = localStorage.getItem('activeConfig');
                    this.activeConfig = activeConfig;
                    return activeConfig;
                } catch (e) {
                    console.error('Failed to load activeConfig from localStorage:', e);
                    return null;
                }
            }
        },
        // Load configs from Chrome Storage
        async loadConfigs() {
            return new Promise((resolve, reject) => {
                // PENTING: Convert reactive object ke plain object/array
                const plainConfigs = JSON.parse(JSON.stringify(toRaw(this.configs)));

                console.log('Loading configs', plainConfigs);

                // Guard check
                if (!chrome?.storage?.local) {
                    console.warn('Chrome storage not available, using localStorage');
                    this.configs = JSON.parse(localStorage.getItem('configs') || '[]');
                    resolve();
                    return;
                }

                chrome.storage.local.get('configs', (result) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error loading configs:', chrome.runtime.lastError);
                        reject(chrome.runtime.lastError);
                    } else {
                        console.log('Configs loaded successfully');
                        this.configs = result.configs || [];
                        resolve();
                    }
                });
            })
        },
        // Doctor management
        addRowDoctor() {
            this.currentConfig.doctors.push({
                id: null,
                name: null
            })
        },
        removeRowDoctor(idx) {
            this.currentConfig.doctors.splice(idx, 1);
        },
        // Save configs to Chrome Storage
        async saveConfigs() {
            return new Promise((resolve, reject) => {
                // PENTING: Convert reactive object ke plain object/array
                const plainConfigs = JSON.parse(JSON.stringify(toRaw(this.configs)));

                console.log('Saving configs', plainConfigs);

                // Guard check
                if (!chrome?.storage?.local) {
                    console.warn('Chrome storage not available, using localStorage');
                    localStorage.setItem('configs', JSON.stringify(plainConfigs));
                    resolve();
                    return;
                }

                chrome.storage.local.set({
                    configs: plainConfigs
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Error saving configs:', chrome.runtime.lastError);
                        reject(chrome.runtime.lastError);
                    } else {
                        console.log('Configs saved successfully');
                        resolve();
                    }
                });
            });
        },
        // Add new config
        addConfig() {
            const newConfig = {
                ...this.currentConfig,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.configs.push(newConfig);
            this.saveConfigs();
            this.resetCurrentConfig();
        },
        // Update existing config
        updateConfig(index) {
            this.configs[index] = {
                ...this.currentConfig,
                updatedAt: new Date().toISOString()
            };
            this.saveConfigs();
        },
        // Delete config
        deleteConfig(index) {
            this.configs.splice(index, 1);
            this.saveConfigs();
        },
        // Load config untuk edit
        loadConfigToEdit(index) {
            this.currentConfig = {
                ...this.configs[index]
            };
        },
        async setSelectedConfig(config) {
            const configName = config.name;
            this.activeConfig = configName;
            if (chrome?.storage?.local) {
                await new Promise((resolve, reject) => {
                    chrome.storage.local.set({ activeConfig: configName }, () => {
                        if (chrome.runtime.lastError) {
                            console.error('Error saving selected config:', chrome.runtime.lastError);
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve();
                        }
                    });
                    chrome.storage.local.set({ data: config }, () => {
                        if (chrome.runtime.lastError) {
                            console.error('Error saving selected config:', chrome.runtime.lastError);
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve();
                        }
                    });
                });
            } else {
                try {
                    localStorage.setItem('activeConfig', configName);
                } catch (e) {
                    console.error('Failed to save selected config to localStorage:', e);
                }
            }
        },
        // Reset current config
        resetCurrentConfig() {
            this.currentConfig = {
                name: null,
                description: null,
                doctors: [{
                    id: null,
                    name: null
                }],
                createdAt: null,
                updatedAt: null
            };
        },
    }
});