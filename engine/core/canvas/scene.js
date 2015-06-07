WebVN.extend('canvas', function (exports, Class, webgl)
{
    var Scene = exports.Scene = Class.create(
        {
            constructor: function Scene(view)
            {
                this.view     = view;
                this.ctx      = webgl.create(view);
                this.width    = view.width;
                this.height   = view.height;
                this.children = [];
            },

            change: function ()
            {
                var children = this.children,
                    len = children.length;

                for (var i = 0; i < len; i++)
                {
                    if (children[i].change()) return true;
                }

                return false;
            },

            clear: function () { this.ctx.clear() },

            add: function (entity)
            {
                var children = this.children;

                entity.index = children.length;
                children.push(entity);
            },

            render: function ()
            {
                var children = this.children;

                this.clear();

                var i, len = children.length;

                for (i = 0; i < len; i++)
                {
                    children[i].visible && children[i].render(this);
                }
            }
        }
    );

    exports.createScene = function (view) { return new Scene(view) };

});