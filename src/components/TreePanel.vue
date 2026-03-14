<template>
  <div style="width: 100%;" :style="{ height: treeViewHeight }">
    <div class="search-bar">
      <el-input v-model="searchText" placeholder="Search Node or Component" clearable size="small"
        @input="onSearchInput" @clear="onSearchClear">
        <template #prefix>
          <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: middle;">
            <path fill="#909399"
              d="M795.904 750.72l124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704z" />
          </svg>
        </template>
      </el-input>
    </div>
    <el-tree-v2 ref="treeView" :props="defaultProps" empty-text="正在加载场景" :highlight-current="true"
      :expand-on-click-node="false" :default-expanded-keys="expandedKeys" :filter-method="filterMethod"
      @current-change="handleCurrentNodeChange" @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse"
      :height="treeContentHeight">
      <template #default="{ node }">
        <span :class="{ 'node-hide': !node.data.active, 'node-match': isNodeDirectMatch(node.data), 'node-flash': flashNodeUuid === node.data.uuid }">
          <template v-if="searchText && isNodeDirectMatch(node.data)">
            <span v-html="highlightName(node.label)"></span>
            <span v-if="getMatchedComponent(node.data)" class="matched-component">{{ getMatchedComponent(node.data)
            }}</span>
          </template>
          <template v-else>{{ node.label }}</template>
        </span>
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
import { onMounted, nextTick } from 'vue';
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
  children: TreeNode[];
  path: string[];
  componentNames?: string[];
}

let updateKey = ref(1);
let currentNode: any;
const expandedNodeMap = new Map();
let expandedKeys: string[] = [];
const searchText = ref('');
const defaultProps = {
  value: 'uuid',
  label: 'name',
  children: 'children',
};

const SEARCH_BAR_HEIGHT = 40;
const treeViewHeight = (window.innerHeight - 120) / 2;
const treeContentHeight = treeViewHeight - SEARCH_BAR_HEIGHT;
const treeView = ref(null);
const flashNodeUuid = ref('');
let flashTimer = 0;

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
    const compNames: string[] = ccNode.components
      ? ccNode.components.map((c: any) => c.__classname__ || '')
      : [];
    const node: TreeNode = {
      uuid: ccNode.uuid,
      name: ccNode.name,
      active: ccNode.activeInHierarchy,
      children: [],
      path: childPath,
      componentNames: compNames,
    };
    if (ccNode.children && ccNode.children.length > 0) {
      setChildren(node.children, ccNode.children, childPath);
    }
    container.push(node);
  });
}

// --- search ---

let currentTreeData: TreeNode[] = [];
let savedExpandedKeys: string[] = [];
let isSearching = false;
let lastMatchedUuid = '';
let firstMatchNode: TreeNode | null = null;
const visibleUuids = new Set<string>();
const expandPathUuids = new Set<string>();

function isMatchNode(nodeData: any, lowerQuery: string): boolean {
  if (nodeData.name.toLowerCase().includes(lowerQuery)) return true;
  const compNames: string[] = nodeData.componentNames || [];
  return compNames.some((n: string) => n.toLowerCase().includes(lowerQuery));
}

function markDescendantsVisible(node: TreeNode) {
  if (!node.children || node.children.length === 0) return;
  for (const child of node.children) {
    visibleUuids.add(child.uuid);
    markDescendantsVisible(child);
  }
}

function buildSearchSets(nodes: TreeNode[], query: string, ancestors: string[]): boolean {
  const lowerQuery = query.toLowerCase();
  let hasVisible = false;
  for (const node of nodes) {
    const selfMatch = isMatchNode(node, lowerQuery);
    let childHasVisible = false;
    if (node.children && node.children.length > 0) {
      childHasVisible = buildSearchSets(node.children, query, [...ancestors, node.uuid]);
    }

    if (selfMatch) {
      if (!firstMatchNode) {
        firstMatchNode = node;
      }
      ancestors.forEach((id) => {
        visibleUuids.add(id);
        expandPathUuids.add(id);
      });
      visibleUuids.add(node.uuid);
      if (node.children && node.children.length > 0) {
        // 让命中节点子节点直接可见，但仍可手动收起
        expandPathUuids.add(node.uuid);
      }
      markDescendantsVisible(node);
      hasVisible = true;
    } else if (childHasVisible) {
      visibleUuids.add(node.uuid);
      expandPathUuids.add(node.uuid);
      hasVisible = true;
    }
  }
  return hasVisible;
}

function analyzeSearch(query: string) {
  visibleUuids.clear();
  expandPathUuids.clear();
  firstMatchNode = null;
  buildSearchSets(currentTreeData, query, []);
}

function filterMethod(query: string, nodeData: any): boolean {
  if (!query) return true;
  return visibleUuids.has(nodeData.uuid);
}

function isNodeDirectMatch(data: any): boolean {
  if (!searchText.value) return false;
  return isMatchNode(data, searchText.value.toLowerCase());
}

function getMatchedComponent(data: any): string {
  if (!searchText.value) return '';
  const lowerQuery = searchText.value.toLowerCase();
  const compNames: string[] = data.componentNames || [];
  return compNames.find((n: string) => n.toLowerCase().includes(lowerQuery)) || '';
}

function highlightName(name: string): string {
  if (!searchText.value) return name;
  const keyword = searchText.value;
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return name.replace(regex, '<span class="highlight">$1</span>');
}

function findNodeByUuid(nodes: TreeNode[], uuid: string): TreeNode | null {
  for (const node of nodes) {
    if (node.uuid === uuid) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeByUuid(node.children, uuid);
      if (found) return found;
    }
  }
  return null;
}

function syncExpandedMap(keys: string[]) {
  expandedNodeMap.clear();
  keys.forEach((key) => expandedNodeMap.set(key, true));
  expandedKeys = [...expandedNodeMap.keys()];
}

function locateNode(tree: any, node: TreeNode) {
  tree.setCurrentKey(node.uuid);
  handleCurrentNodeChange(node);
  tree.scrollToNode(node.uuid, 'center');
  flashTargetNode(node.uuid);
}

function applySearchState(tree: any, query: string, locateFirst: boolean) {
  analyzeSearch(query);
  tree.filter(query);

  nextTick(() => {
    // 搜索期间只保留：搜索前展开状态 + 命中路径所需展开
    const mergedKeys = [...new Set([...savedExpandedKeys, ...expandPathUuids])];
    tree.setExpandedKeys(mergedKeys);
    syncExpandedMap(mergedKeys);

    if (locateFirst && firstMatchNode) {
      lastMatchedUuid = firstMatchNode.uuid;
      locateNode(tree, firstMatchNode);
    }
  });
}

function flashTargetNode(uuid: string) {
  flashNodeUuid.value = '';
  if (flashTimer) {
    window.clearTimeout(flashTimer);
  }
  nextTick(() => {
    flashNodeUuid.value = uuid;
    flashTimer = window.setTimeout(() => {
      if (flashNodeUuid.value === uuid) {
        flashNodeUuid.value = '';
      }
    }, 900);
  });
}

function onSearchInput(val: string) {
  const tree = treeView.value as any;
  if (!tree) return;
  if (!val) {
    onSearchClear();
    return;
  }

  if (!isSearching) {
    savedExpandedKeys = [...expandedNodeMap.keys()];
    isSearching = true;
  }

  applySearchState(tree, val, true);
}

function onSearchClear() {
  const tree = treeView.value as any;
  if (!tree) return;

  tree.filter('');
  visibleUuids.clear();
  expandPathUuids.clear();
  firstMatchNode = null;

  nextTick(() => {
    const lastMatchedNode = lastMatchedUuid ? findNodeByUuid(currentTreeData, lastMatchedUuid) : null;
    let restoredKeys = [...savedExpandedKeys];

    if (lastMatchedNode) {
      // 清空搜索时，展开到命中节点的父路径，确保可定位
      restoredKeys = [...new Set([...restoredKeys, ...lastMatchedNode.path.slice(0, -1)])];
    }

    tree.setExpandedKeys(restoredKeys);
    syncExpandedMap(restoredKeys);
    isSearching = false;
    savedExpandedKeys = [];

    if (lastMatchedNode) {
      locateNode(tree, lastMatchedNode);
    }
  });
}

const REFRESH_INTERVAL_MS = 120;
let lastRefreshAt = 0;

function refreshTree() {
  const now = performance.now();
  if (now - lastRefreshAt < REFRESH_INTERVAL_MS) {
    window.requestAnimationFrame(refreshTree);
    return;
  }
  lastRefreshAt = now;

  // @ts-ignore
  if (props.show && window.ccdevShow) {
    // 搜索模式下暂停全量重建，避免覆盖用户手动展开/收起操作
    if (isSearching && searchText.value) {
      updateKey.value = -updateKey.value;
      window.requestAnimationFrame(refreshTree);
      return;
    }

    let value: TreeNode[] = [];
    //@ts-ignore
    setChildren(value, cc.director.getScene().children, []);
    currentTreeData = value;
    const tree = treeView.value as any;
    tree.setData(value);
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

.search-bar {
  padding: 6px 8px;
  background: #1d1e21;
  border-bottom: 1px solid #333;
}

.search-bar .el-input__wrapper {
  background-color: #2a2b2e !important;
  box-shadow: 0 0 0 1px #414243 inset !important;
}

.search-bar .el-input__inner {
  color: #cfd3dc !important;
}

.search-bar .el-input__inner::placeholder {
  color: #6b6e78;
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

.node-match {
  color: #e6a23c;
}

.node-flash {
  border-radius: 4px;
  padding: 1px 3px;
  animation: node-flash-anim 0.9s ease-out;
}

@keyframes node-flash-anim {
  0% {
    background: rgba(103, 194, 58, 0.55);
  }

  100% {
    background: transparent;
  }
}

.highlight {
  color: #f56c6c;
  font-weight: bold;
}

.matched-component {
  font-size: 11px;
  color: #909399;
  margin-left: 6px;
  opacity: 0.8;
}
</style>
