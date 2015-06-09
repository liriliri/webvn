/**
 * Module test <br>
 * Provide some handy function for function testing.
 * It should be removed when the game is realeased.
 * @namespace webvn.test
 */
WebVN.module('test', function (exports, Class, select, script, util)
{
    exports.Script = Class.create(
        {
            constructor: function Component(scenarioId)
            {
                this.scenario = util.trim(select.get('#' + scenarioId).text);
                this.start();
            },

            start: function ()
            {
                script.loadText(this.scenario, true, 'test');
            }
        }
    );
});