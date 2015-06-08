/**
 * @namespace asset
 * @memberof storage
 */
WebVN.extend('storage', function (exports, Class, config, util)
{
    var basePath = '';

    if (config.build === 'test') basePath = '../';

    var regFileExt = /(jpg|png|bmp|ogg|webm|wav)$/;

    /**
     * @class Asset
     * @memberof storage.asset
     * @property {String} path
     * @property {String} extension
     */
    var Asset = Class.create(
        /** @lends storage.asset.Asset */
        {
            constructor: function Asset(path, extension)
            {
                this.path      = path      || '';
                this.extension = extension || '';
            },

            /**
             * Get asset full path.
             * @param {String} src
             * @returns {String}
             */
            get: function (src)
            {
                if (util.startsWith(src, 'http')) return src;

                if (regFileExt.test(src)) return basePath + src;

                return basePath + this.path + src + '.' + this.extension;
            }
        }
    );

    /**
     * @method create
     * @memberof storage.asset
     * @param {String} path
     * @param {String} extension
     * @return {Asset}
     */
    function create(path, extension) { return new Asset(path, extension) }

    exports.asset = {
        create: create,
        Asset : Asset
    };
});