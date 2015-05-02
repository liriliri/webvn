webvn.extend('storage', ['class', 'util'], function (exports, kclass, util) {
    "use strict";
    var createLocalStore = exports.createLocalStore;

    function emptyFunc() {}

    var Save = exports.Save = kclass.create({

        constructor: function Save(saveFn, loadFn) {
            this.saveFn = saveFn || emptyFunc;
            this.loadFn = loadFn || emptyFunc;
        },

        save: function (fn) {
            if (util.isFunction(fn)) {
                this.saveFn = fn;
                return;
            }

            this.saveFn.call(null, fn);
        },

        load: function (fn) {
            if (util.isFunction(fn)) {
                this.loadFn = fn;
                return;
            }

            this.loadFn.call(null, fn);
        }

    });

    var saves = {};

    exports.create = function (name) {
        if (!saves[name]) {
            saves[name] = new Save(name);
        }

        return saves[name];
    };

    exports.save = function (name) {
        var localStore = createLocalStore(name);
        localStore.clear();

        var values = {};

        util.each(saves, function (save, key) {
            var value = {};
            save.save(value);
            values[key] = value;
        });

        localStore.set(values);
    };

    exports.load = function (name) {
        var localStore = createLocalStore(name);

        var values = localStore.get();

        util.each(saves, function (save, key) {
            save.load(values[key]);
        });
    };

});