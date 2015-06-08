/**
 * @namespace console
 * @memberof ui
 */
WebVN.use(function (ui, script)
{
    var uiName  = 'console',
        exports = ui.create(uiName);

    exports.listenTo(script, 'execCmd', function (text)
    {
    });
});