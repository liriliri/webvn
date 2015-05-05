/**
 * Module test <br>
 * Provide some handy function for function testing.
 * It should be removed when the game is realeased.
 * @namespace webvn.test
 */
webvn.module('test', ['class', 'select', 'script', 'util'], function (kclass, select, script, util) {
    var exports = {};

    // Component testing
    exports.Component = kclass.create({
        constructor: function Component(scenarioId) {
            this.scenario = util.trim(select.get('#' + scenarioId).text());
        },
        start: function () {
            script.loadText(this.scenario, true);
        }
    });

    return exports;
});