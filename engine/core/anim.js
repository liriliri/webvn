/* Simple animation module
 * Inspired by zepto fx.js
 */

webvn.add('anim', ['config', 'util'], function (s, config, util) {

var defaults = {
    speeds: {
        _default: 400,
        fast: 200,
        slow: 600
    }
};

var conf = config.create('core-anim');
conf.set(defaults);

var prefix = '',
    transform,
    transitionProperty, transitionDuration, transitionTiming, transitionDelay,
    animationName, animationDuration, animationTiming, animationDelay;



var anim = function (properties, duration, ease, callback, delay) {

    var cssValues = {};

    if (duration === undefined) {
        duration = conf.get('speeds')._default;
    }

    if (delay === undefined) {
        delay = 0;
    }

    if (util.isString(properties)) {
        // Keyframe animation
        cssValues[animationName] = properties;
        cssValues[animationDuration] = duration + 's';
        cssValues[animationDelay] = delay + 's';
        cssValues[animationTiming] = 
    }

};

// Extend select module


return anim;

});