/**
 * @namespace webvn.canvas
 */
webvn.module('canvas', function (Class, exports) {
    "use strict";
    var renderer = exports.renderer = Class.module(function () {
        var exports = {};

        var requestAnim = window.requestAnimationFrame;

        var isPaused = true;

        var scenes = [];

        var len = 0, i;

        function render(timestamp) {
            if (isPaused) {
                return;
            }

            for (i = 0; i < len; i++) {
                if (scenes[i].change()) {
                    scenes[i].render(timestamp);
                }
            }

            requestAnim(render);
        }

        exports.start = function () {
            if (!isPaused) {
                return;
            }
            isPaused = false;

            requestAnim(render);
        };

        exports.stop = function () {
            isPaused = true;
        };

        exports.add = function (scene) {
            len++;
            scene.index = scenes.length;
            scenes.push(scene);
        };

        exports.remove = function (scene) {
            len--;
            var index = scene.index;
            if (index === undefined) {
                return;
            }
            scenes.splice(index, 1);
        };

        return exports;
    });

    renderer.start();
});