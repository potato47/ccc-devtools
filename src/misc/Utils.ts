// @ts-nocheck
export default class Utils {

    static checkNodeValid(ccNode: any) {
        // @ts-ignore
        return ccNode && cc.isValid(ccNode)
    }

    static outputToConsole(target: any) {
        let i = 1;
        // @ts-ignore
        while (window['temp' + i] !== undefined) {
            i++;
        }
        // @ts-ignore
        window['temp' + i] = target;
        console.log('temp' + i);
        // @ts-ignore
        console.log(window['temp' + i]);
        this.copyToClipboard('temp' + i)
    }

    static async copyToClipboard(text: string) {
        try {
            // 使用 Clipboard API（现代浏览器）
            await navigator.clipboard.writeText(text);
            console.log('已通过 Clipboard API 复制到剪贴板:', text);
        } catch (err) {
            // 回退到 execCommand（旧浏览器）
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            console.log('已通过 execCommand 回退复制到剪贴板:', text);
        }
    };


    static drawNodeRect(target: any) {
        let rect;
        let transform = target.getComponent(cc.UITransformComponent);
        if (transform) {
            rect = this.getSelfBoundingBoxToWold(transform);
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

    static getComponentName(component: any) {
        return component.__classname__;
    }

    static getComponents(ccNode: any) {
        return ccNode.components.map((component: any) => {
            return { name: component.__classname__, target: component }
        });
    }

    static getSelfBoundingBoxToWold(transform: any) {
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

}
