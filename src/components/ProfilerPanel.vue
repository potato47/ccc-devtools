<template>
    <div style="width: 100%;height: 30px;background-color: #26282f;display: flex;align-items: center;justify-content: center;color: white;"
        class="modal-drag">
        Profiler
    </div>
    <div style="width: 100%;">
        <div class="row" v-for="item in items" :key="item.key">
            <span>{{ item.desc }}</span>
            <span style="flex: 1;text-align: right;">{{ item.value }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue-demi';

const props = defineProps({
    show: Boolean,
});

let items = ref<any[]>([]);

function refresh() {
    // @ts-ignore
    const cc = window['cc'];
    if (!cc || !cc.profiler || !cc.profiler._stats) {
        return;
    }
    // @ts-ignore
    const stats = cc.profiler._stats;
    items.value.forEach(item => {
        const data = stats[item.key];
        item.desc = data.desc;
        if (data.isInteger) {
            item.value = data.counter._value | 0;
        } else {
            item.value = data.counter._value.toFixed(2);
        }
    });
    setTimeout(refresh, 1000);
}

function init() {
    items.value = [
        { key: 'fps', desc: '', value: 0 },
        { key: 'draws', desc: '', value: 0 },
        { key: 'frame', desc: '', value: 0 },
        { key: 'instances', desc: '', value: 0 },
        { key: 'tricount', desc: '', value: 0 },
        { key: 'logic', desc: '', value: 0 },
        { key: 'physics', desc: '', value: 0 },
        { key: 'render', desc: '', value: 0 },
        { key: 'textureMemory', desc: '', value: 0 },
        { key: 'bufferMemory', desc: '', value: 0 },
    ];
    refresh();
}

onMounted(() => {
  init();
});

</script>

<style>
.row {
    display: flex;
    justify-content: center;
    margin: 10px;
}
</style>
