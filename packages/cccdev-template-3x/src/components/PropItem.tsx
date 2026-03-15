import { useRef, useEffect } from 'preact/hooks';
import { cc } from '../engine';

interface PropItemProps {
  model: any;
  propName: string;
  propKey: string;
}

function getPropType(value: any): string {
  if (value === null || value === undefined) return 'unknown';
  if (typeof value === 'object' && value.__classname__) return value.__classname__;
  return typeof value;
}

function colorToHex(color: any): string {
  const hex = color.toHEX() as string;
  return `#${hex}`;
}

function hexToColor(hex: string): any {
  return new (cc().Color)().fromHEX(hex);
}

function formatNum(v: number): string {
  return Number.isInteger(v) ? String(v) : parseFloat(v.toFixed(3)).toString();
}

/**
 * 数字输入框：非受控 + onInput 实时写入。
 * 用 ref 在外部 tick 变化时手动同步显示值（仅在未聚焦时同步，避免打断输入）。
 */
function NumberInput({ model, propKey }: { model: any; propKey: string }) {
  const ref = useRef<HTMLInputElement>(null);

  // 同步外部值到输入框（未聚焦时才更新，避免覆盖正在输入的内容）
  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    const external = model[propKey];
    if (parseFloat(el.value) !== external) {
      el.value = formatNum(external);
    }
  });

  return (
    <input
      ref={ref}
      type="number"
      class="prop-input"
      defaultValue={formatNum(model[propKey])}
      step="0.1"
      onInput={(e) => {
        const v = parseFloat((e.target as HTMLInputElement).value);
        if (!isNaN(v)) model[propKey] = v;
      }}
    />
  );
}

function StringInput({ model, propKey }: { model: any; propKey: string }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    const external = String(model[propKey] ?? '');
    if (el.value !== external) el.value = external;
  });

  return (
    <input
      ref={ref}
      type="text"
      class="prop-input"
      defaultValue={model[propKey]}
      onInput={(e) => {
        model[propKey] = (e.target as HTMLInputElement).value;
      }}
    />
  );
}

export function PropItem({ model, propName, propKey }: PropItemProps) {
  const value = model[propKey];
  const type = getPropType(value);

  return (
    <div class="prop-row">
      <span class="prop-name">{propName}</span>
      <div class="prop-value">
        {type === 'number' && <NumberInput model={model} propKey={propKey} />}
        {type === 'string' && <StringInput model={model} propKey={propKey} />}
        {type === 'boolean' && (
          <input
            type="checkbox"
            class="prop-checkbox"
            checked={value}
            onChange={(e) => {
              model[propKey] = (e.target as HTMLInputElement).checked;
            }}
          />
        )}
        {type === 'cc.Color' && (
          <input
            type="color"
            class="prop-color"
            value={colorToHex(value)}
            onChange={(e) => {
              model[propKey] = hexToColor((e.target as HTMLInputElement).value);
            }}
          />
        )}
        {!['number', 'string', 'boolean', 'cc.Color'].includes(type) && (
          <span class="prop-unknown">{String(value)}</span>
        )}
      </div>
    </div>
  );
}
