<style>
.radio-active {
    @apply bg-indigo-100 text-indigo-500 border-indigo-300;
}
</style>
<template>
    <main class="p-2">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Choose Configuration</h3>
        <div id="list-config" class="grid grid-cols-2 border rounded gap-4 p-4">
            <label :for="'config' + i" name="config" v-for="i in 4"
                class="flex items-center p-3 w-full border rounded-lg text-sm focus:border-primary-focus focus:ring-primary-focus">
                <input type="radio" name="config" :value="i"
                    class="shrink-0 size-4 bg-transparent border-line-3 rounded-full shadow-2xs text-primary focus:ring-0 focus:ring-offset-0 checked:bg-primary-checked checked:border-primary-checked disabled:opacity-50 disabled:pointer-events-none"
                    :id="'config' + i">
                <span class="text-sm ms-3 text-muted-foreground-1">config{{ i+1 }}</span>
            </label>
        </div>
    </main>
</template>
<script setup>

</script>