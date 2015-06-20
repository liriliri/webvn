WebVN.extend('util', function (exports)
{
    /**
     * @method endsWith
     * @param str
     * @param suffix
     * @return {Boolean}
     */
    exports.endsWith = function (str, suffix)
    {
        var index = str.length - suffix.length;

        return index >= 0 && str.indexOf(suffix, index) === index;
    };

    /**
     * @method startsWith
     * @param str
     * @param prefix
     * @return {Boolean}
     */
    exports.startsWith = function (str, prefix)
    {
        return str.indexOf(prefix) === 0;
    };

    var regTrimSpace = /^\s+|\s+$/g;

    /**
     * @method trim
     * @param str
     * @return {String}
     */
    exports.trim = function (str, chars)
    {
        if (!chars) return str.replace(regTrimSpace, '');

        return rtrim(ltrim(str, chars), chars);
    };

    var regTrimSpaceLeft = /^\s+/g;

    var ltrim = exports.ltrim = function (str, chars)
    {
        if (!chars) return str.replace(regTrimSpaceLeft, '');

        var start   = 0,
            len     = str.length,
            charLen = chars.length,
            found   = true,
            i, c;

        while (found && start < len)
        {
            found = false;
            i = -1;
            c = str.charAt(start);

            while (++i < charLen)
            {
                if (c === chars[i])
                {
                    found = true;
                    start++;
                    break;
                }
            }
        }

        return (start >= len) ?  '' : str.substr(start, len);
    };

    var regTrimSpaceRight = /\s+$/g;

    var rtrim = exports.rtrim = function (str, chars)
    {
        if (!chars) return str.replace(regTrimSpaceRight, '');

        var end     = str.length - 1,
            charLen = chars.length,
            found   = true,
            i, c;

        while (found && end >= 0)
        {
            found = false;
            i = -1;
            c = str.charAt(end);

            while (++i < charLen)
            {
                if (c === chars[i])
                {
                    found = true;
                    end--;
                    break;
                }
            }
        }

        return (end >= 0) ? str.substring(0, end + 1) : '';
    }

});