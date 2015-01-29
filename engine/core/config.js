// Provide function for managing

webvn.add('config', ['storage', 'class', 'util'], function (s, storage, kclass, util) {

var config = {},
    cache = {};

// Create config
config.create = function (name) {

    var newConfig = new Config(name);

    cache[name] = newConfig;

    return newConfig;

};

config.global = window.config;

// Config class
var Config = kclass.create({
    constructor: function Config(name) {

        this.store = storage.create(name, 'localStorage');
        this.value = this.store.get();

    },
    delete: function () {

        this.store.delete();

    },
    get: function (key) {

        return this.store.get(key);

    },
    set: function (key, value, overwrite) {

        this.store.set(key, value, overwrite);

        return this;

    }
});

return config;

});
