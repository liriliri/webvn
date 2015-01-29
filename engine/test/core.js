// WebVn core modules unitesting

webvn.loader.ready(function() {

webvn.use(['util', 'template'], function(s, util, template) {

QUnit.test('Template Module', function (assert) {

    var tpl1 = template('<div><%$out+=data;%></div>');
    assert.equal(tpl1({data:'WebVN'}), '<div>WebVN</div>', 'basic');

});

QUnit.test('Util Module', function (assert) {

    // endsWith
    assert.ok(util.endsWith('WebVN', 'VN'), 'endsWith');

    // inArray
    assert.ok(util.inArray(5, [4, 5, 6]), 'inArray');

    // isType
    assert.ok(util.isArray([]), 'isArray');
    assert.ok(util.isFunction(function(){}), 'isFunc');
    assert.ok(util.isPlainObject({}), 'isPlainObj {} true');
    assert.ok(!util.isPlainObject(''), 'isPlainObj \'\' false');
    assert.ok(!util.isPlainObject(function(){}), 'isPlainObj function(){} false');
    assert.ok(util.isString('str'), 'isString');

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
    assert.ok(util.startsWith('WebVN', 'Web'), 'startsWith');

    // trim
    assert.equal(util.trim(' WebVN   '), 'WebVN', 'trim');

});

});

});