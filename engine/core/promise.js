/* Module promise
 * I don't know when this module will be used
 * It's just created for fun at this momment
 */

webvn.add('promise', ['class', 'util'], function (s, kclass, util) {

var PENDING = 0,
	FULFILLED = 1,
	REJECTED = 2;

var Promise = kclass.create({
	constructor: function Promise(resolver) {

		// store state which can be PENDING, FULFILLED or REJECTED
		this.state = PENDING;
		// store value or error once FULFILLED or REJECTED
		this.value = null;
		// store sucess & failure handlers attached by calling .then or .done
		this.handlers = [];

		this._init(resolver);

	},
	done: function (onFulfilled, onRejected) {

		var self = this;

		setTimeout(function () {

			self._handle({
				onFulfilled: onFulfilled,
				onRejected: onRejected
			});

		}, 0);

	},
	then: function (onFulfilled, onRejected) {

		var self = this;

		return new Promise(function (resolve, reject) {

			return self.done(function (result) {

				if (util.isFunc(onFulfilled)) {
					try {
						return resolve(onFulfilled(result));
					} catch (e) {
						return reject(e);
					}
				} else {
					return resolve(result);
				}

			}, function (error) {

				if (util.isFunc(onRejected)) {
					try {
						return resolve(onRejected(error));
					} catch (e) {
						return reject(e);
					}
				} else {
					return reject(error);
				}

			});

		});

	},
	/* Top method built on _fulfill
	 * If the result is a promise, wait for it to be complete
	 */
	_resolve: function (result) {

		try {
			var then = this._getThen(result);
			if (then) {
				this._init(then.bind(result));
				return;
			}
			this._fulfill(result);
		} catch (e) {
			this._reject(e);
		}

	},
	// Change state to be fulfilling
	_fulfill: function (result) {

		this.state = FULFILLED;
		this.value = result;
		this.handlers.forEach(this._handle.bind(this));
		this.handlers = null;

	},
	/* Check if a value is a Promise and, if it is,
	 * return the `then` method of that promise.
	 */
	_getThen: function (value) {

		if (util.isObj(value)) {
			var then = value.then;
			if (util.isFunc(then)) {
				return then;
			}
		}

	},
	_handle: function (handler) {

		if (this.state === PENDING) {
			this.handlers.push(handler);
		} else {
			if (this.state === FULFILLED &&
				util.isFunc(handler.onFulfilled)) {
				handler.onFulfilled(this.value);
			}
			if (this.state === REJECTED &&
				util.isFunc(handler.onRejected)) {
				handler.onRejected(this.value);
			}
		}

	},
	_init: function (resolver) {

		var resolved = false,
			self = this;

		try {
			resolver(function (value) {

				if (resolved) {
					return;
				}
				resolved = true;
				self._resolve(value);

			}, function (reason) {

				if (resolved) {
					return;
				}
				resolved = true;
				self._reject(reason);

			});
		} catch (e) {
			self._reject(e);
		}

	},
	// Change state to be rejecting
	_reject: function (error) {

		this.state = REJECTED;
		this.value = error;
		this.handlers.forEach(this._handle.bind(this));
		this.handlers = null;

	}
});

return Promise;

});