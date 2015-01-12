---
layout: api
extracss: api
title: Util
---

|功能|类underscore通用函数库|


### 函数

<div class="function" markdown="1">

#### clone(o)：创建一个 普通对象 或数组的深拷贝, 并且返回

<div class="detail" markdown="1">

o(Array\|object)

待深拷贝的对象或数组

------------------------------

return

拷贝后的新对象

</div>

</div>

<div class="function" markdown="1">

#### each(o, fn)：遍历数组或对象中的每一项, 执行指定方法

<div class="detail" markdown="1">

o(Array\|object)

需要遍历的数组或对象

------------------------------

fn(Function)

执行时， 接收3个参数：

- 当o为数组时，参数为当前数组单项值，当前index, 数组o
- 当o为对象时，参数为当前值，当前键，对象o

------------------------------

return

数组或对象本身

</div>

</div>

<div class="function" markdown="1">

#### endsWith(str, suffix)：判断str是否以suffix结尾

<div class="detail" markdown="1">

str(String)

查找字符串

------------------------------

suffix(String)

后缀字符串

------------------------------

return(Boolean)

str是否以suffix结尾

</div>

</div>

<div class="function" markdown="1">

#### guid(prefix)：返回全局唯一id

<div class="detail" markdown="1">

prefix(String)

唯一id前缀

------------------------------

return(String)

全局唯一id

</div>

</div>

<div class="function" markdown="1">

#### inArray(elem, arr)：判断元素elem是否在数组arr中

<div class="detail" markdown="1">

elem

任意对象

------------------------------

arr(Array)

数组

------------------------------

return(Boolean)

elem是否在数组arr中

</div>

</div>

<div class="function" markdown="1">

#### indexOf(elem, arr)：返回元素elem在数组arr中的序号

<div class="detail" markdown="1">

elem

任意对象

------------------------------

arr(Array)

数组

------------------------------

return(Number)

elem在数组arr中的序号

</div>

</div>

<div class="function" markdown="1">

#### isArray(input)：判断是否为数组

<div class="detail" markdown="1">

input

需要判断的参数

------------------------------

return(Boolean)

是否是数组

</div>

</div>

<div class="function" markdown="1">

#### isFunc(input)：判断是否为函数

<div class="detail" markdown="1">

input

需要判断的参数

------------------------------

return(Boolean)

是否是函数

</div>

</div>

<div class="function" markdown="1">

#### isNumber(input)：判断是否为数字

<div class="detail" markdown="1">

input

需要判断的参数

------------------------------

return(Boolean)

是否是数字

</div>

</div>

<div class="function" markdown="1">

#### isObj(input)：判断是否为对象

<div class="detail" markdown="1">

input

需要判断的参数

------------------------------

return(Boolean)

是否是Object

</div>

</div>

<div class="function" markdown="1">

#### isPlainObj(input)：判断是否是普通对象

<div class="detail" markdown="1">

input

需要判断的参数

------------------------------

return(Boolean)

是否是普通对象，通过{}或new FunctionClass/Object()创建的, 不包括内置对象以及宿主对象

</div>

</div>

<div class="function" markdown="1">

#### isString(input)：判断是否为字符串

<div class="detail" markdown="1">

input

需要判断的参数

------------------------------

return(Boolean)

是否是字符串

</div>

</div>

<div class="function" markdown="1">

#### keys(o)：将对象的所有属性名作为数组返回

<div class="detail" markdown="1">

o

需要遍历的对象

------------------------------

return(Array)

属性名数组

    var o = {x: 1, y: 2};
    util.keys(o) => ['x', 'y'];

</div>

</div>

<div class="function" markdown="1">

#### map(o, fn)：创建一个新数组, 数组结果是在对每个原数组或对象元素调用指定函数返回值

<div class="detail" markdown="1">

o(Array\|Object)

需要遍历的数组或对象

------------------------------

fn(Function)

能够根据原数组当前元素返回新数组元素的函数

------------------------------

return(Array)

返回符合根据指定函数调用得到的新数组

</div>

</div>

<div class="function" markdown="1">

#### startsWith(str, prefix)：判断str是否以prefix开头

<div class="detail" markdown="1">

str(String)

查找字符串

------------------------------

prefix(String)

前缀字符串

------------------------------

return(Boolean)

str是否以prefix开头

</div>

</div>

<div class="function" markdown="1">

#### trim(str)：去除字符串两端的空白字符

<div class="detail" markdown="1">

str(String)

原始字符串

------------------------------

return(String)

去除空白后新的字符串

</div>

</div>