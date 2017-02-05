/**
 * 类的继承
 * @author ydr.me
 * @create 2014年10月04日15:09:02
 * @update 2016年04月22日01:41:01
 * @update 2016年11月23日11:23:54
 */

'use strict';


var access = require('blear.utils.access');
var typeis = require('blear.utils.typeis');
var object = require('blear.utils.object');
var random = require('blear.utils.random');
var debug = require('blear.utils.debug');

var classId = 0;
// var rePublicKey = /^[a-zA-Z_][a-zA-Z\d]*$/;
// var CONSTRUCTOR_NAME = 'constructor';
var CLASSIFY_NAME = '__classify__';
// var reParentCall = /\.parent\(/;

var makeExtend = function (superClass) {
    if (superClass[CLASSIFY_NAME] && superClass.extend) {
        return superClass.extend;
    }

    superClass[CLASSIFY_NAME] = true;
    superClass.classId = superClass.prototype.classId
        = superClass.classId || superClass.prototype.classId || classId++;
    superClass.className = superClass.prototype.className;
    return function extend(prototype) {
        if (!prototype) {
            throw new SyntaxError('原型链不能为空');
        }

        if (!typeis.Object(prototype) && !typeis.Function(prototype)) {
            throw new SyntaxError('原型链必须为一个 Object/Function 实例');
        }

        if (typeis.Function(prototype)) {
            prototype = {
                constructor: prototype
            };
        }

        var ChildClass = prototype.constructor;

        if (!typeis.Function(ChildClass) || ChildClass === Object) {
            throw new SyntaxError('原型链的构造函数不能为空');
        }


        /**
         * 类的原型继承
         * @type {Object}
         */
        ChildClass.prototype = Object.create(superClass.prototype);


        /**
         * 类的 ID
         * @type {number}
         */
        ChildClass.classId = prototype.classId = classId++;


        /**
         * 类的名称
         * @type {*|string}
         */
        ChildClass.className = prototype.className;


        /**
         * 当前类的父类指向
         * @type {exports}
         */
        ChildClass.superClass = prototype.superClass = superClass;


        /**
         * 子类原型
         * @type {ChildClass}
         */
        prototype.constructor = ChildClass;


        /**
         * 生成类唯一识别号，用于创建保护属性名
         * @returns {string}
         */
        ChildClass.sole = function sole() {
            return '_' + ChildClass.className + '_' + random.guid();
        };


        /**
         * 调用父级的构造函数
         * @param instance {Object} 子级实例
         */
        ChildClass.parent = function (instance/*arguments*/) {
            if (!instance || !instance.classId) {
                throw new SyntaxError('调用父级构造方法时，必须传递当前实例。');
            }

            var args = access.args(arguments).slice(1);
            superClass.apply(instance, args);

            // 向上传递错误实例的错误堆栈
            try {
                Error.captureStackTrace(instance, ChildClass);
            } catch (err) {
                // ignore
            }
        };


        /**
         * 调用祖先原型方法
         * @param method {String} 方法名称
         * @param instance {Object} 实例
         * @returns {*}
         */
        ChildClass.invoke = function (method, instance/*arguments*/) {
            // 这里会自动向祖先查找原型方法
            var fn = superClass.prototype[method];

            if (!typeis.Function(fn)) {
                throw new ReferenceError('未找到祖先的`' + method + '`原型方法');
            }

            var args = access.args(arguments).slice(2);
            return fn.apply(instance, args)
        };


        ChildClass.superInvoke = debug.deprecate(ChildClass.invoke, '使用 `.invoke` 方法代替');


        /**
         * 原来的原型
         */
        object.each(prototype, function (protoKey, protoVal) {
            ChildClass.prototype[protoKey] = protoVal;
        });


        /**
         * 子类的继承方法
         * @type {Function}
         */
        ChildClass.extend = makeExtend(ChildClass);


        return ChildClass;
    };
};


/**
 * Class 就是一个根类，所有基于 Class 扩展出来的类都具有以下静态方法
 *
 * # 静态方法
 * - `.sole` 生成唯一的随机值，用于原型方法
 * - `.alias` 原型方法的别名
 * - `.extend` 基于当前类扩展新的子类

 * # 实例方法
 * **只能同步调用**
 * - `this.Super()` 执行父类构造函数，需要手动执行
 * - `this.Super.someMethod()` 执行祖先类的原型方法
 *
 * @class Class
 */
var Class = function Class() {
    // Class constructor
};

Class.classId = classId++;
Class.className = 'Class';
Class.superClass = null;
Class.prototype = {
    constructor: Class,
    classId: Class.classId,
    className: Class.className,
    superClass: Class.superClass
};

/**
 * Class 化
 * @param constructor {Function} 构造函数
 * @returns {*}
 */
Class.ify = function (constructor) {
    if (!typeis.Function(constructor)) {
        throw new SyntaxError('ify constructor 必须是构造函数');
    }

    constructor.extend = makeExtend(constructor);
    return constructor;
};

/**
 * 判断是否为 Class 扩展类
 * @param constructor
 * @returns {boolean}
 */
Class.is = function (constructor) {
    if (!typeis.Function(constructor)) {
        return false;
    }

    return Boolean(constructor[CLASSIFY_NAME]);
};

/**
 * 类的继承
 * @param prototype {Object} 原型链
 * @param prototype.constructor {Function} 构造函数
 * @param [prototype.className="anonymous"] {String} 类的命令
 * @returns {constructor}
 */
Class.extend = makeExtend(Class);
module.exports = Class;