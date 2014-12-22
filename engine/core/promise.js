/* Module promise
 * I don't know when this module will be used
 * It's just created for fun at this momment
 */

webvn.add('promise', function (s) {

var PENDING = 0,
	FULFILLED = 1,
	REJECTED = 2;

function Promise() {

	var state = PENDING;
	var value = null;
	var handlers = [];

	function fulfill(result) {

		state = FULFILLED;
		value = result;
		handlers.forEach(handle);
		handlers = null;

	}

	function reject(error) {

		state = REJECTED;
		value = error;
		handlers.forEach(handle);
		handlers = null;

	}

	function resolve(result) {

		try {
			var then = getThen(result);
			if (then) {
				doResolve(then.bind(result), resolve, reject);
				return;
			}
			fulfill(result);
		} catch (e) {
			reject(e);
		}

	}

	function handle(handler) {

		if (state === PENDING) {
			handlers.push(handler);
		} else {
			if (state === FULFILLED &&
				typeof handlers.onFulfilled === 'function') {
				handler.onFulfilled(value);
			}
			if (state === REJECTED &&
				typeof handlers.onRejected === 'function') {
				handler.onRejected(value);
			}
		}

	}

	this.done = function (onFulfilled, onRejected) {

		setTimeout(function () {

			handle({
				onFulfilled: onFulfilled,
				onRejected: onRejected
			});

		}, 0);

	}

	this.then = function (onFulfilled, onRejected) {

		var self = this;

		return new Promise(function (result) {

			if (typeof onFulfilled === 'function') {
				try {
					return resolve(onFulfilled(result));
				} catch (ex) {
					return reject(ex);
				}
			} else {
				return resolve(result);
			}

		}, function (error) {

			if (typeof onRejected === 'function') {
				try {
					return resolve(onRejected(error));
				} catch (ex) {
					return reject(ex);
				}
			} else {
				return reject(error);
			}

		});

	}

	doResolve(fn, resolve, reject);

}

function getThen(value) {

	var t = typeof value;

	if (value && (t === 'object' || t === 'function')) {
		var then = value.then;
		if (typeof then === 'function') {
			return then;
		}
	}

	return null;

}

function doResolve(fn, onFulfilled, onRejected) {

	var done = false;

	try {
		fn(function (value) {

			if (done) {
				return;
			}
			done = true;
			onFulfilled(value);

		}, function (reason) {

			if (done) {
				return;
			}
			done = true;
			onRejected(reason);

		});
	} catch (ex) {
		if (done) {
			return;
		}
		done = true;
		onRejected(ex);
	}

}

});