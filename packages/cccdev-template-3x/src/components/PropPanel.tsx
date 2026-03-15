import { useComputed } from '@preact/signals';
import { selectedNode, updateTick } from '../store';
import { isValid, getComponents, outputToConsole, drawNodeRect } from '../engine';
import { NodeModel } from '../models/NodeModel';
import { PropItem } from './PropItem';
import { ComponentPanel } from './ComponentPanel';

export function PropPanel() {
  const node = useComputed(() => selectedNode.value);
  const tick = useComputed(() => updateTick.value);

  if (!node.value || !isValid(node.value)) {
    return (
      <div class="prop-panel">
        <div class="panel-header">属性</div>
        <div class="prop-empty">未选中节点</div>
      </div>
    );
  }

  const ccNode = node.value;
  const components = getComponents(ccNode);

  return (
    <div class="prop-panel">
      <div class="panel-header">属性</div>
      <div class="prop-scroll">
        {/* 节点基础属性 */}
        <div class="comp-panel">
          <div class="comp-header">
            <input
              type="checkbox"
              class="comp-enabled"
              checked={ccNode.active}
              onChange={(e) => {
                ccNode.active = (e.target as HTMLInputElement).checked;
              }}
            />
            <span class="comp-name">Node</span>
            <div style="flex:1" />
            <button class="icon-btn" title="高亮节点" onClick={() => drawNodeRect(ccNode)}>
              ⊡
            </button>
            <button class="icon-btn" title="输出到控制台" onClick={() => outputToConsole(ccNode)}>
              &gt;
            </button>
          </div>
          <div class="comp-props">
            {NodeModel.props.map((prop) => (
              <PropItem key={prop.key} model={NodeModel} propName={prop.name} propKey={prop.key} />
            ))}
          </div>
        </div>

        <div class="divider" />

        {/* 组件列表 */}
        {components.map(({ name, target }) => (
          <ComponentPanel key={name} name={name} component={target} updateKey={tick.value} />
        ))}
      </div>
    </div>
  );
}
