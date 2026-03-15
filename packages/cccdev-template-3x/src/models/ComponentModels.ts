import type { PropDef } from './NodeModel';

export interface ComponentViewModel {
  props: PropDef[];
  [key: string]: any;
}

export function getComponentViewModel(
  name: string,
  componentGetter: () => any,
): ComponentViewModel | null {
  switch (name) {
    case 'cc.UITransform':
      return new CCUITransformModel(componentGetter);
    case 'cc.Label':
      return new CCLabelModel(componentGetter);
    case 'cc.Sprite':
      return new CCSpriteModel(componentGetter);
    default:
      return null;
  }
}

class CCUITransformModel implements ComponentViewModel {
  props: PropDef[] = [
    { name: 'Width', key: 'width' },
    { name: 'Height', key: 'height' },
    { name: 'Anchor X', key: 'anchorX' },
    { name: 'Anchor Y', key: 'anchorY' },
  ];

  constructor(private getter: () => any) {}

  get width(): number {
    return this.getter()?.contentSize.width ?? 0;
  }
  set width(v: number) {
    const c = this.getter();
    if (!c) return;
    c.setContentSize(v, c.contentSize.height);
  }

  get height(): number {
    return this.getter()?.contentSize.height ?? 0;
  }
  set height(v: number) {
    const c = this.getter();
    if (!c) return;
    c.setContentSize(c.contentSize.width, v);
  }

  get anchorX(): number {
    return this.getter()?.anchorPoint.x ?? 0;
  }
  set anchorX(v: number) {
    const c = this.getter();
    if (!c) return;
    c.setAnchorPoint(v, c.anchorPoint.y);
  }

  get anchorY(): number {
    return this.getter()?.anchorPoint.y ?? 0;
  }
  set anchorY(v: number) {
    const c = this.getter();
    if (!c) return;
    c.setAnchorPoint(c.anchorPoint.x, v);
  }
}

class CCLabelModel implements ComponentViewModel {
  props: PropDef[] = [
    { name: 'String', key: 'string' },
    { name: 'Color', key: 'color' },
    { name: 'Font Size', key: 'fontSize' },
    { name: 'Line Height', key: 'lineHeight' },
  ];
  constructor(private getter: () => any) {}
  get string(): string {
    return this.getter()?.string ?? '';
  }
  set string(v: string) {
    const c = this.getter();
    if (c) c.string = v;
  }
  get color(): any {
    return this.getter()?.color;
  }
  set color(v: any) {
    const c = this.getter();
    if (c) c.color = v;
  }
  get fontSize(): number {
    return this.getter()?.fontSize ?? 0;
  }
  set fontSize(v: number) {
    const c = this.getter();
    if (c) c.fontSize = v;
  }
  get lineHeight(): number {
    return this.getter()?.lineHeight ?? 0;
  }
  set lineHeight(v: number) {
    const c = this.getter();
    if (c) c.lineHeight = v;
  }
}

class CCSpriteModel implements ComponentViewModel {
  props: PropDef[] = [{ name: 'Color', key: 'color' }];
  constructor(private getter: () => any) {}
  get color(): any {
    return this.getter()?.color;
  }
  set color(v: any) {
    const c = this.getter();
    if (c) c.color = v;
  }
}
