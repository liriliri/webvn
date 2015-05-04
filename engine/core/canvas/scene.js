webvn.extend('canvas', ['class', 'webgl', 'util'], function (exports, kclass, webgl, util) {
    "use strict";

    var Scene = exports.Scene = kclass.create({

        constructor: function Scene(view) {
            this.view = view;
            this.ctx = webgl.create(view);
            this.width = view.width;
            this.height = view.height;
            this.children = [];
        },

        clear: function () {
            this.ctx.clear();
        },

        add: function (entity) {
            var children = this.children;

            entity.index = children.length;
            children.push(entity);
        },

        render: function () {
            var self = this,
                children = this.children;

            this.clear();

            util.each(children, function (child) {
                child.render(self);
            });
        }

    });

    exports.createScene = function (view) {
        return new Scene(view);
    };

});