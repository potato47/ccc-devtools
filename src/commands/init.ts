import { existsSync, cpSync } from 'fs';
import { join, resolve } from 'path';
import { detectCCProject } from '../utils/detect';
import { log } from '../utils/logger';

interface InitOptions {
  force: boolean;
}

const TEMPLATES: Record<number, string> = {
  3: '3x',
};

export async function init(opts: InitOptions) {
  const project = detectCCProject();

  if (!project) {
    log.error('当前目录不是 Cocos Creator 项目');
    log.dim('  请在包含 assets/ 和 settings/ 的项目根目录中运行此命令');
    process.exit(1);
  }

  log.info(`检测到 Cocos Creator ${project.engineMajor}.x 项目`);
  console.log();

  const templateName = TEMPLATES[project.engineMajor];
  if (!templateName) {
    log.error(`暂不支持 Cocos Creator ${project.engineMajor}.x`);
    process.exit(1);
  }

  const destDir = join(project.root, 'preview-template');

  if (existsSync(destDir) && !opts.force) {
    log.warn('preview-template/ 已存在，使用 --force 覆盖');
    process.exit(1);
  }

  // Resolve template from within the ccdev package itself
  const pkgRoot = resolve(import.meta.dir, '../..');
  const templateDir = join(pkgRoot, 'template', templateName);

  if (!existsSync(templateDir)) {
    log.error('模板文件缺失，请重新安装 ccdev');
    process.exit(1);
  }

  log.step('安装模板...');
  cpSync(templateDir, destDir, { recursive: true });

  console.log();
  log.success('模板安装成功!');
  console.log();
  log.tree([
    'preview-template/',
    '  index.ejs',
    '  devtools/',
    '    assets/',
    '      index.js',
    '      style.css',
  ]);
  console.log();
  log.dim('  刷新浏览器预览即可使用 devtools。');
}
