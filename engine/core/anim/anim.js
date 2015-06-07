WebVN.module('anim', function (exports, Class, util, select, state)
{
    var reqAnim = window.requestAnimationFrame;

    var State = state.create('pause',
        [
            { name: 'play',  from: 'pause', to: 'play' },
            { name: 'pause', from: 'play', to: 'play'}
        ]
    );

    /**
     * @class Anim
     * @memberof anim
     */
    var Anim = exports.Anim = Class.create(
        {
            constructor: function Anim(target)
            {
                this.loop    = false;
                this.target  = target;
                this.state   = new State;
                this.steps   = [];
                this.curStep = 0;
            },

            to: function (props, duration, easeName)
            {
                if (!util.isNumber(duration) || duration < 0) duration = 0;
                easeName = easeName || 'linear';
                easeName = exports.ease[easeName];

                this.steps.push({
                    type    : 'to',
                    props   : props,
                    duration: duration,
                    ease    : easeName
                });
                this.play();

                return this;
            },

            pause: function ()
            {
                if (this.state.is('pause')) return;

                this.state.pause();
            },

            stop: function ()
            {
                this.curStep = 0;

                this.pause();
            },

            play: function ()
            {
                if (this.steps.length === 0 || this.state.is('play')) return;

                if (this.curStep >= this.steps.length)
                {
                    if (this.loop)
                    {
                        this.curStep = 0;
                        this.play();
                    } else this.stop();

                    return;
                }

                var step = this.steps[this.curStep];
                this.curStep++;

                this.state.play();

                switch (step.type)
                {
                    case 'to'  : this.playTo(step);   break;
                    case 'call': this.playCall(step); break;
                    case 'wait': this.playWait(step); break;
                }

                return this;
            },

            playTo: function (step)
            {
                var self   = this,
                    start  = +new Date,
                    finish = start + step.duration,
                    origin = {},
                    diff   = {};

                /* If target is a Select instance,
                 * Animate Css properties instead.
                 */
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

                    // One step of tween is finish
                    if (time > finish)
                    {
                        isSelect ? self.target.css(step.props)
                                 : util.each(step.props,
                                             function (val, key)
                                             {
                                                 self.target[key] = val;
                                             });

                        self.state.pause();
                        // Play the next step
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

            playCall: function (step)
            {
                step.fn.call(this);
                this.state.pause();
                this.play();
            },

            playWait: function (step)
            {
                var self = this;

                setTimeout(function ()
                {
                    self.state.pause();
                    self.play();
                }, step.duration);
            },

            wait: function (duration)
            {
                this.steps.push({
                    type    : 'wait',
                    duration: duration
                });
                this.play();

                return this;
            },

            call: function (fn)
            {
                if (!util.isFunction(fn)) return;

                this.steps.push({
                    type: 'call',
                    fn  : fn
                });
                this.play();

                return this;
            }
        }
    );

    exports.create = function (target) { return new Anim(target) };
});