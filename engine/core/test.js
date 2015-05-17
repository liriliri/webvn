/**
 * Module test <br>
 * Provide some handy function for function testing.
 * It should be removed when the game is realeased.
 * @namespace webvn.test
 */
webvn.module('test', function (Class, select, script, util, exports) {
    // Component testing
    exports.Component = Class.create({
        constructor: function Component(scenarioId) {
            this.scenario = util.trim(select.get('#' + scenarioId).text());
        },
        start: function () {
            script.loadText(this.scenario, true);
        }
    });
});