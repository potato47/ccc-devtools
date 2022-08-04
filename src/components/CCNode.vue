<template>
    <div class="row">
        <el-checkbox v-model="ccNode!.active" size="small" style="margin-right: 10px;" />
        <span class="header-title" style="flex: 1;">Node</span>
        <el-button size="small" @click="Utils.drawNodeRect(ccNode)">+</el-button>
        <el-button size="small" @click="Utils.outputToConsole(ccNode)">></el-button>
    </div>
    <template v-if="ccNode!.name != 'PROFILER_NODE'">
        <PropItem v-for="prop in NodeModel.props" :key="prop.key" :model="NodeModel" :prop-name="prop.name"
            :prop-key="prop.key" :update-key="updateKey!"></PropItem>
    </template>
    <ProfilerPanel v-if="ccNode!.name == 'PROFILER_NODE'" :show="true"></ProfilerPanel>
</template>

<script setup lang="ts">
import PropItem from './PropItem.vue';
import Utils from '../misc/Utils';

const props = defineProps({
    ccNode: Object,
    updateKey: Number,
});

class NodeModel {

    static props = [
        { name: 'Name', key: 'nodeName' },
        { name: 'X', key: 'x' },
        { name: 'Y', key: 'y' },
        { name: 'Z', key: 'z' },
        { name: 'Scale X', key: 'scaleX' },
        { name: 'Scale Y', key: 'scaleY' },
        { name: 'Scale Z', key: 'scaleZ' },
    ]

    static get ccNode(): any {
        return props.ccNode;
    }

    static get nodeName() {
        return this.ccNode.name;
    }

    static set nodeName(value: number) {
        this.ccNode.name = value;
    }

    static get x() {
        return this.ccNode.getPosition().x;
    }

    static set x(value: number) {
        const originPos = this.ccNode.getPosition();
        this.ccNode.setPosition(value, originPos.y, originPos.z);
    }

    static get y() {
        return this.ccNode.getPosition().y;
    }

    static set y(value: number) {
        const originPos = this.ccNode.getPosition();
        this.ccNode.setPosition(originPos.x, value, originPos.z);
    }

    static get z() {
        return this.ccNode.getPosition().z;
    }

    static set z(value: number) {
        const originPos = this.ccNode.getPosition();
        this.ccNode.setPosition(originPos.x, originPos.y, value);
    }

    static get scaleX() {
        return this.ccNode.getScale().x;
    }

    static set scaleX(value: number) {
        const originScale = this.ccNode.getScale();
        this.ccNode.setScale(value, originScale.y, originScale.z);
    }

    static get scaleY() {
        return this.ccNode.getScale().y;
    }

    static set scaleY(value: number) {
        const originScale = this.ccNode.getScale();
        this.ccNode.setScale(originScale.x, value, originScale.z);
    }

    static get scaleZ() {
        return this.ccNode.getScale().z;
    }

    static set scaleZ(value: number) {
        const originScale = this.ccNode.getScale();
        this.ccNode.setScale(originScale.x, originScale.y, value);
    }

}

</script>
