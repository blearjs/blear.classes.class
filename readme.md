# blear.classes.class

[![npm module][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![coverage][coveralls-img]][coveralls-url]

[travis-img]: https://img.shields.io/travis/blearjs/blear.classes.class/master.svg?maxAge=2592000&style=flat-square
[travis-url]: https://travis-ci.org/blearjs/blear.classes.class

[npm-img]: https://img.shields.io/npm/v/blear.classes.class.svg?maxAge=2592000&style=flat-square
[npm-url]: https://www.npmjs.com/package/blear.classes.class

[coveralls-img]: https://img.shields.io/coveralls/blearjs/blear.classes.class/master.svg?maxAge=2592000&style=flat-square
[coveralls-url]: https://coveralls.io/github/blearjs/blear.classes.class?branch=master


## 静态方法

### `.alias(aliasName, originalName)`
原型方法的别名。
```
var AA = Class.extend({
    constructor: function () {},
    a: function () {}
});

AA.alias('a2', 'a');
// AA.prototype.a2 === AA.prototype.a
```

### `.sole()`
生成唯一的随机值，用于原型受保护的方法、属性，防止继承类将其覆盖。
```
var AA = Class.extend({
    constructor: function () {
        this[_protectedProperty] = 123;
        this[_protectedMethod] = function () {};
    },
});
var _protectedProperty = AA.sole();
var _protectedMethod = AA.sole();
```

### `.extend(prototype)` 
基于当前类扩展新的子类。
```
var AA = Class.extend({
    constructor: function () {}
});

var BB = AA.extend({
    constructor: function () {}
});

// BB 继承了 AA
```

### `.parent(instance, [arg1, arg2])`、`parent[method](instance, [arg1, arg2])`
```
var AA = Class.extend({
    constructor: function () {},
    a: function () {}
});

var BB = AA.extend({
    constructor: function () {
        // 调用父类构造函数
        BB.parent(this);
    }
});

BB.protyotype.b = function () {
    // 调用父类原型 a 方法
    BB.parent.a(this);
};
```


### `.method(protoName, factory)`
```
var A = Class.extend({
    constructor: function () {}
});

A.method('get', function () {
    return 'get';
});
```


### `.ify(constructor)`
转换构造函数，添加 extend 方法
```
var A = function(){};

A = Class.ify(A);
A.extend(...);
```

