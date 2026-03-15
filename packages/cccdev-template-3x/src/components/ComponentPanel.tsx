import { useSignal } from '@preact/signals';
import { PropItem } from './PropItem';
import { getComponentViewModel } from '../models/ComponentModels';
import { outputToConsole } from '../engine';

interface ComponentPanelProps {
  name: string;
  component: any;
  updateKey: number;
}

export function ComponentPanel({ name, component, updateKey: _updateKey }: ComponentPanelProps) {
  const collapsed = useSignal(false);
  const model = getComponentViewModel(name, () => component);

  return (
    <div class="comp-panel">
      <div
        class="comp-header"
        onClick={() => {
          collapsed.value = !collapsed.value;
        }}
      >
        <input
          type="checkbox"
          class="comp-enabled"
          checked={component?.enabled}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            if (component) component.enabled = (e.target as HTMLInputElement).checked;
          }}
        />
        <span class="comp-name">{name}</span>
        <span class="comp-arrow">{collapsed.value ? '›' : '⌄'}</span>
        <button
          class="icon-btn"
          title="输出到控制台"
          onClick={(e) => {
            e.stopPropagation();
            outputToConsole(component);
          }}
        >
          &gt;
        </button>
      </div>
      {!collapsed.value && model && (
        <div class="comp-props">
          {model.props.map((prop) => (
            <PropItem key={prop.key} model={model} propName={prop.name} propKey={prop.key} />
          ))}
        </div>
      )}
      {!collapsed.value && !model && <div class="comp-empty">（无可编辑属性）</div>}
    </div>
  );
}
