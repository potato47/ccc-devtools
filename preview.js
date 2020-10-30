const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: { dark: true }
    }),
    data: {
        isShowTop: true,
        drawer: false,
        cacheDialog: false,
        cacheTitle: '',
        cacheHeaders: [
            { text: 'Type', value: 'type' },
            { text: 'Name', value: 'name' },
            { text: 'Preivew', value: 'preview' },
            { text: 'ID', value: 'id' },
            { text: 'Size', value: 'size' },
        ],
        cacheRawData: [],
        cacheData: [],
        cacheSearchText: null,
        cacheOnlyTexture: true,
        treeData: [],
        selectedNodes: [],
        intervalId: -1,
        treeSearchText: null,
        nodeSchema: {},
        componentsSchema: [],
    },
    created() {
        if (window.innerHeight === window.outerHeight) { // 手机端，chrome device模式
            this.isShowTop = false;
        }
        this.waitCCInit().then(() => {
            if (this.isShowTop) {
                this.startUpdateTree();
            }
            initConsoleUtil();
        });
    },
    watch: {
        cacheOnlyTexture() {
            this.updateCacheData();
        }
    },
    computed: {
        treeFilter() {
            return (item, search, textKey) => item[textKey].indexOf(search) > -1;
        },
        selectedNode() {
            if (!this.selectedNodes.length) return undefined
            let node = getNodeById(this.selectedNodes[0]);
            if (node) {
                if (!node.hex_color) {
                    cc.js.getset(node, 'hex_color', () => {
                        return '#' + node.color.toHEX('#rrggbb');
                    }, (hex) => {
                        node.color = new cc.Color().fromHEX(hex);
                    }, false, true);
                }

                let superPreLoad = node._onPreDestroy;
                node._onPreDestroy = () => {
                    superPreLoad.apply(node);
                    if (this.selectedNodes.length > 0 && this.selectedNodes[0] === node._id) {
                        this.selectedNodes.pop();
                    }
                }
                this.nodeSchema = NEX_CONFIG.nodeSchema.node2d;
                let componentsSchema = [];
                for (let component of node._components) {
                    let schema = NEX_CONFIG.componentsSchema[component.__classname__];
                    if (schema) {
                        node[schema.key] = node.getComponent(schema.key);
                        for (let i = 0; i < schema.rows.length; i++) {
                            if (schema.rows[i].type === 'color') {
                                if (!node[schema.key][schema.rows[i].key]) {
                                    cc.js.getset(node[schema.key], schema.rows[i].key, () => {
                                        return '#' + node.getComponent(schema.key)[schema.rows[i].rawKey].toHEX('#rrggbb');
                                    }, (hex) => {
                                        node.getComponent(schema.key)[schema.rows[i].rawKey] = new cc.Color().fromHEX(hex);
                                    }, false, true);
                                }
                            }
                        }
                    } else {
                        schema = {
                            title: component.__classname__,
                            key: component.__classname__
                        };
                        node[schema.key] = node.getComponent(schema.key);
                    }
                    componentsSchema.push(schema);
                }
                this.componentsSchema = componentsSchema;
            }
            return node;
        },
    },
    methods: {
        waitCCInit() {
            return new Promise((resolve, reject) => {
                let id = setInterval(() => {
                    if (window.cc) {
                        resolve();
                        clearInterval(id);
                    }
                }, 500);
            });
        },
        refreshTree: function () {
            if (!this.$data.drawer || !window.cc || !cc.director.getScene() || !cc.director.getScene().children) return;
            this.$data.treeData = getChildren(cc.director.getScene());
        },
        startUpdateTree: function () {
            this.$data.intervalId = setInterval(() => {
                this.refreshTree();
            }, 200);
        },
        stopUpdateTree: function () {
            clearInterval(this.$data.intervalId);
        },
        outputNodeHandler(id) {
            let i = 1;
            while (window['temp' + i] !== undefined) {
                i++;
            }
            window['temp' + i] = this.selectedNode;
            console.log('temp' + i);
            console.log(window['temp' + i]);
        },
        outputComponentHandler(component) {
            let i = 1;
            while (window['temp' + i] !== undefined) {
                i++;
            }
            window['temp' + i] = this.selectedNode.getComponent(component);
            console.log('temp' + i);
            console.log(window['temp' + i]);
        },
        drawNodeRect() {
            cc.where(this.selectedNode);
        },
        updateCacheData() {
            if (this.$data.cacheOnlyTexture) {
                this.$data.cacheData = this.$data.cacheRawData.filter(item => item.type === 'cc.Texture2D');
            } else {
                this.$data.cacheData = this.$data.cacheRawData;
            }
        },
        openCacheDialog() {
            [this.$data.cacheRawData, this.$data.cacheTitle] = cc.cache();
            this.updateCacheData();
            this.$data.cacheDialog = true;
        },
        openGithub() {
            window.open('https://github.com/potato47/ccc-devtools');
        },
        openCocosForum() {
            window.open('https://forum.cocos.com/');
        },
        openCocosDocs() {
            window.open('https://docs.cocos.com/');
        }
    }
});

function getChildren(node) {
    return node.children.map(child => {
        let children = (child.children && child.children.length > 0) ? getChildren(child) : [];
        return { id: child._id, name: child.name, active: child.activeInHierarchy, children };
    });
}

function getNodeById(id) {
    let target;
    const search = function (node) {
        if (node._id === id) {
            target = node;
            return;
        }
        if (node.childrenCount) {
            for (let i = 0; i < node.childrenCount; i++) {
                if (!target) {
                    search(node.children[i]);
                }
            }
        }
    }
    const scene = cc.director.getScene();
    search(scene);
    return target;
}
