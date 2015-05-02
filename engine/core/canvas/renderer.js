webvn.module('canvas', ['config'], function (config) {
    "use strict";
    var exports = {};

    var conf = config.create('core-canvas');
    conf.set(config.canvas, false);

    var requestAnim = window.requestAnimationFrame;

    exports.renderer = {
        isPaused: true,
        interval: 20,
        scenes: [],
        add: function (scene) {

            scene.order = this.scenes.length;
            this.scenes.push(scene);

            return this;

        },
        remove: function (scene) {

            this.scenes.splice(scene.order, 1);

        },
        render: function (timestamp) {

            var scenes = this.scenes;

            if (this.isPaused) {
                return;
            }
            for (var i = 0, len = scenes.length; i < len; i++) {
                scenes[i].render(timestamp);
            }
            requestAnim(this.render.bind(this));

        },
        fps: function (fps) {

            this.interval = Math.floor(1000 / fps);

            return this;

        },
        start: function () {

            var self = this;

            if (!this.isPaused) {
                return;
            }
            this.isPaused = false;

            setTimeout(function () {

                requestAnim(self.render.bind(self));

            }, this.interval);

        },
        stop: function () {

            this.isPaused = true;

        }
    };

    exports.renderer.fps(conf.get('fps')).
        start();

    return exports;
});