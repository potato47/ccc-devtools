let app = new Vue({
    el: '#app',
    data: {
        needUpdate: false,
        is3DNode: false,
        isDevMode: false,
        isShowProfile: false,
        isShowCache: false,
        isAutoRefreshTree: true,
        isDarkTheme: false,
        filterText: '',
        splitLeft: 0.7,
        splitRight: 0.5,
        defaultExpandedKeys: [],
        sceneTreeData: [],
        nodeProps: {
            children: 'children',
            label: 'name',
            isLeaf: 'leaf'
        },
        node: null,
        nodeSchema: {},
        componentsSchema: [],
        intervalId: -1,
        cacheTitle: '缓存',
        cacheColumns: [{
            title: 'Type',
            key: 'content',
            width: 150,
            align: 'center',
            filters: [{
                label: 'png',
                value: 'png'
            }, {
                label: 'jpg',
                value: 'jpg'
            }, {
                label: 'cc.Texture2D',
                value: 'cc.Texture2D'
            }, {
                label: 'cc.SpriteFrame',
                value: 'cc.SpriteFrame'
            }, {
                label: 'cc.Sprite',
                value: 'cc.Sprite'
            }, {
                label: 'cc.Prefab',
                value: 'cc.Prefab'
            }, {
                label: 'cc.AnimationClip',
                value: 'cc.AnimationClip'
            }],
            filterMultiple: false,
            filterMethod(value, row) {
                return row.content === value;
            }
        }, {
            title: 'Name',
            key: 'name',
            width: 220,
            align: 'center',
            sortable: true
        }, {
            title: 'Size',
            slot: 'cache_size',
            key: 'size',
            align: 'center',
            width: 120,
            sortable: true
        }, {
            title: 'Preview',
            slot: 'cache_preview',
            align: 'center',
            width: 150
        }, {
            title: 'Queue',
            key: 'queueId',
            sortable: true,
            width: 120,
            align: 'center'
        }, {
            title: 'Action',
            slot: 'cache_action',
            width: 150,
            align: 'center',
            fixed: 'right'
        }],
        cacheData: [],
        cacheDataLoading: false
    },
    methods: {
        api: function (url, cb) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    let response = xhr.responseText;
                    cb(JSON.parse(xhr.responseText));
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        },
        compareVersion: function (localVersion, remoteVersion) {
            let vL = localVersion.split('.');
            let vR = remoteVersion.split('.');
            for (let i = 0; i < vL.length; ++i) {
                let a = parseInt(vL[i], 10);
                let b = parseInt(vR[i] || '0', 10);
                if (a === b) {
                    continue;
                } else if (a > b) {
                    return false;
                } else if (a < b) {
                    return true;
                }
            }
            if (vR.length > vL.length) {
                return true;
            } else {
                return false;
            }
        },
        checkVersion: function () {
            this.api('https://raw.githubusercontent.com/potato47/ccc-devtools/master/version.json', (
                data) => {
                let remoteVersion = data.version;
                this.api('app/editor/static/preview-templates/ccc-devtools/version.json', (
                    data) => {
                    let localVersion = data.version;
                    versionStatus = this.compareVersion(localVersion, remoteVersion);
                    this.$data.needUpdate = versionStatus;
                    console.groupCollapsed('ccc-devtoos')
                    console.log('本地版本：' + localVersion);
                    console.log('远程版本：' + remoteVersion);
                    console.log('更新地址：' + 'https://github.com/potato47/ccc-devtools.git');
                    console.groupEnd('ccc-devtoos');
                });
            });
        },
        handleRefreshTree() {
            this.$data.sceneTreeData = [];
            setTimeout(() => {
                this.updateTreeData();
            }, 0);
        },
        handleSwitchTreeMode() {

        },
        updateTreeData() {
            this.$data.sceneTreeData = cc.director.getScene().children;
            this.defaultExpandedKeys = [this.$data.sceneTreeData[0]._id];
        },
        handleNodesSelect(nodes) {
            if (nodes.length === 1) {
                this.handleNodeClick(nodes[0]);
            } else {
                this.handleNodeClick(null);
            }
        },
        handleNodeClick(node) {
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
        outputNodeHandler(target) {
            let i = 1;
            while (window['temp' + i] !== undefined) {
                i++;
            }
            window['temp' + i] = this.$data.node;
            console.log('temp' + i);
            console.log(window['temp' + i]);
        },
        outputComponentHandler(data) {
            let i = 1;
            while (window['temp' + i] !== undefined) {
                i++;
            }
            window['temp' + i] = this.$data.node.getComponent(data);
            console.log('temp' + i);
            console.log(window['temp' + i]);
        },
        drawNodeRect(node) {
            cc.where(this.$data.node);
        },
        releaseCacheItem(id) {
            console.log('resease item ', id);
            cc.loader.release(id);
        },
        showCacheItem(id) {
            console.log(cc.loader._cache[id]);
        },
        openGithub() {
            window.open('https://github.com/potato47/ccc-devtools');
        },
        filterNode(value, node) {
            if (!value) return true;
            return node.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        },
        openCachePanel() {
            this.$data.cacheDataLoading = true;
            setTimeout(() => {
                let rawCacheData = cc.loader._cache;
                let cacheData = [];
                let totalTextureSize = 0;
                for (let k in rawCacheData) {
                    let item = rawCacheData[k];
                    // console.log(item)
                    if (item.type !== 'js' && item.type !== 'json') {
                        let itemName = '_';
                        let preview = '';
                        let content = item.content.__classname__ ? item.content.__classname__ : item.type;
                        let formatSize = -1;
                        if (item.type === 'png' || item.type === 'jpg') {
                            let texture = rawCacheData[k.replace('.' + item.type, '.json')];
                            if (texture && texture._owner && texture._owner._name) {
                                itemName = texture._owner._name;
                                preview = texture.content.url;
                            }
                        } else {
                            if (item.content.name && item.content.name.length > 0) {
                                itemName = item.content.name;
                            } else if (item._owner) {
                                itemName = item._owner.name || '_';
                            }
                            if (content === 'cc.Texture2D') {
                                let texture = item.content;
                                preview = texture.url;
                                let textureSize = texture.width * texture.height * ((texture._native === '.jpg' ? 3 : 4) / 1024 / 1024);
                                totalTextureSize += textureSize;
                                // sizeStr = textureSize.toFixed(3) + 'M';
                                formatSize = Math.round(textureSize * 1000) / 1000;
                            } else if (content === 'cc.SpriteFrame') {
                                preview = item.content._texture.url;
                            }
                        }
                        cacheData.push({
                            queueId: item.queueId,
                            type: item.type,
                            name: itemName,
                            preview: preview,
                            id: item.id,
                            content: content,
                            size: formatSize
                        });
                    }
                }
                this.$data.cacheData = cacheData;
                this.$data.cacheTitle = `缓存 [文件总数:${cacheData.length}][纹理缓存:${totalTextureSize.toFixed(2) + 'M'}]`;
                this.$data.cacheDataLoading = false;
            }, 0);

        },
        closeCachePanel() {
            this.$data.cacheData = [];
            this.$data.cacheTitle = `缓存`;
        },
        openDevMode() {
            setTimeout(() => {
                if (!cc.Node.prototype.isLeaf) {
                    cc.js.getset(cc.Node.prototype, 'isLeaf', function () {
                        return this.childrenCount === 0;
                    }, function (value) {

                    }, false, true);
                }

                let top = document.getElementById('top')
                top.appendChild(document.getElementsByClassName('toolbar')[0]);
                document.getElementById('game_panel').appendChild(document.getElementById('content'));
                let scene = cc.director.getScene();
                if (scene) {
                    this.updateTreeData();
                }
                cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, () => {
                    this.updateTreeData();
                }, this);
                cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, () => {
                    this.$data.node = null;
                    this.$data.sceneTreeData = [];
                    this.$data.treeParam = [];
                }, this);
                localStorage.setItem('isDevMode', 1);
            }, 0);
        },
        closeDevMode() {
            this.$data.node = null;
            this.$data.sceneTreeData = [];
            cc.director.targetOff(this);
            clearInterval(this.$data.intervalId);
            document.body.appendChild(document.getElementsByClassName('toolbar')[0]);
            document.body.appendChild(document.getElementById('content'));
            localStorage.setItem('isDevMode', 0);
        },
        handleChangeNodeSchema() {
            if (this.is3DNode) {
                this.is3DNode = false;
            } else {
                this.is3DNode = true;
            }
            this.$data.nodeSchema = this.$data.is3DNode ? NEX_CONFIG.nodeSchema.node3d : NEX_CONFIG.nodeSchema
                .node2d;
        },
        handleChangeMode(data) {
            data ? this.openDevMode() : this.closeDevMode();
        },
        handleChangeCachePanel(data) {
            data ? this.openCachePanel() : this.closeCachePanel();
        },
        handleChangeStats() {
            if (this.$data.isShowProfile) {
                let addStats = function (stats) {
                    stats.dom.style.position = 'relative';
                    stats.dom.style.float = 'right';
                    stats.dom.style.marginLeft = '10px';
                    stats.dom.style.marginBottom = '10px';
                    // stats.dom.style.pointerEvents = 'none';
                    stats.dom.className = 'statsPanel';
                    document.getElementById('panelCtl').appendChild(stats.dom);
                    localStorage.setItem('isShowProfile', '1')
                }
                let animate = () => {
                    if (this.$data.isShowProfile) {
                        stats.update();
                        requestAnimationFrame(animate);
                    }
                }
                let stats = new Stats();
                addStats(stats);
                animate();
            } else {
                let panels = document.getElementsByClassName('statsPanel');
                while (panels.length > 0) {
                    panels[0].parentElement.removeChild(panels[0]);
                }
                localStorage.setItem('isShowProfile', '0');
            }

        },
        handleChangeTheme(isDark) {
            isDark ? this.addDarkTheme() : this.removeDarkTheme();
        },
        // 添加暗色主题
        addDarkTheme() {
            let link = document.createElement('link');
            link.type = 'text/css';
            link.id = "theme-css-dark";
            link.rel = 'stylesheet';
            link.href = 'app/editor/static/preview-templates/ccc-devtools/css/themes/dark.css';
            document.getElementsByTagName("head")[0].appendChild(link);
            localStorage.setItem('isDarkTheme', 1);
        },
        // 删除暗色主题
        removeDarkTheme() {
            document.getElementById('theme-css-dark').remove();
            localStorage.setItem('isDarkTheme', 0);
        },
        fitFullScreen() {
            document.getElementsByClassName('toolbar')[0].style.display = 'none';
            let gameDiv = document.getElementById('GameDiv');
            let gameContainer = document.getElementById('Cocos2dGameContainer');
            let gameCanvas = document.getElementById('GameCanvas');
            gameDiv.style.width = '100%';
            gameDiv.style.height = '100%';
            gameCanvas.style.width = '100%';
            gameCanvas.style.height = '100%';
            // document.body.style.cssText+="-webkit-transform: rotate(-90deg);-moz-transform: rotate(-90deg)";
        },
        initConsoleUtil() {
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
                let borderNode = new cc.Node();
                let bgNode = new cc.Node();
                let graphics = bgNode.addComponent(cc.Graphics);
                let canvas = cc.find('Canvas');
                canvas.addChild(bgNode);
                bgNode.addChild(borderNode);
                bgNode.position = canvas.convertToNodeSpaceAR(rect.center);
                let isZeroSize = rect.width === 0 || rect.height === 0;
                if (isZeroSize) {
                    graphics.circle(0, 0, 100);
                    graphics.fillColor = cc.Color.GREEN;
                    graphics.fill();
                } else {
                    bgNode.width = rect.width;
                    bgNode.height = rect.height;
                    graphics.rect(-bgNode.width / 2, -bgNode.height / 2, bgNode.width, bgNode.height);
                    graphics.strokeColor = cc.Color.RED;
                    graphics.lineWidth = 10;
                    graphics.stroke()
                }
                setTimeout(() => {
                    if (cc.isValid(bgNode)) {
                        bgNode.destroy();
                    }
                }, 2000);
                return target;
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.sceneTree.filter(val);
            // console.log(val);
        }
    },
    created: function () {
        this.checkVersion();
        document.body.insertBefore(document.getElementById('app'), document.body.firstChild);

        let onCCInit = () => {
            this.initConsoleUtil();
            if (cc.sys.isMobile) {
                this.fitFullScreen();
            }
            if (localStorage.getItem('isDevMode') === '1') {
                this.$data.isDevMode = true;
                this.openDevMode();
            } else {
                this.$data.isDevMode = false;
            }
            if (localStorage.getItem('isDarkTheme') === '1') {
                this.$data.isDarkTheme = true;
                this.addDarkTheme();
            } else {
                this.$data.isDarkTheme = false;
            }
            this.$data.isShorProfile = localStorage.getItem('isShorProfile') === '1';
            setTimeout(() => {
                this.handleChangeStats();
            }, 0);
        }
        let checkCC = () => {
            if (window.cc && window.cc.director) {
                onCCInit();
                clearInterval(this.$data.intervalId);
            } else {
                // console.log('cc is not init');
            }
        }
        this.$data.intervalId = setInterval(checkCC, 500);
        setTimeout(checkCC, 0);
    },
});