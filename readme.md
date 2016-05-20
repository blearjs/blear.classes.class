# blear.classes.class

[![Build Status][travis-img]][travis-url] 

[travis-img]: https://travis-ci.org/blearjs/blear.classes.class.svg?branch=master
[travis-url]: https://travis-ci.org/blearjs/blear.classes.class


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

### `.superConstruct(instance, [arg1, arg2])`、`superCall(instance, method, [arg1, arg2])`
```
var AA = Class.extend({
    constructor: function () {},
    a: function () {}
});

var BB = AA.extend({
    constructor: function () {
        // 调用父类构造函数
        BB.superConstruct(this);
    }
});

BB.protyotype.b = function () {
    // 调用父类原型 a 方法
    BB.superCall(this, 'a');
};
```

## 实例方法
