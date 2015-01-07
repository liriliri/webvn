// WebVn core modules unitesting

webvn.loader.ready(function() {

webvn.use(['util'], function(s, util) {

QUnit.test('Util type checking', function (assert) {

	assert.equal(util.isArray([]), true, '[] is Array');
	assert.equal(util.isFunc(function(){}), true, 'function () {} is function');

});

});

});