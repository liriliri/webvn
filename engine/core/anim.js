/* Simple animation module
 * Inspired by zepto fx.js
 */

webvn.module('anim', ['config', 'util', 'select'],
    function (s, config, util, select) {

        var prefix = '',
            eventPrefix,
            vendors = {
                Webkit: 'webkit',
                Moz: '',
                O: 'o'
            },
            testEl = document.createElement('div'),
            supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
            transform,
            transitionProperty, transitionDuration, transitionTiming, transitionDelay,
            animationName, animationDuration, animationTiming, animationDelay,
            cssReset = {};

        util.each(vendors, function (event, vendor) {

            if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
                prefix = '-' + vendor.toLowerCase() + '-';
                eventPrefix = event;
                return false;
            }

        });

        transform = prefix + 'transform';
        cssReset[transitionProperty = prefix + 'transition-property'] =
        cssReset[transitionDuration = prefix + 'transition-duration'] =
        cssReset[transitionDelay    = prefix + 'transition-delay'] =
        cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
        cssReset[animationName      = prefix + 'animation-name'] =
        cssReset[animationDuration  = prefix + 'animation-duration'] =
        cssReset[animationDelay     = prefix + 'animation-delay'] =
        cssReset[animationTiming    = prefix + 'animation-timing-function'] = '';

        select.fx = fx = {
            off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
            speeds: {
                _default: 400,
                fast: 200,
                slow: 600
            },
            cssPrefix: prefix,
            transitionEnd: normalizeEvent('TransitionEnd'),
            animationEnd: normalizeEvent('AnimationEnd')
        };

        testEl = null;

        var anim = function (properties, duration, ease, callback, delay) {

            var cssValues = {},
                key,
                cssProperties,
                transforms = '',
                self = this,
                wrappedCallback,
                fired = false,
                endEvent = fx.transitionEnd;

            if (duration === undefined) {
                duration = fx.speeds._default;
            }
            duration = (typeof duration == 'number' ? duration :
                (fx.speeds[duration] || fx.speeds._default)) / 1000;
            if (delay === undefined) {
                delay = 0;
            }
            if (fx.off) {
                duration = 0;
            }

            if (util.isString(properties)) {
                // Keyframe animation
                cssValues[animationName] = properties;
                cssValues[animationDuration] = duration + 's';
                cssValues[animationDelay] = delay + 's';
                cssValues[animationTiming] = (ease || 'linear');
                endEvent = fx.animationEnd;
            } else {
                cssProperties = [];
                for (key in properties) {
                    if (supportedTransforms.test(key)) {
                        transforms += key + '(' + properties[key] + ')';
                    } else {
                        cssValues[key] = properties[key];
                        cssProperties.push(dasherize(key));
                    }
                }
                if (transforms) {
                    cssValues[transform] = transforms;
                    cssProperties.push(transform);
                }
                if (duration > 0 && typeof properties === 'object') {
                    cssValues[transitionProperty] = cssProperties.join(', ');
                    cssValues[transitionDuration] = duration + 's';
                    cssValues[transitionDelay] = delay + 's';
                    cssValues[transitionTiming] = (ease || 'linear');
                }
            }

            if (duration > 0) {

                setTimeout(function(){

                    callback && callback.call(self);

                }, ((duration + delay) * 1000) + 25);
            }

            this.size() && this.get(0).clientLeft;

            this.css(cssValues);

            if (duration <= 0) {
                setTimeout(function() {

                    self.each(function(){

                       callback && callback.call(self);

                    });

                }, 0);
            }

            return this;

        };

        /* Easing
         * Copy from jQuery.easing
         */
        anim.ease = {
            linear: function(x, t, b, c, d) {

                return c*(t/=d) + b;

            },
            easeInQuad: function (x, t, b, c, d) {

                return c*(t/=d)*t + b;

            },
            easeOutQuad: function (x, t, b, c, d) {

                return -c *(t/=d)*(t-2) + b;

            },
            easeInOutQuad: function (x, t, b, c, d) {

                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;

            },
            easeInCubic: function (x, t, b, c, d) {

                return c*(t/=d)*t*t + b;

            },
            easeOutCubic: function (x, t, b, c, d) {

                return c*((t=t/d-1)*t*t + 1) + b;

            },
            easeInOutCubic: function (x, t, b, c, d) {

                if ((t/=d/2) < 1) return c/2*t*t*t + b;
                return c/2*((t-=2)*t*t + 2) + b;

            },
            easeInQuart: function (x, t, b, c, d) {

                return c*(t/=d)*t*t*t + b;

            },
            easeOutQuart: function (x, t, b, c, d) {

                return -c * ((t=t/d-1)*t*t*t - 1) + b;

            },
            easeInOutQuart: function (x, t, b, c, d) {

                if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                return -c/2 * ((t-=2)*t*t*t - 2) + b;

            },
            easeInQuint: function (x, t, b, c, d) {

                return c*(t/=d)*t*t*t*t + b;

            },
            easeOutQuint: function (x, t, b, c, d) {

                return c*((t=t/d-1)*t*t*t*t + 1) + b;

            },
            easeInOutQuint: function (x, t, b, c, d) {

                if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                return c/2*((t-=2)*t*t*t*t + 2) + b;

            },
            easeInSine: function (x, t, b, c, d) {

                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;

            },
            easeOutSine: function (x, t, b, c, d) {

                return c * Math.sin(t/d * (Math.PI/2)) + b;

            },
            easeInOutSine: function (x, t, b, c, d) {

                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;

            },
            easeInExpo: function (x, t, b, c, d) {

                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;

            },
            easeOutExpo: function (x, t, b, c, d) {

                return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;

            },
            easeInOutExpo: function (x, t, b, c, d) {

                if (t==0) return b;
                if (t==d) return b+c;
                if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;

            },
            easeInCirc: function (x, t, b, c, d) {

                return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;

            },
            easeOutCirc: function (x, t, b, c, d) {

                return c * Math.sqrt(1 - (t=t/d-1)*t) + b;

            },
            easeInOutCirc: function (x, t, b, c, d) {

                if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;

            },
            easeInElastic: function (x, t, b, c, d) {

                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;

            },
            easeOutElastic: function (x, t, b, c, d) {

                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;

            },
            easeInOutElastic: function (x, t, b, c, d) {

                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;

            },
            easeInBack: function (x, t, b, c, d, s) {

                if (s == undefined) s = 1.70158;
                return c*(t/=d)*t*((s+1)*t - s) + b;

            },
            easeOutBack: function (x, t, b, c, d, s) {

                if (s == undefined) s = 1.70158;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;

            },
            easeInOutBack: function (x, t, b, c, d, s) {

                if (s == undefined) s = 1.70158;
                if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;

            },
            easeInBounce: function (x, t, b, c, d) {

                return c - anim.ease.easeOutBounce (x, d-t, 0, c, d) + b;

            },
            easeOutBounce: function (x, t, b, c, d) {

                if ((t/=d) < (1/2.75)) {
                    return c*(7.5625*t*t) + b;
                } else if (t < (2/2.75)) {
                    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                } else if (t < (2.5/2.75)) {
                    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                } else {
                    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                }

            },
            easeInOutBounce: function (x, t, b, c, d) {

                if (t < d/2) return anim.ease.easeInBounce (x, t*2, 0, c, d) * .5 + b;
                return anim.ease.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;

            }
        };

        function dasherize(str) {

            return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase();

        }

        function normalizeEvent(name) {

            return eventPrefix ? eventPrefix + name : name.toLowerCase();

        }

        // Extend select module
        var fn = select.Select.prototype;
        var origShow = fn.show,
            origHide = fn.hide;

        select.Select.extendFn({
            animate: function (properties, duration, ease, callback, delay) {

                if (util.isFunction(duration)) {
                    callback = duration;
                    ease = undefined;
                    duration = undefined;
                }
                if (util.isFunction(ease)) {
                    callback = ease;
                    ease = undefined;
                }
                if (util.isPlainObject(duration)) {
                    ease = duration.easing;
                    callback = duration.complete;
                    delay = duration.delay;
                    duration = duration.duration;
                }
                if (delay) {
                    delay = parseFloat(delay) / 1000;
                }

                return this.anim(properties, duration, ease, callback, delay);

            },
            anim: anim,
            fadeIn: function (speed, callback) {

                var target = this.css('opacity');
                if (target > 0) {
                    this.css('opacity', 0);
                } else {
                    target = 1;
                }

                return origShow.call(this).fadeTo(speed, target, callback);

            },
            fadeOut: function (speed, callback) {

                if (util.isFunction(speed) && !callback) {
                    callback = speed,
                    speed = undefined;
                }

                return hide(this, speed, null, callback);

            },
            fadeTo: function (speed, opacity, callback) {

                if (util.isFunction(speed) && !callback) {
                    opacity = speed,
                    callback = opacity,
                    speed = undefined;
                }

                return animProxy(this, speed, opacity, null, callback);

            }
        });

        function hide(el, speed, scale, callback) {

            return animProxy(el, speed, 0, scale, function () {

                origHide.call(el);
                callback && callback.call(el);

            });

        }

        function animProxy(el, speed, opacity, scale, callback) {

            if (util.isFunction(speed) && !callback) {
                callback = speed, speed = undefined;
            }
            var props = {
                opacity: opacity
            };
            if (scale) {
                props.scale = scale;
                el.css(fx.cssPrefix + 'transform-origin', '0 0');
            }

            return el.animate(props, speed, null, callback);

        }

    return anim;

});