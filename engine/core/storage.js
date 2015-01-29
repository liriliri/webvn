/* Storage system
 * localstorage
 */

webvn.add('storage', ['class', 'util'], function (s, kclass, util) {

var storage = {},
    prefix = 'wv-',
    cache = {};

// LocalStorage Session

var localStore = null;
if (window.localStorage) {
    localStore = localStorage;
    s.log.info('LocalStorage is supported');
} else {
    s.log.warn('LocalStorage is not supported');
}

// LocalStore class
var LocalStore = kclass.create({
    /* name: the name of the store
     * when the instance is created,
     * it's going to load content according to the name you sepecify.
     */
    constructor: function LocalStore(name) {

        this.key = prefix + name;
        this.value = getLocal(name);
        if (!util.isObject(this.value)) {
            this.value = {};
        }

    },
    clear: function () {

        this.value = {};
        this.save();

    },
    delete: function () {

        removeLocal(this.key);

    },
    // Get value
    get: function (key) {

        if (this.value[key]) {
            return this.value[key];
        } else {
            s.log.warn('Key ' + key + ' does not exist');
        }

    },
    // Return all the value
    getAll: function () {

        return this.value;

    },
    // Save the value to localStore
    save: function () {

        setLocal(this.key, this.value);

    },
    // Set value
    set: function (key, value) {

        var attrs,
            self = this;

        if (util.isObject(key)) {
            attrs = key;
        } else {
            (attrs = {})[key] = value;
        }

        util.each(attrs, function (value, key) {

            self.value[key] = value;

        });

        // Save automatically
        this.save();

    }
});

// Create and add
storage.create = function (name, type) {

    var newStore;

    switch (type) {
        case 'localStorage':
            newStore = new LocalStore(name);
            break;
    }

    cache[name] = newStore;

    return newStore;

};

/* Wrapper of localStorage.setItem
 * And auto json stringify if it is a object
 */
function setLocal(key, value) {

    if (util.isObject(value)) {
        value = JSON.stringify(value);
    }

    localStore.setItem(key, value);

}

/* Wrapper of localStorage.getItem
 * And auto json pase if possible
 */
function getLocal(key) {

    var value = localStore.getItem(key);

    try {
        value = JSON.parse(value);
    } catch (e) {}

    return value;

}

// Wrapper of localStorage.removeItem
function removeLocal(key) {

    localStore.removeItem(key);

}

return storage;

 });
