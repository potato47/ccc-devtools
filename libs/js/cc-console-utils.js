const initConsoleUtil = function () {
    if (cc.tree) return;
    cc.tree = function (key) {
        let index = key || 0;
        let treeNode = function (node) {
            let nameStyle =
                `color: ${node.parent === null || node.activeInHierarchy ? 'green' : 'grey'}; font-size: 14px;font-weight:bold`;
            let propStyle =
                `color: black; background: lightgrey;margin-left: 5px;border-radius:3px;padding: 0 3px;font-size: 10px;font-weight:bold`;
            let indexStyle =
                `color: orange; background: black;margin-left: 5px;border-radius:3px;padding:0 3px;fonrt-size: 10px;font-weight:bold;`
            let nameValue = `%c${node.name}`;
            let propValue =
                `%c${node.x.toFixed(0) + ',' + node.y.toFixed(0) + ',' + node.width.toFixed(0) + ',' + node.height.toFixed(0) + ',' + node.scale.toFixed(1)}`
            let indexValue = `%c${index++}`;
            if (node.childrenCount > 0) {
                console.groupCollapsed(nameValue + propValue + indexValue, nameStyle,
                    propStyle, indexStyle);
                for (let i = 0; i < node.childrenCount; i++) {
                    treeNode(node.children[i]);
                }
                console.groupEnd();
            } else {
                console.log(nameValue + propValue + indexValue, nameStyle, propStyle,
                    indexStyle);
            }
        }
        if (key) {
            let node = cc.cat(key);
            index = node['tempIndex'];
            treeNode(node);
        } else {
            let scene = cc.director.getScene();
            treeNode(scene);
        }
        return '属性依次为x,y,width,height,scale.使用cc.cat(id)查看详细属性.';
    }
    cc.cat = function (key) {
        let index = 0;
        let target;
        let sortId = function (node) {
            if (target) return;
            if (cc.js.isNumber(key)) {
                if (key === index++) {
                    target = node;
                    return;
                }
            } else {
                if (key.toLowerCase() === node.name.toLowerCase()) {
                    target = node;
                    return;
                } else {
                    index++;
                }
            }
            if (node.childrenCount > 0) {
                for (let i = 0; i < node.childrenCount; i++) {
                    sortId(node.children[i]);
                }
            }
        }
        let scene = cc.director.getScene();
        sortId(scene);
        target['tempIndex'] = cc.js.isNumber(key) ? key : index;
        return target;
    }
    cc.list = function (key) {
        let targets = [];
        let step = function (node) {
            if (node.name.toLowerCase().indexOf(key.toLowerCase()) > -1) {
                targets.push(node);
            }
            if (node.childrenCount > 0) {
                for (let i = 0; i < node.childrenCount; i++) {
                    step(node.children[i]);
                }
            }
        }
        let scene = cc.director.getScene();
        step(scene);
        if (targets.length === 1) {
            return targets[0];
        } else {
            return targets;
        }
    }
    cc.where = function (key) {
        let target = key.name ? key : cc.cat(key);
        if (!target) {
            return null;
        }
        let rect = target.getBoundingBoxToWorld();
        let bgNode = new cc.Node();
        let graphics = bgNode.addComponent(cc.Graphics);
        let scene = cc.director.getScene();
        scene.addChild(bgNode);
        bgNode.position = rect.center;
        bgNode.group = target.group;
        bgNode.zIndex = cc.macro.MAX_ZINDEX;
        let isZeroSize = rect.width === 0 || rect.height === 0;
        if (isZeroSize) {
            graphics.circle(0, 0, 100);
            graphics.fillColor = cc.Color.GREEN;
            graphics.fill();
        } else {
            bgNode.width = rect.width;
            bgNode.height = rect.height;
            graphics.rect(-bgNode.width / 2, -bgNode.height / 2, bgNode.width, bgNode.height);
            graphics.fillColor = new cc.Color().fromHEX('#E91E6390');
            graphics.fill();
        }
        setTimeout(() => {
            if (cc.isValid(bgNode)) {
                bgNode.destroy();
            }
        }, 2000);
        return target;
    }
    cc.cache = function () {
        let rawCacheData = cc.assetManager.assets._map;
        let cacheData = [];
        let totalTextureSize = 0;
        for (let k in rawCacheData) {
            let item = rawCacheData[k];
            if (item.type !== 'js' && item.type !== 'json') {
                let itemName = '_';
                let preview = '';
                let content = item.__classname__;
                let formatSize = -1;
                if (item.type === 'png' || item.type === 'jpg') {
                    let texture = rawCacheData[k.replace('.' + item.type, '.json')];
                    if (texture && texture._owner && texture._owner._name) {
                        itemName = texture._owner._name;
                        preview = texture.content.url;
                    }
                } else {
                    if (item.name) {
                        itemName = item.name;
                    } else if (item._owner) {
                        itemName = (item._owner && item._owner.name) || '_';
                    }
                    if (content === 'cc.Texture2D') {
                        preview = item.nativeUrl;
                        let textureSize = item.width * item.height * ((item._native === '.jpg' ? 3 : 4) / 1024 / 1024);
                        totalTextureSize += textureSize;
                        // sizeStr = textureSize.toFixed(3) + 'M';
                        formatSize = Math.round(textureSize * 1000) / 1000;
                    } else if (content === 'cc.SpriteFrame') {
                        preview = item._texture.nativeUrl;
                    }
                }
                cacheData.push({
                    queueId: item.queueId,
                    type: content,
                    name: itemName,
                    preview: preview,
                    id: item._uuid,
                    size: formatSize
                });
            }
        }
        let cacheTitle = `缓存 [文件总数:${cacheData.length}][纹理缓存:${totalTextureSize.toFixed(2) + 'M'}]`;
        return [cacheData, cacheTitle];
    }
}