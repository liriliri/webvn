/**
 * Provide some common system info and function, such as the screen width and height.
 * @namespace webvn.system
 */
webvn.module('system', ['select', 'config'],
	function (select, config) {

        var defaults = {
            width: 960,
            height: 480,
            title: 'WebVN'
        };

        var system = {};

        var conf = config.create('core-system');
        conf.set(defaults).set(config.system, true);

        // Screen width and height
        system.screenWidth = screen.width;
        system.screenHeight = screen.height;

        var $title = select.get('title');

        // Set window title
        system.setTitle = function (text) {

            $title.text(text);

        };
        // Set default title
        system.setTitle(conf.get('title'));

        return system;

    });