/**
 * @namespace ease
 * @memberof anim
 * @property linear
 * @property inQuad
 * @property outQuad
 * @property inOutQuad
 * @property inCubic
 * @property outCubic
 * @property inOutCubic
 * @property inQuart
 * @property outQuart
 * @property inOutQuart
 * @property inQuint
 * @property outQuint
 * @property inOutQuint
 * @property inSine
 * @property outSine
 * @property inOutSine
 * @property inExpo
 * @property outExpo
 * @property inOutExpo
 * @property inCirc
 * @property outCirc
 * @property inOutCirc
 * @property inElastic
 * @property outElastic
 * @property inOutElastic
 * @property inBack
 * @property outBack
 * @property inOutBack
 * @property inBounce
 * @property outBounce
 * @property inOutBounce
 */
WebVN.extend('anim', function (exports)
{
    var ease = {};

    ease.linear = function(x, t, b, c, d)
    {
        t /= d;
        return c*t + b;
    };

    ease.inQuad = function (x, t, b, c, d)
    {
        return c*(t/=d)*t + b;
    };

    ease.outQuad = function (x, t, b, c, d)
    {
        return -c *(t/=d)*(t-2) + b;
    };

    ease.inOutQuad = function (x, t, b, c, d)
    {
        if ((t/=d/2) < 1) return c/2*t*t + b;

        return -c/2 * ((--t)*(t-2) - 1) + b;
    };

    ease.inCubic = function (x, t, b, c, d)
    {
        return c*(t/=d)*t*t + b;
    };

    ease.outCubic = function (x, t, b, c, d)
    {
        return c*((t=t/d-1)*t*t + 1) + b;
    };

    ease.inOutCubic = function (x, t, b, c, d)
    {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;

        return c/2*((t-=2)*t*t + 2) + b;
    };

    ease.inQuart = function (x, t, b, c, d)
    {
        return c*(t/=d)*t*t*t + b;
    };

    ease.outQuart = function (x, t, b, c, d)
    {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    };

    ease.inOutQuart = function (x, t, b, c, d)
    {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;

        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    };

    ease.inQuint = function (x, t, b, c, d)
    {
        return c*(t/=d)*t*t*t*t + b;
    };

    ease.outQuint = function (x, t, b, c, d)
    {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    };

    ease.inOutQuint = function (x, t, b, c, d)
    {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;

        return c/2*((t-=2)*t*t*t*t + 2) + b;
    };

    ease.inSine = function (x, t, b, c, d)
    {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    };

    ease.outSine = function (x, t, b, c, d)
    {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };

    ease.inOutSine = function (x, t, b, c, d)
    {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    };

    ease.inExpo = function (x, t, b, c, d)
    {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    };

    ease.outExpo = function (x, t, b, c, d)
    {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    };

    ease.inOutExpo = function (x, t, b, c, d)
    {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;

        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    };

    ease.inCirc = function (x, t, b, c, d)
    {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    };

    ease.outCirc = function (x, t, b, c, d)
    {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    };

    ease.inOutCirc = function (x, t, b, c, d)
    {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;

        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    };

    ease.inElastic = function (x, t, b, c, d)
    {
        var s;
        s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);

        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    };

    ease.outElastic = function (x, t, b, c, d)
    {
        var s;
        s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);

        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    };

    ease.inOutElastic = function (x, t, b, c, d)
    {
        var s;
        s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;

        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    };

    ease.inBack = function (x, t, b, c, d, s)
    {
        if (s == undefined) s = 1.70158;

        return c*(t/=d)*t*((s+1)*t - s) + b;
    };

    ease.outBack = function (x, t, b, c, d, s)
    {
        if (s == undefined) s = 1.70158;

        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    };

    ease.inOutBack = function (x, t, b, c, d, s)
    {
        if (s == undefined) s = 1.70158;
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;

        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    };

    ease.inBounce = function (x, t, b, c, d)
    {
        return c - ease.outBounce (x, d-t, 0, c, d) + b;
    };

    ease.outBounce = function (x, t, b, c, d)
    {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    };

    ease.inOutBounce = function (x, t, b, c, d)
    {
        if (t < d/2) return ease.inBounce(x, t*2, 0, c, d) * .5 + b;

        return ease.outBounce(x, t*2-d, 0, c, d) * .5 + c*.5 + b;
    };

    exports.ease = ease;
});