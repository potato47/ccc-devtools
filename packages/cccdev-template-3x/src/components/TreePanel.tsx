import { useEffect, useCallback, useRef } from 'preact/hooks';
import { useSignal, useComputed } from '@preact/signals';
import {
  treeData,
  expandedUuids,
  selectedNode,
  searchQuery,
  updateTick,
  type TreeNode,
} from '../store';
import { isReady, getScene, resolveNodeByPath } from '../engine';

// ── 构建树数据 ─────────────────────────────────────────────
function buildTree(children: any[], path: string[]): TreeNode[] {
  const result: TreeNode[] = [];
  for (const ccNode of children) {
    const childPath = [...path, ccNode.uuid];
    const node: TreeNode = {
      uuid: ccNode.uuid,
      name: ccNode.name,
      active: ccNode.activeInHierarchy,
      children: ccNode.children?.length > 0 ? buildTree(ccNode.children, childPath) : [],
      path: childPath,
    };
    result.push(node);
  }
  return result;
}

// ── 搜索：收集所有匹配节点（扁平列表）─────────────────────
interface FlatMatch {
  node: TreeNode;
  depth: number;
}

function collectMatches(nodes: TreeNode[], query: string, depth = 0): FlatMatch[] {
  const q = query.toLowerCase();
  const result: FlatMatch[] = [];
  for (const node of nodes) {
    if (node.name.toLowerCase().includes(q)) {
      result.push({ node, depth });
    }
    result.push(...collectMatches(node.children, query, depth + 1));
  }
  return result;
}

// ── 搜索时自动展开匹配节点的所有祖先 ─────────────────────
function expandAncestors(nodes: TreeNode[], query: string): Set<string> {
  const q = query.toLowerCase();
  const toExpand = new Set<string>();

  function walk(node: TreeNode, ancestors: string[]): boolean {
    const matched = node.name.toLowerCase().includes(q);
    let childMatched = false;
    for (const child of node.children) {
      if (walk(child, [...ancestors, node.uuid])) childMatched = true;
    }
    if (matched || childMatched) {
      for (const uuid of ancestors) toExpand.add(uuid);
    }
    return matched || childMatched;
  }

  for (const node of nodes) walk(node, []);
  return toExpand;
}

// ── 在树中查找目标节点的 uuid 路径 ───────────────────────
function findPathInTree(nodes: TreeNode[], targetUuid: string): string[] | undefined {
  for (const node of nodes) {
    if (node.uuid === targetUuid) return [node.uuid];
    const childPath = findPathInTree(node.children, targetUuid);
    if (childPath) return [node.uuid, ...childPath];
  }
  return undefined;
}

// ── 高亮关键词 ────────────────────────────────────────────
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <span class="tree-label">{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span class="tree-label">{text}</span>;
  return (
    <span class="tree-label">
      {text.slice(0, idx)}
      <mark class="tree-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

// ── 搜索结果行（支持展开/折叠子节点）─────────────────────
function SearchResultItem({ node, query }: { node: TreeNode; query: string }) {
  const expanded = useComputed(() => expandedUuids.value.has(node.uuid));
  const isSelected = useComputed(() => selectedNode.value?.uuid === node.uuid);
  const hasChildren = node.children.length > 0;

  const handleClick = useCallback(() => {
    const ccNode = resolveNodeByPath(node.path);
    selectedNode.value = ccNode ?? null;
  }, [node.path]);

  const handleToggle = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const next = new Set(expandedUuids.value);
      if (next.has(node.uuid)) {
        next.delete(node.uuid);
      } else {
        next.add(node.uuid);
      }
      expandedUuids.value = next;
    },
    [node.uuid],
  );

  return (
    <div class="tree-node">
      <div
        class={`tree-row${isSelected.value ? ' selected' : ''}${!node.active ? ' inactive' : ''}`}
        style={{ paddingLeft: '8px' }}
        onClick={handleClick}
      >
        <span
          class={`tree-arrow${hasChildren ? '' : ' invisible'}${expanded.value ? ' expanded' : ''}`}
          onClick={handleToggle}
        >
          ›
        </span>
        <HighlightText text={node.name} query={query} />
      </div>
      {hasChildren && expanded.value && (
        <div class="tree-children">
          {node.children.map((child) => (
            <TreeNodeItem key={child.uuid} node={child} depth={1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── 单个树节点组件 ─────────────────────────────────────────
interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
}

function TreeNodeItem({ node, depth }: TreeNodeItemProps) {
  const expanded = useComputed(() => expandedUuids.value.has(node.uuid));
  const isSelected = useComputed(() => selectedNode.value?.uuid === node.uuid);
  const hasChildren = node.children.length > 0;

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const ccNode = resolveNodeByPath(node.path);
      selectedNode.value = ccNode ?? null;
    },
    [node.path],
  );

  const handleToggle = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const next = new Set(expandedUuids.value);
      if (next.has(node.uuid)) {
        next.delete(node.uuid);
      } else {
        next.add(node.uuid);
      }
      expandedUuids.value = next;
    },
    [node.uuid],
  );

  return (
    <div class="tree-node">
      <div
        class={`tree-row${isSelected.value ? ' selected' : ''}${!node.active ? ' inactive' : ''}`}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
        onClick={handleClick}
      >
        <span
          class={`tree-arrow${hasChildren ? '' : ' invisible'}${expanded.value ? ' expanded' : ''}`}
          onClick={handleToggle}
        >
          ›
        </span>
        <span class="tree-label">{node.name}</span>
      </div>
      {hasChildren && expanded.value && (
        <div class="tree-children">
          {node.children.map((child) => (
            <TreeNodeItem key={child.uuid} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── TreePanel 主组件 ───────────────────────────────────────
export function TreePanel() {
  const initialized = useSignal(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const query = useComputed(() => searchQuery.value.trim());

  // 搜索结果（扁平列表）
  const searchResults = useComputed(() => {
    if (!query.value) return null;
    return collectMatches(treeData.value, query.value);
  });

  // 搜索关键词变化时，自动展开匹配节点的祖先
  useEffect(() => {
    if (!query.value) return;
    const ancestors = expandAncestors(treeData.value, query.value);
    if (ancestors.size === 0) return;
    expandedUuids.value = new Set([...expandedUuids.value, ...ancestors]);
  }, [query.value]);

  useEffect(() => {
    let rafId: number;
    let started = false;

    function refreshTree() {
      if (isReady()) {
        if (!started) {
          started = true;
          initialized.value = true;
        }
        treeData.value = buildTree(getScene().children, []);
        updateTick.value = -updateTick.value;
      }
      rafId = requestAnimationFrame(refreshTree);
    }

    const pollId = setInterval(() => {
      if (isReady()) {
        clearInterval(pollId);
        rafId = requestAnimationFrame(refreshTree);
      }
    }, 500);

    return () => {
      clearInterval(pollId);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSearchInput = useCallback((e: Event) => {
    searchQuery.value = (e.target as HTMLInputElement).value;
  }, []);

  /** 清空搜索并定位到当前选中节点 */
  const clearAndLocate = useCallback(() => {
    const selected = selectedNode.value;
    searchQuery.value = '';
    inputRef.current?.focus();

    if (!selected) return;

    // 在树中找到选中节点的 path，展开所有祖先
    const path: string[] | undefined = findPathInTree(treeData.value, selected.uuid);
    if (path && path.length > 1) {
      const next = new Set(expandedUuids.value);
      // 展开除最后一个（自身）之外的所有祖先
      for (let i = 0; i < path.length - 1; i++) next.add(path[i]);
      expandedUuids.value = next;
    }

    // 等 DOM 更新后滚动到选中节点
    requestAnimationFrame(() => {
      const scrollContainer = inputRef.current?.closest('.tree-panel')?.querySelector('.tree-scroll');
      const el = scrollContainer?.querySelector('.tree-row.selected');
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }, []);

  // Esc 清空搜索并定位
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearAndLocate();
      }
    },
    [clearAndLocate],
  );

  return (
    <div class="tree-panel">
      <div class="panel-header">节点树</div>

      {/* 搜索栏 */}
      <div class="tree-search-bar">
        <span class="tree-search-icon">⌕</span>
        <input
          ref={inputRef}
          class="tree-search-input"
          type="text"
          placeholder="搜索节点…"
          value={searchQuery.value}
          onInput={handleSearchInput}
          onKeyDown={handleKeyDown}
        />
        {query.value && (
          <button class="tree-search-clear" onClick={clearAndLocate} title="清空">
            ✕
          </button>
        )}
      </div>

      <div class="tree-scroll">
        {!initialized.value ? (
          <div class="tree-empty">等待引擎初始化…</div>
        ) : searchResults.value !== null ? (
          // 搜索模式：扁平结果列表
          searchResults.value.length === 0 ? (
            <div class="tree-empty">未找到匹配节点</div>
          ) : (
            <>
              <div class="tree-search-count">{searchResults.value.length} 个结果</div>
              {searchResults.value.map(({ node }) => (
                <SearchResultItem key={node.uuid} node={node} query={query.value} />
              ))}
            </>
          )
        ) : treeData.value.length === 0 ? (
          <div class="tree-empty">场景为空</div>
        ) : (
          // 正常树模式
          treeData.value.map((node) => <TreeNodeItem key={node.uuid} node={node} depth={0} />)
        )}
      </div>
    </div>
  );
}
