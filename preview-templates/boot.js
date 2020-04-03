(function () {
    'use strict';

    // init device resolutions
    var devices = [
        { name: 'Apple iPhone 5', width: 320, height: 568, ratio: 2 },
        { name: 'Apple iPhone 6', width: 375, height: 667, ratio: 2 },
        { name: 'Apple iPhone 6 Plus', width: 414, height: 736, ratio: 3 },
        { name: 'Apple iPhone 7', width: 375, height: 667, ratio: 2 },
        { name: 'Apple iPhone 7 Plus', width: 414, height: 736, ratio: 3 },
        { name: 'Apple iPhone X', width: 375, height: 812, ratio: 3 },

        { name: 'Apple iPad', width: 1024, height: 768, ratio: 2 },
        { name: 'Apple iPad Air 2', width: 768, height: 1024, ratio: 2 },
        { name: 'Apple iPad Pro 10.5-inch', width: 834, height: 1112, ratio: 2 },
        { name: 'Apple iPad Pro 12.9-inch', width: 1024, height: 1366, ratio: 2 },

        { name: 'Huawei P9', width: 540, height: 960, ratio: 2 },
        { name: 'Huawei Mate9 Pro', width: 720, height: 1280, ratio: 2 },

        { name: 'Goolge Nexus 5', width: 360, height: 640, ratio: 3 },
        { name: 'Goolge Nexus 5X', width: 411, height: 731, ratio: 2.625 },
        { name: 'Goolge Nexus 6', width: 412, height: 732, ratio: 3.5 },
        { name: 'Goolge Nexus 7', width: 960, height: 600, ratio: 2 },
    ];

    var designWidth = _CCSettings.designWidth;
    var designHeight = _CCSettings.designHeight;

    var rotated = false;

    var canvas = document.getElementById('GameCanvas');
    window.onload = function () {
        if (window.__quick_compile__) {
            window.__quick_compile__.load(onload);
        }
        else {
            onload();
        }
    };

    function getEmulatedScreenSize () {
        var w, h;
        // var idx = optsDevice.value;
        var idx = '4';
        rotated = true;
        if ( idx === '0' ) {
            w = designWidth;
            h = designHeight;
        }
        else {
            var info = devices[parseInt(idx) - 1];
            w = info.width;
            h = info.height;
        }

        return {
            width: rotated ? h : w,
            height: rotated ? w : h
        };
    }

    function onload() {

        // socket
        // =======================

        // Receives a refresh event from the editor, which triggers the reload of the page
        var socket = window.io();
        socket.on('browser:reload', function () {
            window.location.reload();
        });
        socket.on('browser:confirm-reload', function () {
            var r = confirm('Reload?');
            if (r) {
                window.location.reload();
            }
        });

        function updateResolution () {
            var size = getEmulatedScreenSize();
            var gameDiv = document.getElementById('GameDiv');
            gameDiv.style.width = size.width + 'px';
            gameDiv.style.height = size.height + 'px';

            cc.view.setCanvasSize(size.width, size.height);
        }

        // init engine
        // =======================

        var AssetOptions = {
            libraryPath: 'res/import',
            rawAssetsBase: 'res/raw-',
            rawAssets: _CCSettings.rawAssets
        };

        // jsList
        var jsList = _CCSettings.jsList || [];
        jsList = jsList.map(function (x) { return AssetOptions.rawAssetsBase + x; });
        if (_CCSettings.jsBundleForWebPreview) {
            jsList.push(_CCSettings.jsBundleForWebPreview);
        }

        window.__modular.init(_CCSettings.scripts);
        jsList = jsList.concat(window.__modular.srcs);

        var option = {
            id: canvas,
            scenes: _CCSettings.scenes,
            debugMode: _CCSettings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
            showFPS: _CCSettings.debug,
            frameRate: 60,
            groupList: _CCSettings.groupList,
            collisionMatrix: _CCSettings.collisionMatrix,
            jsList: jsList
        };

        cc.AssetLibrary.init(AssetOptions);

        cc.game.run(option, function () {

            updateResolution();

            cc.view.enableRetina(true);
            cc.debug.setDisplayStats(true);

            // Loading splash scene
            // var splash = document.getElementById('splash');
            // var progressBar = splash.querySelector('.progress-bar span');

            cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
                // splash.style.display = 'none';
            });

            cc.game.pause();

            // load stashed scene
            cc.loader.load('preview-scene.json', function (error, json) {
                if (error) {
                    cc.error(error.stack);
                    return;
                }

                cc.loader.onProgress = function (completedCount, totalCount, item) {
                    var percent = 100 * completedCount / totalCount;
                    // if (progressBar) {
                    //     progressBar.style.width = percent.toFixed(2) + '%';
                    // }
                };

                cc.AssetLibrary.loadJson(json,
                    function (err, sceneAsset) {
                        if (err) {
                            cc.error(err.stack);
                            return;
                        }
                        var scene = sceneAsset.scene;
                        scene._name = sceneAsset._name;
                        cc.director.runSceneImmediate(scene, function () {
                            // play game
                            cc.game.resume();
                        });

                        cc.loader.onProgress = null;
                    }
                );
            });

            // purge
            //noinspection JSUnresolvedVariable
            _CCSettings = undefined;
        });
    };
})();

