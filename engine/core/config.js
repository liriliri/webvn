// Provide function for managing 

webvn.add('config', ['storage', 'class'], function (s, storage, kclass) {

var config = {},
	cache = {};

// Create config
config.create = function (name) {

	var newConfig = new Config(name);

	cache[name] = newConfig;

	return newConfig;

}

// Config class
var Config = kclass.create({
	constructor: function Config(name) {

		this.store = storage.create(name, 'localStorage');

	},
	init: function () {

		

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