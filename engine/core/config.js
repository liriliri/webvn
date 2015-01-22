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
		this.value = this.store.getAll();

	},
	delete: function () {

		this.store.delete();

	},
	// Set defaults
	init: function (defaults) {

		this.store.set(util.merge(defaults, this.value));

		return this;

	},
	get: function (key) {

		return this.store.get(key);

	},
	set: function (key, value) {

		this.store.set(key, value);

	}
});

return config;

});