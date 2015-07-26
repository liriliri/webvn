WebVN.use(function (script, config)
{
    WebVN.isReady = true;

    WebVN.call();

    if (config.build !== 'test')
    {
        script.load(function () { script.start() });
    }
});