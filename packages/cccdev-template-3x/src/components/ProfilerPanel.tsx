import { useEffect, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { profilerOpen } from '../store';
import { cc } from '../engine';

interface StatItem {
  key: string;
  desc: string;
  value: string;
}

const STAT_KEYS = [
  'fps',
  'draws',
  'frame',
  'instances',
  'tricount',
  'logic',
  'physics',
  'render',
  'textureMemory',
  'bufferMemory',
];

export function ProfilerPanel() {
  const items = useSignal<StatItem[]>(STAT_KEYS.map((key) => ({ key, desc: key, value: '—' })));
  const panelRef = useRef<HTMLDivElement>(null);
  const posX = useSignal(window.innerWidth - 260);
  const posY = useSignal(60);

  // 轮询 cc.profiler.stats
  useEffect(() => {
    if (!profilerOpen.value) return;

    function refresh() {
      const c = cc();
      if (!c?.profiler?.stats) return;
      const stats = c.profiler.stats;
      items.value = STAT_KEYS.map((key) => {
        const data = stats[key];
        if (!data) return { key, desc: key, value: '—' };
        const val = data.isInteger
          ? String(data.counter._value | 0)
          : data.counter._value.toFixed(2);
        return { key, desc: data.desc ?? key, value: val };
      });
    }

    refresh();
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  }, [profilerOpen.value]);

  // 原生拖拽
  useEffect(() => {
    const header = panelRef.current?.querySelector('.profiler-drag') as HTMLElement;
    if (!header) return;

    let startX = 0,
      startY = 0,
      startPX = 0,
      startPY = 0;
    let dragging = false;

    function onMouseMove(e: MouseEvent) {
      if (!dragging) return;
      posX.value = startPX + (e.clientX - startX);
      posY.value = startPY + (e.clientY - startY);
    }

    function onMouseUp() {
      dragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    function onMouseDown(e: MouseEvent) {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startPX = posX.value;
      startPY = posY.value;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    header.addEventListener('mousedown', onMouseDown);
    return () => header.removeEventListener('mousedown', onMouseDown);
  }, [profilerOpen.value]);

  if (!profilerOpen.value) return null;

  return (
    <div
      ref={panelRef}
      class="profiler-float"
      style={{ left: `${posX.value}px`, top: `${posY.value}px` }}
    >
      <div class="profiler-drag">
        <span>Profiler</span>
        <button
          class="icon-btn"
          onClick={() => {
            profilerOpen.value = false;
          }}
        >
          ✕
        </button>
      </div>
      <div class="profiler-body">
        {items.value.map((item) => (
          <div class="profiler-row" key={item.key}>
            <span class="profiler-desc">{item.desc}</span>
            <span class="profiler-val">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
