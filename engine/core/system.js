/* System module
 * Provide some common system info and function, such as the screen width and height
 */

webvn.add('system', function (s) {

var system = {};

// Screen width and height
system.screenWidth = screen.width;
system.screenHeight = screen.height;

return system;

});