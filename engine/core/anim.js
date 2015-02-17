/* Simple animation module
 * Inspired by zepto fx.js
 */

webvn.add('anim', ['config', 'util', 'select'],
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
        duration = conf.get('speeds')._default;
    }
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

function dasherize(str) {

    return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase();

}

function normalizeEvent(name) {

    return eventPrefix ? eventPrefix + name : name.toLowerCase();

}

// Extend select module
select.fn.animate = function (properties, duration, ease, callback, delay) {

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
    if (duration) {
        duration = (typeof duration == 'number' ? duration :
            (fx.speeds[duration] || fx.speeds._default)) / 1000;
    }
    if (delay) {
        delay = parseFloat(delay) / 1000;
    }

    return this.anim(properties, duration, ease, callback, delay);

};

select.fn.anim = anim;

return anim;

});