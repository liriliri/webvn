/**
 * @namespace webvn.select
 */
webvn.module('select', function (exports, util)
{
    var selectUtil = {};

    /**
     * Change 'background-color' into 'backgroundColor'
     * @method webvn.select.camelize
     * @param {string} str
     * @retuns {string}
     */
    selectUtil.camelize = function (str) {
        return str.replace(/-+(.)?/g, function(match, chr){
            return chr ? chr.toUpperCase() : '';
        });
    };

    /**
     * Change 'backgroundColor' into 'background-color'
     * @method webvn.select.dasherize
     * @param {string} str
     * @return {string}
     */
    var dasherize = selectUtil.dasherize = function (str) {
        return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase();
    };

    var elementDisplay = {};
    // Get a element's default display type
    selectUtil.defaultDisplay = function (nodeName) {
        var element, display;
        if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName);
            document.body.appendChild(element);
            display = getComputedStyle(element, '').getPropertyValue("display");
            element.parentNode.removeChild(element);
            display == "none" && (display = "block");
            elementDisplay[nodeName] = display;
        }
        return elementDisplay[nodeName];
    };

    // Do not add px to properties below
    var cssNumber = {
        'column-count': 1,
        'columns': 1,
        'font-weight': 1,
        'line-height': 1,
        'opacity': 1,
        'z-index': 1,
        'zoom': 1
    };
    // Add px suffix to value if necessary
    selectUtil.addPx = function (name, value) {
        if (util.isNumber(value) && !cssNumber[dasherize(name)]) {
            return value + 'px';
        }
        return value;
    };

    // Remove px suffix to value if necessary and change string to number if possible
    selectUtil.removePx = function (name, value) {
        if (util.endsWith(value, 'px')) {
            return Number(value.substr(0, value.length-2));
        }
        if (Number(value) === Number(value)) {
            return Number(value);
        }
        return value;
    };

    var traverseNode = selectUtil.traverseNode = function (node, fn) {
        fn(node);
        for (var i = 0, len = node.childNodes.length; i < len; i++) {
            traverseNode(node.childNodes[i], fn);
        }
    };

    // Set attribute to a node, if value is null, remove it.
    selectUtil.setAttribute = function (node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
    };

    exports.util = selectUtil;
});