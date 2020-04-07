# ccc-devtools v3.0.0
Cocos Creator 网页调试工具，运行时查看、修改节点树，实时更新节点属性。

## 预览

![preview](./screenshots/preview.png)

## 功能

1.场景节点树实时显示
2.搜索节点
3.节点、组件属性实时显示更改
4.圈出节点位置
5.输出节点、组件引用到控制台

## 使用

1. 点击 Creator 右上角进入编辑器 resources 目录，再依次进入`static/preview-templates`目录

   ![t1](./screenshots/t1.png)

2. 将本项目clone到上面的目录下,**如果使用下载压缩包的方式记得把后缀名-master去掉**

   ![t2](./screenshots/t2.png)

3. 打开`index.jade`,找到`body`里最后一个`div`，在下面添加`include ./ccc-devtools/index.html`，**注意用tab键与上面的div对齐**


## 已知问题

- 当升级 Cococs Creator 时会清空resources目录，需要重新下载配置，如自定义了一些配置，请做好备份。
- 开启节点树会增加渲染消耗，非调试阶段请关闭。

## 需求、更新

https://github.com/potato47/ccc-devtools

如果没有更改源码，可直接在目录下 git pull

论坛讨论地址：https://forum.cocos.com/t/creator-20190201/71578

## 贡献指南

- 版本号命名规则 https://semver.org/lang/zh-CN/ ,简单来讲，新功能第二位加一，修复bug第三位加一
- 如果新增功能请在README中添加预览截图说明
- 记得更新version.json中的版本号

## 本项目依赖以下开源项目

https://github.com/vuejs/vue

https://github.com/ElemeFE/element

https://github.com/iview/iview

https://github.com/FE-Driver/vue-beauty

https://github.com/mrdoob/stats.js
