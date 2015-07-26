/**
 * @namespace anim
 */
WebVN.module('anim', function (exports, Class, util, select)
{
    var reqAnim = window.requestAnimationFrame;

    var State = Class.State.create('pause', [
        { name: 'play',  from: 'pause', to: 'play' },
        { name: 'pause', from: 'play',  to: 'pause'}
    ]);

    /**
     * @name Anim
     * @class
     * @memberof anim
     * @property {Array} steps
     * @property {State} state
     * @property {Boolean} loop
     * @property {Number} current
     * @property target
     */
    var Anim = exports.Anim = Class.create(
        /** @lends anim.Anim.prototype */
        {
            constructor: function Anim(target)
            {
                this.loop    = false;
                this.target  = target;
                this.state   = new State;
                this.steps   = [];
                this.current = 0;
            },

            /**
             * Add animation step, trigger play afterwards.
             * @param {Object} props
             * @param {Number} [duration]
             * @param {String} [ease]
             * @return {Anim}
             */
            to: function (props, duration, ease)
            {
                duration = duration || 0;
                ease     = ease || 'linear';
                ease     = exports.ease[ease];

                this.steps.push({
                    type    : 'to',
                    props   : props,
                    duration: duration,
                    ease    : ease
                });

                this.play();

                return this;
            },

            /**
             * Add wait step, trigger play afterwards.
             * @param {Number} duration
             * @return {Anim}
             */
            wait: function (duration)
            {
                this.steps.push({
                    type    : 'wait',
                    duration: duration
                });

                this.play();

                return this;
            },

            /**
             * Add call step, trigger play afterwards.
             * @param {Function} fn
             * @return {Anim}
             */
            call: function (fn)
            {
                if (!util.isFunction(fn)) return this;

                this.steps.push({
                    type: 'call',
                    fn  : fn
                });

                this.play();

                return this;
            },

            /**
             * Clear everything for reuse, target remains the same.
             */
            clear: function ()
            {
                this.stop();
                this.steps = [];
                this.loop  = false;
            },

            render: function () {},

            pause: function ()
            {
                if (this.state.is('pause')) return;

                this.state.pause();
            },

            stop: function ()
            {
                this.current = 0;

                this.pause();
            },

            play: function ()
            {
                if (this.steps.length === 0 || this.state.is('play')) return;

                if (this.current >= this.steps.length)
                {
                    if (this.loop)
                    {
                        this.current = 0;
                        this.play();
                    } else this.stop();

                    return;
                }

                var step = this.steps[this.current];
                this.current++;

                this.state.play();

                switch (step.type)
                {
                    case 'to'  : this.playTo(step);   break;
                    case 'call': this.playCall(step); break;
                    case 'wait': this.playWait(step); break;
                }

                return this;
            },

            /**
             * @param step
             */
            playTo: function (step)
            {
                var self   = this,
                    start  = +new Date,
                    finish = start + step.duration,
                    origin = {},
                    diff   = {};

                var isSelect = false;
                if (select.isSelect(this.target)) isSelect = true;

                util.each(step.props, function (value, key)
                {
                    isSelect ? origin[key] = self.target.cssComputed(key)
                             : origin[key] = self.target[key];

                    diff[key] = value - origin[key];
                });

                this.render = function ()
                {
                    if (self.state.is('pause')) return;

                    var time = +new Date;

                    if (time > finish)
                    {
                        isSelect ? self.target.css(step.props)
                                 : util.each(step.props,
                                             function (val, key)
                                             {
                                                 self.target[key] = val;
                                             });

                        self.state.pause();

                        self.play();

                        return;
                    }

                    var values = {};

                    util.each(step.props, function (val, key)
                    {
                        val = step.ease(0, time - start,
                                        origin[key], diff[key], step.duration);

                        isSelect ? values[key]      = val
                                 : self.target[key] = val;

                    });

                    isSelect && self.target.css(values);

                    reqAnim(self.render);
                };

                reqAnim(this.render);
            },

            /**
             * @param step
             */
            playCall: function (step)
            {
                step.fn.call(this);
                this.state.pause();
                this.play();
            },

            /**
             * @param step
             */
            playWait: function (step)
            {
                var self = this;

                setTimeout(function ()
                {
                    self.state.pause();
                    self.play();
                }, step.duration);
            }
        }
    );

    /**
     * @method create
     * @memberof anim
     * @param target
     * @return {Anim}
     */
    exports.create = function (target) { return new Anim(target) };
});