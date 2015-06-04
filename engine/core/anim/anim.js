webvn.extend('anim', function (exports, Class, util, select)
{
    var STATE = {
            PAUSE: 0,
            PLAY : 1
        },
        reqAnim = window.requestAnimationFrame;

    var Anim = exports.Anim = Class.create(
        {
            constructor: function Anim(target)
            {
                this.loop   = false;
                this.target = target;

                this.clear();
            },

            clear: function ()
            {
                this.state    = STATE.PAUSE;
                this._steps   = [];
                this._curStep = 0;
            },

            to: function (props, duration, easeName)
            {
                if (!util.isNumber(duration) || duration < 0) duration = 0;
                easeName = easeName || 'linear';
                easeName = exports.ease[easeName];

                this._steps.push({
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
                if (this.state === STATE.PAUSE) return;

                this.state = STATE.PAUSE;
            },

            stop: function ()
            {
                this._curStep = 0;

                this.pause();
            },

            play: function ()
            {
                if (this._steps.length === 0 || this.state === STATE.PLAY) return;

                if (this._curStep >= this._steps.length)
                {
                    if (this.loop)
                    {
                        this._curStep = 0;
                        this.play();
                    } else this.stop();

                    return;
                }

                var step = this._steps[this._curStep];
                this._curStep++;

                switch (step.type)
                {
                    case 'to'  : this.playTo(step);   break;
                    case 'call': this.playCall(step); break;
                    case 'wait': this.playWait(step); break;
                }
                this.state = STATE.PLAY;

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

                this._render = function ()
                {
                    if (self.state === STATE.PAUSE) return;

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

                        self.state = STATE.PAUSE;
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

                    reqAnim(self._render);
                };

                reqAnim(this._render);
            },

            playCall: function (step)
            {
                step.fn.call(this);
                this.state = STATE.PAUSE;
                this.play();
            },

            playWait: function (step)
            {
                var self = this;

                setTimeout(function ()
                {
                    self.state = STATE.PAUSE;
                    self.play();
                }, step.duration);
            },

            wait: function (duration)
            {
                this._steps.push({
                    type    : 'wait',
                    duration: duration
                });
                this.play();

                return this;
            },

            call: function (fn)
            {
                if (!util.isFunction(fn)) return;

                this._steps.push({
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