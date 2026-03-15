import { signal, computed } from '@preact/signals';

/** 当前选中的 cc.Node */
export const selectedNode = signal<any>(null);

/** 每帧 toggle（1 / -1），驱动属性面板重渲 */
export const updateTick = signal<number>(1);

/** DevTools 面板是否展开 */
export const devtoolsOpen = signal<boolean>(!!localStorage.getItem('cc_devtools_show'));

/** Profiler 浮窗是否展开 */
export const profilerOpen = signal<boolean>(false);

/** 节点树数据（每帧重建） */
export interface TreeNode {
  uuid: string;
  name: string;
  active: boolean;
  children: TreeNode[];
  path: string[];
}
export const treeData = signal<TreeNode[]>([]);

/** 已展开节点的 uuid 集合 */
export const expandedUuids = signal<Set<string>>(new Set());

/** 是否有节点被选中且有效 */
export const hasSelection = computed(() => selectedNode.value !== null);

/** 节点搜索关键词 */
export const searchQuery = signal<string>('');

devtoolsOpen.subscribe((val) => {
  if (val) {
    localStorage.setItem('cc_devtools_show', '1');
  } else {
    localStorage.removeItem('cc_devtools_show');
  }
});
