# ccc-devtools v1.2.5
Cocos Creator 网页调试器，运行时查看、修改节点树，实时更新节点属性。

## TODO

- [x] 拖拽布局
- [x] 节点搜索
- [x] 实时刷新节点信息
- [x] 拖动节点更改层级
- [x] 开关
- [x] 控制台输出节点信息
- [ ] 自定义布局等配置
- [ ] 组件信息

## 预览

![preview](./screenshots/preview.gif)

v1.1.0: 拖拽节点，增加开关

![t5](./screenshots/t4.gif)

v1.2.0: 控制台输出节点信息

![t6](./screenshots/t5.png)

## 使用

1. 点击 Creator 右上角进入编辑器 resources 目录，再依次进入`static/preview-templates`目录

   ![t1](./screenshots/t1.png)

2. 将本项目clone到上面的目录下

   ![t2](./screenshots/t2.png)

3. 打开`index.jade`,找到`body`里最后一个`div`，在下面添加`include ./ccc-devtools/index.html`，**注意用tab键与上面的div对齐**

   ![t3](./screenshots/t3.png)


## 已知问题

- 当有大量节点动态加载时，可能需要手动点击一下右上角的刷新按钮来重载节点树。
- 当升级 Cococs Creator 时会清空resources目录，需要重新下载配置，如自定义了一些配置，请做好备份。

## 需求、更新

https://github.com/potato47/ccc-devtools