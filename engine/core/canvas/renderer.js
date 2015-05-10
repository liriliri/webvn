/**
 * @namespace webvn.canvas
 */
webvn.module('canvas', ['class', 'util'], function (kclass, util) {
    "use strict";
    var exports = {};

    var renderer = exports.renderer = kclass.module(function () {
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
                scenes[i].render(timestamp);
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

    return exports;
});