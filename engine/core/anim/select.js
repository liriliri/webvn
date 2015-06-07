WebVN.extend('select', function (exports, anim, util)
{
    var Anim = anim.Anim;

    exports.Select.extendFn({

        fadeIn: function (duration, cb)
        {
            var opacity = this.css('opacity');

            if (opacity > 0) this.css('opacity', 0);

            this.show();

            new Anim(this).to({
                opacity: 1
            }, duration).call(cb);
        },

        fadeOut: function (duration, cb)
        {
            var self = this;

            new Anim(this).to({
                opacity: 0
            }, duration).call(function ()
            {
                self.hide();
                util.isFunction(cb) && cb();
            });
        }
    });

});