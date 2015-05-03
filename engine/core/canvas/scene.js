webvn.extend('canvas', ['class', 'webgl'], function (exports, kclass, webgl) {
    "use strict";

    var Scene = exports.Scene = kclass.create({

        constructor: function Scene(view) {
            this.view = view;
            this.ctx = webgl.create(view);
            this.width = view.width;
            this.height = view.height;
            this.children = [];
        },

        add: function (entity) {
            var children = this.children;

            entity.index = children.length;
            children.push(entity);
        },

        render: function () {
            var self = this,
                children = this.children;

            util.each(children, function (child) {
                child.render(self);
            });
        }

    });

    exports.createScene = function (view) {
        return new Scene(view);
    };

});