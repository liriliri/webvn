webvn.extend('canvas', ['class', 'webgl'], function (exports, kclass, webgl) {
    "use strict";

    exports.Scene = kclass.create({
        // v is the canvas element
        constructor: function Scene(v) {

            this.view = v;
            this.order = null;
            this.filterData = {
                name: false,
                param: null
            };
            this.filter = new webgl.Filter(this.view);
            this.gl = webgl.create(this.view, '2d');
            this.width = this.view.width;
            this.height = this.view.height;
            this.children = [];
            this.filterEnabled = false;

        },
        add: function (entity) {

            entity.order = this.children.length;
            entity.parent = this;
            this.children.push(entity);

        },
        clear: function () {

            this.gl.clear();

        },
        remove: function (order) {

            this.children.splice(order, 1);

        },
        filter: function (name, param) {

            this.filterData.name = name;
            if (param) {
                this.filterData.param = param;
            } else {
                this.filterData.param = null;
            }

        },
        render: function () {

            // Remove every thing first
            this.clear();

            if (this.filterEnabled) {
                this.filter.start();
            }

            var children = this.children;
            for (var i = 0, len = children.length; i < len; i++) {
                var child = this.children[i];
                child.renderWrapper(this);
            }

            if (this.filterEnabled) {
                this.filter.end();
            }

        }
    });

});