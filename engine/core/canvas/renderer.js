/**
 * @module canvas
 */
WebVN.module('canvas', function (exports, Class)
{
    var reqAnim = window.requestAnimationFrame;

    var renderer = exports.renderer
                 = WebVN.module(function (exports)
    {
        var isPaused = true,
            scenes   = [],
            len      = 0, i;

        function render(timestamp)
        {
            if (isPaused) return;

            for (i = 0; i < len; i++)
            {
                if (scenes[i].change()) scenes[i].render(timestamp);
            }

            reqAnim(render);
        }

        exports.start = function ()
        {
            if (!isPaused) return;
            isPaused = false;

            reqAnim(render);
        };

        exports.stop = function () { isPaused = true };

        exports.add = function (scene)
        {
            len++;
            scene.index = scenes.length;
            scenes.push(scene);
        };

        exports.remove = function (scene)
        {
            len--;
            var index = scene.index;
            if (index === undefined) return;

            scenes.splice(index, 1);
        };
    });

    renderer.start();
});