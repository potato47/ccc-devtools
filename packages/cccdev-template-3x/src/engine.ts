/** 获取 Cocos 引擎全局对象 */
export const cc = (): any => (window as any)['cc'];

export const getScene = (): any => cc()?.director?.getScene();

export const isReady = (): boolean => !!cc() && !!getScene();

export const isValid = (node: any): boolean => !!node && cc()?.isValid(node);

export const getComponents = (ccNode: any): Array<{ name: string; target: any }> =>
  (ccNode?.components ?? []).map((c: any) => ({ name: c.__classname__ as string, target: c }));

export const getSceneChildren = (): any[] => getScene()?.children ?? [];

export const getChildByUuid = (node: any, uuid: string): any => node?.getChildByUuid(uuid) ?? null;

/** 沿 uuid 路径从场景根查找节点 */
export const resolveNodeByPath = (path: string[]): any => {
  let node: any = getScene();
  for (const uuid of path) {
    node = getChildByUuid(node, uuid);
    if (!node) return null;
  }
  return node;
};

/** 将节点/组件输出到 window.temp1、temp2... 方便控制台操作 */
export const outputToConsole = (target: any): void => {
  let i = 1;
  while ((window as any)['temp' + i] !== undefined) i++;
  (window as any)['temp' + i] = target;
  console.log('temp' + i, target);
};

/** 在场景中高亮绘制节点包围盒，2s 后自动销毁 */
export const drawNodeRect = (target: any): void => {
  const c = cc();
  if (!c) return;
  let rect: any;
  const transform = target.getComponent(c.UITransformComponent);
  if (transform) {
    rect = getSelfBoundingBoxToWorld(transform, c);
  } else {
    const worldPos = c.v3();
    target.getWorldPosition(worldPos);
    rect = c.rect(worldPos.x, worldPos.y, 0, 0);
  }
  const canvasNode = new c.Node('__DevTools_Highlight__');
  const scene = getScene();
  scene.addChild(canvasNode);
  canvasNode.addComponent(c.Canvas);
  const bgNode = new c.Node();
  const graphics = bgNode.addComponent(c.GraphicsComponent);
  const bgTransform = bgNode.addComponent(c.UITransformComponent);
  canvasNode.addChild(bgNode);
  const centerPos = c.v3(rect.center.x, rect.center.y, 0);
  const localPos = c.v3();
  canvasNode.getComponent(c.UITransformComponent).convertToNodeSpaceAR(centerPos, localPos);
  bgNode.setPosition(localPos);
  bgNode.layer = target.layer;
  const isZeroSize = rect.width === 0 || rect.height === 0;
  if (isZeroSize) {
    graphics.circle(0, 0, 100);
    graphics.fillColor = c.Color.GREEN;
    graphics.fill();
  } else {
    bgTransform.width = rect.width;
    bgTransform.height = rect.height;
    graphics.rect(
      -bgTransform.width / 2,
      -bgTransform.height / 2,
      bgTransform.width,
      bgTransform.height,
    );
    graphics.fillColor = new c.Color().fromHEX('#E91E6390');
    graphics.fill();
  }
  setTimeout(() => {
    if (c.isValid(canvasNode)) canvasNode.destroy();
  }, 2000);
};

function getSelfBoundingBoxToWorld(transform: any, c: any): any {
  const _worldMatrix = c.mat4();
  if (transform.node.parent) {
    transform.node.parent.getWorldMatrix(_worldMatrix);
    const parentMat = _worldMatrix;
    const _matrix = c.mat4();
    c.Mat4.fromRTS(
      _matrix,
      transform.node.getRotation(),
      transform.node.getPosition(),
      transform.node.getScale(),
    );
    const width = transform._contentSize.width;
    const height = transform._contentSize.height;
    const rect = c.rect(
      -transform._anchorPoint.x * width,
      -transform._anchorPoint.y * height,
      width,
      height,
    );
    c.Mat4.multiply(_worldMatrix, parentMat, _matrix);
    rect.transformMat4(_worldMatrix);
    return rect;
  }
  return transform.getBoundingBox();
}
