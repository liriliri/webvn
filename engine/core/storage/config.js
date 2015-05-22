webvn.extend('config', function (exports, kclass, storage) {
    var configStore = storage.createLocalStore('config');

    var Config = exports.Config = storage.LocalStore.extend({

        constructor: function Config(name) {
            var value = configStore.get(name);
            if (value === null) {
                value = {};
            }
            this.key = name;
            this.value = value;
        },

        set: function (key, value, overwrite) {
            this.callSuper(key, value, overwrite);

            return this;
        },

        save: function () {
            configStore.set(this.key, this.value);
        }

    });

    var configs = {};

    exports.create = function (name) {
        if (!configs[name]) {
            configs[name] = new Config(name);
        }

        if (exports[name]) {
            exports.build === 'release' ? configs[name].set(exports[name], false) :
                configs[name].set(exports[name], true);
        }

        return configs[name];
    };

});
