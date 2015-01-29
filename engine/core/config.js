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

<<<<<<< HEAD
        this.store = storage.create(name, 'localStorage');
        this.value = this.store.getAll();
=======
		this.store = storage.create(name, 'localStorage');
		this.value = this.store.get();
>>>>>>> d0dc29c8fffa1d77e8d0d9653ee613afd4863e69

    },
    delete: function () {

        this.store.delete();

<<<<<<< HEAD
    },
    // Set defaults
    init: function (defaults) {

        this.store.set(util.merge(defaults, this.value));

        return this;

    },
    get: function (key) {
=======
	},
	get: function (key) {
>>>>>>> d0dc29c8fffa1d77e8d0d9653ee613afd4863e69

        return this.store.get(key);

<<<<<<< HEAD
    },
    set: function (key, value) {

        this.store.set(key, value);
=======
	},
	set: function (key, value, overwrite) {

		this.store.set(key, value, overwrite);

		return this;
>>>>>>> d0dc29c8fffa1d77e8d0d9653ee613afd4863e69

    }
});

return config;

});