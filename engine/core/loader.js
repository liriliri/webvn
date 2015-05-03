webvn.extend('loader', ['util'], function (exports, util) {
        "use strict";

    var ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // The context for the callbacks
        context: null,
        async: true,
        // Transport
        xhr: function () {
            return new window.XMLHttpRequest();
        },
        // Default timeout
        timeout: 0
    };

    var ajax = function (options) {

        var settings = util.merge(ajaxSettings, options);

        var dataType = settings.dataType,
            context = settings.context,
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr();

        return new Promise(function (resolve, reject) {

            xhr.onload = function () {

                clearTimeout(abortTimeout);

                var status = xhr.status,
                    result = xhr.responseText;

                if ((status >= 200 && status < 300) ||
                    status == 304 || (status == 0 && protocol === 'file:')) {
                    try {
                        switch (dataType) {
                            case 'script':
                                eval(result);
                                break;
                            case 'xml':
                                result = xhr.responseXML;
                                break;
                            case 'json':
                                result = JSON.parse(result);
                                break;
                        }
                    } catch(e) {}
                    settings.success.call(context, result, 'success', xhr);
                    resolve(result, xhr);
                } else {
                    error();
                }

            };

            if (settings.beforeSend.call(context, xhr, settings) === false) {
                abort();
            }

            // Request error
            xhr.onerror = error;

            if (settings.timeout > 0) {
                var abortTimeout = setTimeout(function () {

                    abort();

                }, settings.timeout);
            }

            xhr.open(settings.type, settings.url, settings.async);

            xhr.send(settings.data ? settings.data : null);

            function abort() {

                xhr.abort();
                error();

            }

            function error() {

                settings.error.call(context, xhr, 'ajaxError', xhr);
                reject(xhr);

            }

        });

    };

    ajax.get = function (url, data, success, dataType) {

        return ajax({
            type: 'get',
            url: url,
            data: data,
            success: success,
            dataType: dataType
        });

    };

    ajax.post = function (url, data, success, dataType) {

        return ajax({
            type: 'post',
            url: url,
            data: data,
            success: success,
            dataType: dataType
        });

    };

    function empty() {}

    /**
     * @function wvn.loader.image
     * @param sources
     * @returns {Promise}
     */
    exports.image = function (sources) {
        if (!util.isArray(sources)) {
            sources = [sources];
        }

        var images = [],
            len = sources.length,
            count = 0;

        return new Promise(function (resolve, reject) {

            util.each(sources, function (source, index) {
                var image = new Image;
                images[index] = image;

                image.onload = function () {
                    count++;
                    if (count === len) {
                        if (len === 1) {
                            resolve(image[0]);
                        } else {
                            resolve(images);
                        }
                    }
                };

                image.onerror = function () {
                    reject();
                };
            });

        });
    };

    exports.scenario = function (scenes, cb) {
        _scenario(scenes, 0, cb);
    };

    // Private function
    function _scenario (scenes, i, cb) {
        ajax.get(scenes[i]).then(function (value) {
            cb(value, i === scenes.length - 1);
            if (i < scenes.length - 1) {
                _scenario(scenes, i + 1, cb);
            }
        });
    }

});
