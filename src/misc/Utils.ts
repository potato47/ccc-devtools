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
    }

    static getComponentName(component: any) {
        return component.__classname__;
    }

    static getComponents(ccNode: any) {
        return ccNode.components.map((component: any) => {
            return { name: component.__classname__, target: component }
        });
    }

}
