# blear.classes.class

[![Build Status][travis-img]][travis-url] 

[travis-img]: https://travis-ci.org/blearjs/blear.classes.class.svg?branch=master
[travis-url]: https://travis-ci.org/blearjs/blear.classes.class


## 静态方法

### `alias(aliasName, originalName)`
原型方法的别名。
```
var AA = Class.extend({
    constructor: function () {},
    a: function () {}
});

AA.alias('a2', 'a');
// AA.prototype.a2 === AA.prototype.a
```

### `sole()`
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

### `extend(prototype)` 
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

### `Super()`
如果在 `extend` 之后还用到了实例的 `Super` 方法，则需要手动再执行一次。

```
var AA = Class.extend({
    constructor: function () {},
    a: function () {}
});

var BB = AA.extend({
    constructor: function () {
        // 调用父类构造函数
        this.Super();
    }
});

BB.protyotype.b = function () {
    // 在 extend 之后调用 Super
    this.Super.a();
    // ...
};

BB.Super();
```

## 实例方法

### `this.Super([arg, ...])`
**只能同步调用**，执行父类的构造函数。

### `this.Super.someMethod([arg, ...])`
**只能同步调用**，执行父类的原型方法。
