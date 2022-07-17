<template>
    <div class="row">
        <el-checkbox v-model="component!.enabled" size="small" style="margin-right: 10px;" />
        <span style="flex: 1;">{{ name }}</span>
        <el-button size="small" @click="Utils.outputToConsole(component)">></el-button>
    </div>
    <PropItem v-if="model" v-for="prop in model.props" :key="prop.key" :model="prop.custom ? model : component" :prop-name="prop.name" :prop-key="prop.key"
        :update-key="updateKey!"></PropItem>
</template>

<script setup lang="ts">
import PropItem from './PropItem.vue';
import Utils from '../misc/Utils';
import { ComponentManager } from '../misc/ComponentManager';

const props = defineProps({
    name: String,
    component: Object,
    updateKey: Number,
});

const model = ComponentManager.getViewModel(props.name!, () => props.component)!;

</script>
