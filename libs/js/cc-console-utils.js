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
                `%c${node.position.x.toFixed(0) + ',' + node.position.y.toFixed(0)}`
            let indexValue = `%c${index++}`;
            if (node.children.length > 0) {
                console.groupCollapsed(nameValue + propValue + indexValue, nameStyle,
                    propStyle, indexStyle);
                for (let i = 0; i < node.children.length; i++) {
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
            if (node.children.length > 0) {
                for (let i = 0; i < node.children.length; i++) {
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
            if (node.children.length > 0) {
                for (let i = 0; i < node.children.length; i++) {
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
        let rect;
        let transform = target.getComponent(cc.UITransformComponent);
        if (transform) {
            rect = getSelfBoundingBoxToWold(transform);
        } else {
            let worldPos = cc.v3();
            target.getWorldPosition(worldPos);
            rect = cc.rect(worldPos.x, worldPos.y, 0, 0);
        }
        let canvasNode = new cc.Node('Canvas');
        let scene = cc.director.getScene();
        scene.addChild(canvasNode);
        canvasNode.addComponent(cc.Canvas);
        let bgNode = new cc.Node();
        let graphics = bgNode.addComponent(cc.GraphicsComponent);
        let bgTransform = bgNode.addComponent(cc.UITransformComponent);
        canvasNode.addChild(bgNode);
        let centerPos = cc.v3(rect.center.x, rect.center.y, 0);
        let localPos = cc.v3();
        canvasNode.getComponent(cc.UITransformComponent).convertToNodeSpaceAR(centerPos, localPos);
        bgNode.setPosition(localPos);
        bgNode.layer = target.layer;
        let isZeroSize = rect.width === 0 || rect.height === 0;
        if (isZeroSize) {
            graphics.circle(0, 0, 100);
            graphics.fillColor = cc.Color.GREEN;
            graphics.fill();
        } else {
            bgTransform.width = rect.width;
            bgTransform.height = rect.height;
            graphics.rect(-bgTransform.width / 2, -bgTransform.height / 2, bgTransform.width, bgTransform.height);
            graphics.fillColor = new cc.Color().fromHEX('#E91E6390');
            graphics.fill();
        }
        setTimeout(() => {
            if (cc.isValid(canvasNode)) {
                canvasNode.destroy();
            }
        }, 2000);
        return target;
    }
    cc.cache = function () {
        let rawCacheData = cc.loader._cache;
        let cacheData = [];
        let totalTextureSize = 0;
        for (let k in rawCacheData) {
            let item = rawCacheData[k];
            let preview = '';
            let type = item.__classname__;
            let formatSize = -1;
            if (type === 'cc.Texture2D') {
                let image = item.mipmaps[0]
                preview = image.url;
                let textureSize = image.width * image.height * ((image._native === '.jpg' ? 3 : 4) / 1024 / 1024);
                totalTextureSize += textureSize;
                // sizeStr = textureSize.toFixed(3) + 'M';
                formatSize = Math.round(textureSize * 1000) / 1000;
            }
            cacheData.push({
                type: type,
                preview: preview,
                id: item._uuid,
                size: formatSize
            });
        }
        let cacheTitle = `缓存 [文件总数:${cacheData.length}][纹理缓存:${totalTextureSize.toFixed(2) + 'M'}]`;
        return [cacheData, cacheTitle];
    }
}

function getSelfBoundingBoxToWold(transform) {
    let _worldMatrix = cc.mat4();
    if (transform.node.parent) {
        transform.node.parent.getWorldMatrix(_worldMatrix);
        let parentMat = _worldMatrix;
        let _matrix = cc.mat4();
        cc.Mat4.fromRTS(_matrix, transform.node.getRotation(), transform.node.getPosition(), transform.node.getScale());
        const width = transform._contentSize.width;
        const height = transform._contentSize.height;
        const rect = cc.rect(-transform._anchorPoint.x * width, -transform._anchorPoint.y * height, width, height);
        cc.Mat4.multiply(_worldMatrix, parentMat, _matrix);
        rect.transformMat4(_worldMatrix);
        return rect;
    } else {
        return transform.getBoundingBox();
    }
}
