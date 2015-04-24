webvn.use(['loader', 'ajax', 'log'],
    function (s, loader, ajax, log) {

        // Load image
        loader.image = function (source) {
            log.info('Loading image: ' + source);
            return new Promise(function (resolve, reject) {
                var image = new Image;
                image.onload = function () {
                    resolve(image);
                };
                image.onerror = function () {
                    "use strict";
                    reject();
                };
                image.src = source;
            });
        };

        /* Load scene
         * Scenes should be array
         */
        loader.scenario = function (scenes, cb) {
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
