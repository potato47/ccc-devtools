/* eslint-disable no-undef */
const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: { dark: true }
    }),
    data: {
        drawer: false,
        loading: true,
        nodes: [],
        intervalId: -1,
        search: null,
        node: null,
        nodeSchema: {},
        componentsSchema: [],
    },
    created() {
        // this.$vuetify.theme.dark = true;
        this.updateTree();
    },
    computed: {
        filter() {
            return (item, search, textKey) => item[textKey].indexOf(search) > -1;
        },
    },
    methods: {
        showTree: function () {
            if (!this.$data.drawer || !window.cc || !cc.director.getScene() || !cc.director.getScene().children) return;
            this.$data.nodes = getChildren(cc.director.getScene());
        },
        updateTree: function () {
            this.$data.intervalId = setInterval(() => {
                this.showTree();
            }, 200);
        },
        stopUpdateTree: function () {
            clearInterval(this.$data.intervalId);
        },
        handleNodeClick(node) {
            console.log(node);
            return;
            if (node) {
                this.$data.node = node;
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
                    if (this.$data && this.$data.node === node) {
                        this.$data.node = null;
                    }
                }
                this.$data.nodeSchema = this.$data.is3DNode ? NEX_CONFIG.nodeSchema.node3d : NEX_CONFIG
                    .nodeSchema.node2d;
                let componentsSchema = [];
                for (let component of node._components) {
                    let schema = NEX_CONFIG.componentsSchema[component.__classname__];
                    if (schema) {
                        node[schema.key] = node.getComponent(schema.key);
                        for (let i = 0; i < schema.rows.length; i++) {
                            for (let j = 0; j < schema.rows[i].length; j++) {
                                if (schema.rows[i][j].type === 'color') {
                                    if (!node[schema.key][schema.rows[i][j].field]) {
                                        cc.js.getset(node[schema.key], schema.rows[i][j].field, () => {
                                            return '#' + node.getComponent(schema.key)[schema.rows[i][j]
                                                .rawField].toHEX('#rrggbb');
                                        }, (hex) => {
                                            node.getComponent(schema.key)[schema.rows[i][j].rawField] =
                                                new cc.Color().fromHEX(hex);
                                        }, false, true);
                                    }
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
                this.$data.componentsSchema = componentsSchema;
            } else {
                this.$data.node = null;
            }
        },
    }
});

function getChildren(node) {
    return node.children.map(child => {
        let children = (child.children && child.children.length > 0) ? getChildren(child) : [];
        return { id: child._id, name: child.name, active: child.activeInHierarchy, children };
    });
}
