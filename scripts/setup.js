const fse = require('fs-extra');
const path = require('path');

const localTemplatePath = path.join(__dirname, '../release/preview-template');
const projectTemplatePath = 'C:/workspace/Administration/client';

if (!fse.existsSync(projectTemplatePath)) {
    console.error('project path not exist');
    return;
}
const targetPreviewTemplatePath = path.join(projectTemplatePath, 'preview-template');
const localDistPath = path.join(localTemplatePath, 'dist');
const targetDistPath = path.join(targetPreviewTemplatePath, 'dist');
const targetAssetsPath = path.join(targetDistPath, 'assets');

async function setupPreviewTemplate() {
    try {
        if (!fse.existsSync(targetPreviewTemplatePath)) {
            // 首次安装：完整复制 preview-template
            await fse.copy(localTemplatePath, targetPreviewTemplatePath, { overwrite: true });
            console.log('首次安装预览模板成功');
            return;
        }

        // 增量更新前：先清空 dist/assets，避免遗留历史 hash 文件
        if (fse.existsSync(targetAssetsPath)) {
            await fse.emptyDir(targetAssetsPath);
        }

        // 增量更新：只更新 dist，保留项目内自定义 index.ejs / worker / wasm 等文件
        await fse.copy(localDistPath, targetDistPath, { overwrite: true });
        console.log('更新 dist 成功（已清空 assets 并保留本地 preview-template 其他文件）');
    } catch (err) {
        console.error('更新预览模板失败', err);
    }
}

setupPreviewTemplate();