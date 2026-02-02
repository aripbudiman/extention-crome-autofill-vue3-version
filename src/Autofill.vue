<template>
    <main class="p-4">
        <div id="list-config" class="grid grid-cols-3">
            <div class="flex gap-x-2" v-for="i in 3">
                <input type="radio" :id="'config' + i" name="config" value="1">
                <label :for="'config' + i">config1</label>
            </div>
        </div>
    </main>
</template>
<script setup>

</script>