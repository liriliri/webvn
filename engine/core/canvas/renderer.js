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

        function render(timestamp) {
            if (isPaused) {
                return;
            }

            util.each(scenes, function (scene) {
                scene.render(timestamp);
            });

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
            scene.index = scenes.length;
            scenes.push(scene);
        };

        return exports;
    });

    renderer.start();

    return exports;
});