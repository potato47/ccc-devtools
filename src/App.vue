<script setup lang="ts">
import TreePanel from './components/TreePanel.vue';
import { ref } from 'vue';
let showTree = ref(false);
</script>

<template>
  <!-- <div>
    <vue-final-modal v-model="showTree" classes="modal-container" content-class="modal-content" :hide-overlay="true"
      :click-to-close="false" :prevent-click="true" :drag="true" :fit-parent="true" drag-selector=".modal-drag">
      <TreePanel :show="showTree"></TreePanel>
    </vue-final-modal>
    <el-button size="small" @click="showTree = !showTree">节点树</el-button>
  </div> -->
  <!-- <div style="width: 100%;border: 2px solid blue;"> -->
  <el-card :body-style="{ padding: 0 }" style="margin: 10px;">
    <TreePanel :show="true"></TreePanel>
  </el-card>
  <!-- </div> -->
</template>

<style scoped>
:deep(.modal-container) {
  display: flex;
  justify-content: start;
  align-items: center;
}

:deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  border: 1px solid cadetblue;
  background: #171920;
  min-width: 400px;
  height: 80%;
}
</style>

