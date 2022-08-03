<template>
  <div style="width: 100%;" :style="{ height: treeViewHeight }">
    <el-tree-v2 ref="treeView" :props="defaultProps" empty-text="正在加载场景" :highlight-current="true"
      :expand-on-click-node="false" :default-expanded-keys="expandedKeys" @current-change="handleCurrentNodeChange"
      @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse" :height="treeViewHeight">
      <template #default="{ node }">
        <span :class="{ 'node-hide': !node.data.active }">{{ node.label }}</span>
      </template>
    </el-tree-v2>
  </div>
  <div style="width: 100%;border-top: 2px solid #414243;" :style="{ height: treeViewHeight }">
    <template v-if="updateKey !== 0 && Utils.checkNodeValid(currentNode)">
      <el-scrollbar>
        <CCNode :cc-node="currentNode" :update-key="updateKey"></CCNode>
        <div class="row" style="height: 2px;background-color: #1d1e21"></div>
        <template v-for="component in Utils.getComponents(currentNode)" :key="component.name">
          <CCComponent v-if="component.name.startsWith('cc.')" :component="component.target" :name="component.name"
            :update-key="updateKey"></CCComponent>
          <UserComponent v-else :component="component.target" :name="component.name" :update-key="updateKey">
          </UserComponent>
          <div class="row" style="height: 2px;background-color: #1d1e21"></div>
        </template>
      </el-scrollbar>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref } from 'vue-demi';
import CCNode from './CCNode.vue';
import Utils from '../misc/Utils';
import CCComponent from './CCComponent.vue';
import UserComponent from './UserComponent.vue';

const props = defineProps({
  show: Boolean,
});

interface TreeNode {
  name: string;
  uuid: string;
  active: boolean;
  children?: TreeNode[];
  path: string[];
}

let updateKey = ref(1);
let currentNode: any;
const expandedNodeMap = new Map();
let expandedKeys: string[] = [];
const defaultProps = {
  value: 'uuid',
  label: 'name',
  children: 'children',
};

const treeViewHeight = (window.innerHeight - 120) / 2;
const treeView = ref(null);

onMounted(() => {
  console.log('ccc-devtools init');
});

function getChildByUuidPath(node: any, path: string[], index: number): any {
  if (index >= path.length) {
    return node;
  }
  node = node.getChildByUuid(path[index]);
  return getChildByUuidPath(node, path, index + 1);
}

function handleCurrentNodeChange(data: any) {
  // @ts-ignore
  const ccNode = getChildByUuidPath(cc.director.getScene(), data.path, 0);
  if (data) {
    currentNode = ccNode;
  } else {
    currentNode = null;
  }
}

function handleNodeExpand(data: any) {
  expandedNodeMap.set(data.uuid, true);
  expandedKeys = [...expandedNodeMap.keys()];
}

function handleNodeCollapse(data: any) {
  expandedNodeMap.delete(data.uuid);
  expandedKeys = [...expandedNodeMap.keys()];
}

function setChildren(container: TreeNode[], children: any[], path: string[]) {
  children.forEach(ccNode => {
    const childPath = path.concat(ccNode.uuid);
    const node = {
      uuid: ccNode.uuid,
      name: ccNode.name,
      active: ccNode.activeInHierarchy,
      children: [],
      path: childPath,
    };
    if (ccNode.children && ccNode.children.length > 0) {
      setChildren(node.children, ccNode.children, childPath);
    }
    container.push(node);
  });
}

function refreshTree() {
  // @ts-ignore
  if (props.show && window.ccdevShow) {
    let value: TreeNode[] = [];
    //@ts-ignore
    setChildren(value, cc.director.getScene().children, []);
    (treeView.value as any).setData(value);
    updateKey.value = -updateKey.value;
  }
  window.requestAnimationFrame(refreshTree);
}

function init() {
  refreshTree();
}

const intervalId = setInterval(() => {
  // @ts-ignore
  if (window['cc'] && cc.director.getScene()) {
    init();
    clearInterval(intervalId);
  }
}, 1000);

</script>

<style>
.row {
  display: flex;
  justify-content: center;
  margin: 10px;
}

.el-input__inner {
  text-align: left !important;
}

.el-input__wrapper {
  padding-left: 10px !important;
}

.el-color-picker {
  flex: 1 !important;
}

.el-color-picker__trigger {
  width: 100% !important;
}

.el-tree-virtual-list {
  overflow-y: hidden !important;
}

span {
  color: #cfd3dc;
}

.node-hide {
  opacity: 0.3;
}
</style>
