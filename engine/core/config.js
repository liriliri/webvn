webvn.use(['config', 'storage', 'class'],
    function (s, config, storage, kclass) {

var cache = {};

// Create config
config.create = function (name) {

    var newConfig = new Config(name);

    cache[name] = newConfig;

    return newConfig;

};

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

});
