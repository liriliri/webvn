/* Module test
 * Provide some handy function for function testing
 * Should be removed when the game is realeased
 */

webvn.add('test', ['class', 'select', 'script', 'util'], 
    function (s, kclass, select, script, util) {

var test = {};

// Component testing
test.Component = kclass.create({
    constructor: function Component(scenarioId) {

        this.scenario = util.trim(select('#' + scenarioId).text());

    },
    start: function () {

        script.loadText(this.scenario, true);

    }
});

return test;

});