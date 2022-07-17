<template>
    <div class="row">
        <el-checkbox v-model="component!.enabled" size="small" style="margin-right: 10px;" />
        <span class="header-title" style="flex: 1;">{{ name }}</span>
        <el-button size="small" @click="Utils.outputToConsole(component)">></el-button>
    </div>
</template>

<script setup lang="ts">
import Utils from '../misc/Utils';

defineProps({
    name: String,
    component: Object,
    updateKey: Number,
});

</script>
