<script setup lang="ts">
import TreePanel from './components/TreePanel.vue';
import { ref } from 'vue';
import ProfilerPanel from './components/ProfilerPanel.vue';
let showProfiler = ref(false);
window.addEventListener('showProfiler', (e: any) => {
  showProfiler.value = !showProfiler.value;
});
</script>

<template>
  <div>
    <vue-final-modal v-model="showProfiler" classes="modal-container" content-class="modal-content" :hide-overlay="true"
      :click-to-close="false" :prevent-click="true" :drag="true" :fit-parent="true" drag-selector=".modal-drag">
      <ProfilerPanel :show="showProfiler"></ProfilerPanel>
    </vue-final-modal>
  </div>
  <el-card :body-style="{ padding: 0 }" style="margin: 10px;">
    <TreePanel :show="true"></TreePanel>
  </el-card>
  <el-link type="primary" href="https://github.com/potato47/ccc-devtools" target="_blank" style="position:absolute;left: 5px;bottom: 5px;">ccc-devtools</el-link>
</template>

<style scoped>
:deep(.modal-container) {
  display: flex;
  justify-content: end;
  align-items: start;
}

:deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  border: 1px solid cadetblue;
  background: #171920;
}
</style>

