/* Module ajax
 * Base on promise module
 * Also extends the loader module
 */

webvn.add('ajax', ['util', 'promise'], function (s, util, Promise) {

var ajax = function (method, url, data, options) {

	// Format
	method = method.toUpperCase();
	data = data || null;
	options = options || {};

	var xhr = getXHR();

	return new Promise(function (resolve, reject) {

		xhr.open(method, url);

		xhr.onload = function () {

			if (xhr.status === 200) {
				resolve(xhr.response);
			} else {
				reject(Error(xhr.statusText));
			}

		};

		// Request error
		xhr.onerror = function () {

			reject(Error('Network Error'));

		};

		xhr.send();

	});

};

ajax.get = function (url, data, options) {

	return ajax('get', url, data, options);

};

ajax.post = function () {

	return ajax('post', url, data, options);

};

// So far, I do not consider the older browers
function getXHR() {
	return new window.XMLHttpRequest;
}

return ajax;

});