// Extend loader module

webvn.use(['loader', 'ajax', 'promise', 'log'], function (s, loader, ajax, promise, log) {

// Load image
loader.image = function (source) {

    log.info('Loading image: ' + source);

    return new Promise(function (resolve, reject) {

        var image = new Image;

        image.onload = function () {

            resolve(image);

        };

        image.src = source;

    });

};

/* Load scene
 * Scenes should be array
 */
loader.scenario = function (scenes, cb) {

    loadScenario(scenes, 0, cb);

};

// Private function

function loadScenario (scenes, i, cb) {

    ajax.get(scenes[i]).then(function (value) {

        cb(value, i === scenes.length - 1);
        if (i < scenes.length - 1) {
            loadScenario(scenes, i + 1, cb);
        }

    });

}

});
