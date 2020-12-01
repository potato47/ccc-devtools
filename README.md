# ccc-devtools v3.0.0
Cocos Creator 网页调试工具，运行时查看、修改节点树，实时更新节点属性，可视化缓存资源。

## 功能

- 场景节点树实时显示，节点、组件属性实时显示更改

![preview](./screenshots/preview1.gif)

- 可视化缓存资源

![preview](./screenshots/preview2.png)

- 标记场景中节点位置

![preview](./screenshots/preview3.png)

- 输出节点、组件引用到控制台

![preview](./screenshots/preview4.png)

- cc控制台功能扩展

![preview](./screenshots/preview5.png)

## 全局使用

Cocos Creator 3.0暂不支持全局使用

## 项目使用

- `cd PROJECT_PATH && git clone -b v3.0.0 https://github.com/potato47/ccc-devtools.git preview-template`
- 或者手动将本项目对应分支下载到项目目录后，将名字改为 `preview-template`

## 自定义

- 本项目使用了 vue 和 vuetify，可根据 [vuetify 文档](https://vuetifyjs.com/en/getting-started/quick-start/) 对页面进行修改

- 节点、组件显示属性可在 `config.js` 里配置，目前支持 text，number，textarea，color，bool 几种类型

## 需求、更新

https://github.com/potato47/ccc-devtools

如果没有更改源码，可直接在目录下 git pull

论坛讨论地址：https://forum.cocos.com/t/creator-20190201/71578

## 贡献指南

- 版本号命名规则 https://semver.org/lang/zh-CN/ ,简单来讲，新功能第二位加一，修复bug第三位加一

- 如果新增功能请在README中添加预览截图说明

- 记得更新version.json中的版本号

## 前人种树

- https://github.com/vuejs/vue

- https://github.com/vuetifyjs/vuetify
