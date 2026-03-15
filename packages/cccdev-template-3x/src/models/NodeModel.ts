import { selectedNode } from '../store';

export interface PropDef {
  name: string;
  key: string;
}

export class NodeModel {
  static readonly props: PropDef[] = [
    { name: 'Name', key: 'nodeName' },
    { name: 'X', key: 'x' },
    { name: 'Y', key: 'y' },
    { name: 'Z', key: 'z' },
    { name: 'Scale X', key: 'scaleX' },
    { name: 'Scale Y', key: 'scaleY' },
    { name: 'Scale Z', key: 'scaleZ' },
  ];

  private static get node(): any {
    return selectedNode.value;
  }

  static get nodeName(): string {
    return this.node?.name ?? '';
  }
  static set nodeName(v: string) {
    if (this.node) this.node.name = v;
  }

  static get x(): number {
    return this.node?.getPosition().x ?? 0;
  }
  static set x(v: number) {
    if (!this.node) return;
    const p = this.node.getPosition();
    this.node.setPosition(v, p.y, p.z);
  }

  static get y(): number {
    return this.node?.getPosition().y ?? 0;
  }
  static set y(v: number) {
    if (!this.node) return;
    const p = this.node.getPosition();
    this.node.setPosition(p.x, v, p.z);
  }

  static get z(): number {
    return this.node?.getPosition().z ?? 0;
  }
  static set z(v: number) {
    if (!this.node) return;
    const p = this.node.getPosition();
    this.node.setPosition(p.x, p.y, v);
  }

  static get scaleX(): number {
    return this.node?.getScale().x ?? 1;
  }
  static set scaleX(v: number) {
    if (!this.node) return;
    const s = this.node.getScale();
    this.node.setScale(v, s.y, s.z);
  }

  static get scaleY(): number {
    return this.node?.getScale().y ?? 1;
  }
  static set scaleY(v: number) {
    if (!this.node) return;
    const s = this.node.getScale();
    this.node.setScale(s.x, v, s.z);
  }

  static get scaleZ(): number {
    return this.node?.getScale().z ?? 1;
  }
  static set scaleZ(v: number) {
    if (!this.node) return;
    const s = this.node.getScale();
    this.node.setScale(s.x, s.y, v);
  }
}
