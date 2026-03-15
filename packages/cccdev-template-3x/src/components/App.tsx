import { useEffect, useRef } from 'preact/hooks';
import { useComputed, useSignal } from '@preact/signals';
import { devtoolsOpen, profilerOpen } from '../store';
import { TreePanel } from './TreePanel';
import { PropPanel } from './PropPanel';
import { ProfilerPanel } from './ProfilerPanel';

const MIN_WIDTH = 240;
const MAX_WIDTH = 600;
const STORAGE_KEY = 'cc_devtools_width';

function getSavedWidth(): number {
  const v = parseInt(localStorage.getItem(STORAGE_KEY) ?? '', 10);
  return isNaN(v) ? 320 : Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, v));
}

function getToolbarHeight(): number {
  const toolbar = document.querySelector('.toolbar') as HTMLElement | null;
  return toolbar ? toolbar.getBoundingClientRect().height : 42;
}

/** 将游戏内容区向左推开，避免面板遮挡 */
function pushGameCanvas(width: number) {
  const content = document.getElementById('content');
  if (content) content.style.paddingRight = `${width + 16}px`; // 面板宽 + 两侧间距
}

function restoreGameCanvas() {
  const content = document.getElementById('content');
  if (content) content.style.paddingRight = '';
}

function ToggleButton({ toolbarH }: { toolbarH: number }) {
  const active = devtoolsOpen.value;
  return (
    <button
      class={`ccdev-toggle${active ? ' active' : ''}`}
      style={{ top: `${Math.round(toolbarH / 2)}px` }}
      onClick={() => {
        devtoolsOpen.value = !devtoolsOpen.value;
      }}
      title={active ? '关闭 DevTools' : '打开 DevTools'}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M8 2l1.88 1.88" />
        <path d="M14.12 3.88L16 2" />
        <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
        <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
        <path d="M12 20v-9" />
        <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
        <path d="M6 13H2" />
        <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
        <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
        <path d="M22 13h-4" />
        <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
      </svg>
    </button>
  );
}

export function App() {
  const open = useComputed(() => devtoolsOpen.value);
  const panelRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const toolbarH = useSignal(getToolbarHeight());

  // 向外暴露 toggle，供 toolbar 按钮调用
  (window as any).__ccDevToolsToggle = () => {
    devtoolsOpen.value = !devtoolsOpen.value;
  };
  (window as any).__ccProfilerToggle = () => {
    profilerOpen.value = !profilerOpen.value;
  };

  // 持续监听 toolbar 实际高度，同步到 signal
  useEffect(() => {
    let ro: ResizeObserver | null = null;

    function attach() {
      const toolbar = document.querySelector('.toolbar') as HTMLElement | null;
      if (!toolbar) return false;
      // 用 getBoundingClientRect 拿含 border 的完整高度
      toolbarH.value = Math.round(toolbar.getBoundingClientRect().bottom);
      ro = new ResizeObserver(() => {
        toolbarH.value = Math.round(toolbar.getBoundingClientRect().bottom);
      });
      ro.observe(toolbar);
      return true;
    }

    if (!attach()) {
      // toolbar 尚未注入（由 cocosToolBar include 动态插入），轮询等待
      const id = setInterval(() => {
        if (attach()) clearInterval(id);
      }, 100);
      return () => clearInterval(id);
    }

    return () => ro?.disconnect();
  }, []);

  // 面板展开/收起时同步推开画布
  useEffect(() => {
    if (open.value) {
      const w = getSavedWidth();
      document.documentElement.style.setProperty('--devtools-width', `${w}px`);
      pushGameCanvas(w);
    } else {
      restoreGameCanvas();
    }
    return () => {
      restoreGameCanvas();
    };
  }, [open.value]);

  // 左侧拖拽调整宽度
  useEffect(() => {
    const handle = handleRef.current;
    const panel = panelRef.current;
    if (!handle || !panel) return;

    let startX = 0;
    let startW = 0;

    function onMouseMove(e: MouseEvent) {
      const delta = startX - e.clientX; // 向左拖 = 变宽
      const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startW + delta));
      document.documentElement.style.setProperty('--devtools-width', `${newW}px`);
      pushGameCanvas(newW);
    }

    function onMouseUp() {
      if (!handle) return;
      handle.classList.remove('dragging');
      const content = document.getElementById('content');
      if (content) content.style.pointerEvents = '';
      const w = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--devtools-width'),
        10,
      );
      localStorage.setItem(STORAGE_KEY, String(w));
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    function onMouseDown(e: MouseEvent) {
      if (!handle || !panel) return;
      e.preventDefault();
      startX = e.clientX;
      startW = panel.getBoundingClientRect().width;
      handle.classList.add('dragging');
      const content = document.getElementById('content');
      if (content) content.style.pointerEvents = 'none';
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    handle.addEventListener('mousedown', onMouseDown);
    return () => handle.removeEventListener('mousedown', onMouseDown);
  }, [open.value]);

  const GAP = 8; // 上下各留 8px 空隙
  const top = `${toolbarH.value + GAP}px`;
  const height = `calc(100vh - ${toolbarH.value + GAP * 2}px)`;

  if (!open.value)
    return (
      <>
        <ToggleButton toolbarH={toolbarH.value} />
        <ProfilerPanel />
      </>
    );

  return (
    <>
      <ToggleButton toolbarH={toolbarH.value} />
      <div id="cc-devtools" ref={panelRef} style={{ top, height }}>
        <div id="cc-devtools-resize" ref={handleRef} title="拖拽调整面板宽度" />
        <a
          class="ccdev-github"
          href="https://github.com/potato47/ccc-devtools"
          target="_blank"
          title="GitHub"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
        <TreePanel />
        <PropPanel />
      </div>
      <ProfilerPanel />
    </>
  );
}
