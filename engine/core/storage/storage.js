webvn.module('storage', ['class', 'util'], function (kclass, util) {
    "use strict";
    var exports = {};

    var localStore = kclass.module(function () {
        var exports = {};

        var localStore = window.localStorage;

        exports.get = function (key) {
            var value = localStore.getItem(key);
            try {
                value = JSON.parse(value);
            } catch (e) {}

            return value;
        };

        exports.set = function(key, value) {
            if (util.isObject(value)) {
                value = JSON.stringify(value);
            }
            localStore.setItem(key, value);
        };

        exports.remove = function (key) {
            localStore.removeItem(key);
        };

        return exports;
    });

    var prefix = 'wvn-';

    var LocalStore = exports.LocalStore = kclass.create({

        constructor: function LocalStore(name) {
            var key = this.key = prefix + name;
            var value = this.value = localStore.get(key);
            if (!util.isObject(value)) {
                this.value = {};
            }
        },

        save: function () {
            localStore.set(this.key, this.value);
        },

        clear: function () {
            this.value = {};
            this.save();
        },

        destroy: function () {
            localStore.remove(this.key);
        },

        get: function (key) {
            var value = this.value;

            // If no key is given, return the whole value
            if (key === undefined) {
                return value;
            }
            if (value[key]) {
                return value[key];
            }

            return null;
        },

        set: function (key, value, overwrite) {
            var attrs;

            if (util.isObject(key)) {
                attrs = key;
                overwrite = value;
            } else {
                attrs = {};
                attrs[key] = value;
            }

            if (overwrite === undefined) {
                overwrite = true;
            }
            if (overwrite) {
                this.value = util.merge(this.value, attrs);
            } else {
                this.value = util.merge(attrs, this.value);
            }

            this.save();
        }

    });

    var localStores = {};

    exports.createLocalStore= function (name) {
        if (!localStores[name]) {
            localStores[name] = new LocalStore(name);
        }

        return localStores[name];
    };

    return exports;
});