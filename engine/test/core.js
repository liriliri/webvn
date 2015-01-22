// WebVn core modules unitesting

webvn.loader.ready(function() {

webvn.use(['util'], function(s, util) {

QUnit.test('Util Module', function (assert) {

	// endsWith
	assert.equal(util.endsWith('WebVN', 'VN'), true, 'endsWith');

	// isType
	assert.equal(util.isArray([]), true, 'isArray');
	assert.equal(util.isFunction(function(){}), true, 'isFunc');
	assert.equal(util.isPlainObject({}), true, 'isPlainObj {} true');
	assert.equal(util.isPlainObject(''), false, 'isPlainObj \'\' false');
	assert.equal(util.isPlainObject(function(){}), false, 'isPlainObj function(){} false');
	assert.equal(util.isString('str'), true, 'isString');

	// keys
	var keys = {
		'key1': 5,
		'key2': 10 
	}
	assert.deepEqual(util.keys(keys), ['key1', 'key2'], 'keys');

	// merge
	var mergeA = {
			a: 5,
			c: 10,
			d: 30
		},
		mergeB = {
			a: 15,
			b: 25
		},
		mergeC = {
			c: 35
		},
		mergeResult = {
			a: 15,
			b: 25,
			c: 35,
			d: 30
		};
	assert.deepEqual(util.merge(mergeA, mergeB, mergeC), mergeResult, 'merge');

	// mix
	var mixA = {
			a: 5,
			b: 10,
			c: {
				d: 15
			}
		},
		mixB = {
			a: 5,
			d: 15,
			c: {
				d: 20,
				e: 25
			}
		},
		mixResult = {
			a: 5,
			b: 10,
			d: 15,
			c: {
				d: 20,
				e: 25
			}
		};
	assert.deepEqual(util.mix(mixA, mixB), mixResult, 'mix');

	// startsWith
	assert.equal(util.startsWith('WebVN', 'Web'), true, 'startsWith');

});

});

});