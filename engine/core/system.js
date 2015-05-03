/**
 * Provide some common system info and function,
 * such as the screen width and height.
 * @namespace webvn.system
 */
webvn.module('system', ['select', 'config'], function (select, config) {
    "use strict";
    var exports = {};

    var conf = config.create('system');

    // Screen width and height
    exports.screenWidth = screen.width;
    exports.screenHeight = screen.height;

    var $title = select.get('title');

    // Set window title
    var setTitle = exports.setTitle = function (text) {
        $title.text(text);
    };

    // Set default title
    setTitle(conf.get('title'));

    return exports;
});