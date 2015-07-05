WebVN.extend('loader', function (exports, util)
{
    /**
     * @method image
     * @memberof loader
     * @param {string|Array.<string>} sources
     * @returns {Promise}
     */
    exports.image = function (sources)
    {
        if (!util.isArray(sources)) sources = [sources];

        var images = [],
            len    = sources.length,
            count  = 0;

        return new Promise(function (resolve, reject)
        {
            util.each(sources, function (source, index)
            {
                var image = new Image;
                images[index] = image;

                image.onload = function ()
                {
                    count++;
                    if (count === len)
                    {
                        (len === 1) ? resolve(images[0])
                                    : resolve(images);
                    }
                };

                image.onerror = function () { reject() };

                image.src = source;
            });
        });
    };
});