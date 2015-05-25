webvn.extend('ui', function (exports, util, config, Class) {
    'use strict';
    var cfg = config.create('ui'),
        cfgLang = cfg.get('lang');

    var langs = {};

    var Lang = Class.create({

        constructor: function Lang(name) {
            if (langs[name]) {
                this.val = langs[name][cfgLang];
            }
        },

        get: function (key) {
            var val = this.val;

            if (val && val[key]) return val[key];

            return key;
        }

    });

    function create(name, content) {
        if (util.isObject(name)) {
            util.each(name, function (value, key) {
                langs[key] = value;
            });
        } else {
            langs[name] = content;
        }
    }

    var langInstances = {};

    function get(name) {
        var ret = langInstances[name];

        if (!ret) ret = langInstances[name] = new Lang(name);

        return ret;
    }

    exports.lang = {
        create: create,
        get: get
    };
});