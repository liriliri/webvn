var each = exports.each = function (object, func)
{
    var key;

    if (object.length === +object.length)
    {
        for (var i = 0, len = object.length; i < len; i++) func(object[i], i);
    } else
    {
        for (key in object)
        {
            if (object.hasOwnProperty(key)) func(object[key], key);
        }
    }
};

exports.webvnFiles = function (o, ext)
{
    var path  = o.path,
        files = o.files,
        ret   = [];

    each(files, function (value) { ret.push(path + value + '.' + ext) });

    return ret;
};