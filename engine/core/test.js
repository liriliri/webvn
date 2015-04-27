/* Module test
 * Provide some handy function for function testing
 * Should be removed when the game is realeased
 */

webvn.module('test', ['class', 'select', 'script', 'util'],
    function (s, kclass, select, script, util) {

var test = {};

// Component testing
test.Component = kclass.create({
    constructor: function Component(scenarioId) {

        this.scenario = util.trim(select.get('#' + scenarioId).text());

    },
    start: function () {

        script.loadText(this.scenario, true);

    }
});

return test;

});