import { existsSync } from 'fs';
import { join, resolve } from 'path';

export interface CCProject {
  root: string;
  engineMajor: number;
}

export function detectCCProject(cwd: string = process.cwd()): CCProject | null {
  const root = resolve(cwd);

  const hasAssets = existsSync(join(root, 'assets'));
  if (!hasAssets) return null;

  // CC 3.x: has settings/ directory
  if (existsSync(join(root, 'settings'))) {
    return { root, engineMajor: 3 };
  }

  return null;
}
