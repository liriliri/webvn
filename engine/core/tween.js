/* Module tween
 * Animation control library
 */

webvn.add('tween', ['util', 'class', 'anim'],
    function (s, util, kclass, anim) {

        var exports = {};

        var STATE = {
            PAUSE: 0,
            PLAY: 1
        };

        var Tween = exports.Tween = kclass.create({
            constructor: function Tween(target) {

                this.loop = false;
                this.target = target;
                this.clear();

            },
            clear: function () {

                if (this._intervalId) {
                    clearInterval(this._intervalId);
                }
                this._intervalId = null;
                this.state = STATE.PAUSE;
                this._steps = [];
                this._curStep = 0;

            },
            to: function (props, duration, ease) {

                if (!util.isNumber(duration) || duration < 0) {
                    duration = 0;
                }

                ease = ease || 'linear';
                ease = anim.ease[ease];

                this._steps.push({
                    type: 'tween',
                    props: props,
                    duration: duration,
                    ease: ease
                });

                if (this.state === STATE.PAUSE) {
                    this.play();
                }

                return this;

            },
            pause: function () {



            },
            stop: function () {



            },
            play: function () {

                if (this._steps.length === 0) {
                    return;
                }

                if (this._curStep >= this._steps.length) {
                    if (this.loop) {
                        this._curStep = 0;
                        this.play();
                    } else {
                        this.stop();
                    }
                    return;
                }

                var step = this._steps[this._curStep];
                this._curStep++;

                if (step.type === 'tween'){
                    var self = this,
                        start = +new Date,
                        finish = start + step.duration,
                        origin = {},
                        diff = {};

                    util.each(step.props, function (value, key) {

                        origin[key] = self.target[key];
                        diff[key] = value - origin[key];

                    });

                    var intervalId = setInterval(function () {

                        var time = +new Date;

                        // One step of tween is finish
                        if (time > finish) {
                            clearInterval(intervalId);
                            util.each(step.props, function (value, key) {

                                self.target[key] = value;

                            });
                            // Play the next step
                            self.play();
                            return;
                        }

                        util.each(step.props, function (value, key) {

                            self.target[key] = step.ease(0, time - start,
                                origin[key], diff[key], step.duration);

                        });

                    }, 20);

                    this.state = STATE.PLAY;
                }

                return this;

            },
            wait: function (duration) {



            },
            call: function (fn) {



            }
        });

        exports.create = function (target) {

            return new Tween(target);

        };

        return exports;

    });