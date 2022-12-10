> 主干分支适用 Cocos Creator 3.4+ 版本，其他版本查看其他分支

# ccc-devtools

## 简介

ccc-devtools 是一款用于 Cocos Creator 网页端预览的调试工具，可以实时显示场景的节点树，并对节点属性进行同步更改。

![p1](https://user-images.githubusercontent.com/21299133/206861290-0bf8c74a-e8c6-435c-b17c-9949e4db6d55.gif)


## 使用

下载打包好的 [preview-template.zip](https://github.com/potato47/ccc-devtools/raw/master/release/preview-template.zip) 文件(release目录下)，解压到 Cocos Creator 项目目录下，刷新预览时的浏览器即可。
节点属性修改不赘述，重点介绍几个独特的小功能：

- 输出节点、组件引用到控制台，配合调试比较常用

![image](https://user-images.githubusercontent.com/21299133/206860999-bd0a3184-a692-45fe-ac5e-4e7361fa091c.png)

- 标记UI节点在场景中的位置

![image](https://user-images.githubusercontent.com/21299133/206854782-f74e8b3c-d804-4919-afb7-bef559719933.png)

- 调试信息独立显示，再也不怕浅背景看不清 FPS 了

![image](https://user-images.githubusercontent.com/21299133/206854791-3dcb52eb-5fa3-4157-b4dd-2a2d83932f5a.png)

## 开发

项目依据文档中自定义预览模板一节进行开发，未接触过相关概念可以先阅读一下官方文档
>自定义预览模板
预览支持自定义模板方便用户自定义需要的预览效果，自定义的预览模板可以放置在项目目录的 preview-template 文件夹中。或者点击编辑器主菜单中的 项目 -> 生成预览模板 就可以在项目目录下创建一个最新的预览模板。编辑器中的预览也是使用模板来注入最新的项目数据，预览时将会查找该目录下的 index 文件，如果存在就是要该文件作为预览的模板。
preview-template 文件夹的结构类似：  
project-folder  
 |--assets  
 |--build  
 |--preview-template  
 &nbsp;&nbsp;&nbsp;&nbsp;// 必须的入口文件  
 &nbsp;&nbsp;&nbsp;&nbsp;|--index.ejs  
 &nbsp;&nbsp;&nbsp;&nbsp;// 其他文件可根据想要实现的预览效果进行添加  

本项目主要修改index.ejs，注入一段 Vue 绑定的自定义html，核心修改见下图


![image](https://user-images.githubusercontent.com/21299133/206854643-41038621-1414-4518-a799-3c54d54e3e75.png)

在浏览器环境中 cc 是一个全局变量，可以通过 cc.director.getScene().children 获取场景中的节点，知道这点就可以开发了，剩下的就是节点数据如何展示出来的问题了。
技术栈为 Vue3 + ElementPlus + TypeScript + Vite，熟悉前端的朋友欢迎来仓库贡献。
项目结构如下：

![image](https://user-images.githubusercontent.com/21299133/206854626-03d127c8-6b26-4ae6-a1fa-1793e46b66e8.png)

项目开发需配合本地已有的 Cocos Creator 3.x 项目，将 ccc-devtools 克隆到本地后，打开scripts/setup.js，将 projectTemplatePath 改为你的本地测试 Creator 项目路径。

![image](https://user-images.githubusercontent.com/21299133/206854670-7e95c7bc-e5b9-4ca9-8feb-4470d5a81e2e.png)

开发流程：

- 安装依赖
`yarn`
 
- 修改代码
- 构建项目
`yarn build`
 
- 安装构建产物到项目
`yarn setup`
 
- 刷新浏览器查看效果

## 插件商店版

[插件版](https://store.cocos.com/app/detail/3922)自带了一份工具代码，提供了自动安装功能。适合多个项目快速安装、卸载工具。

![image](https://user-images.githubusercontent.com/21299133/206855136-cc8f2018-6844-4ae1-b2b4-5dbf016488dc.png)

## 备注

- 源码地址：https://github.com/potato47/ccc-devtools
- 打包文件：https://github.com/potato47/ccc-devtools/raw/master/release/preview-template.zip
- UI 组件库：https://element-plus.org
- 自定义网页预览文档：https://docs.cocos.com/creator/manual/zh/editor/preview/browser.html
- 插件地址：https://store.cocos.com/app/detail/3922
 
