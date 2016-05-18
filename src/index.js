/**
 * 类的继承
 * @author ydr.me
 * @create 2014-10-04 15:09
 * @update 2016年04月22日01:41:01
 */

'use strict';


             require('blear.polyfills.object');
var access = require('blear.utils.access');
var typeis = require('blear.utils.typeis');
var object = require('blear.utils.object');
var fun =    require('blear.utils.function');
var random = require('blear.utils.random');

var classId = 0;
var rePublicKey = /^[a-zA-Z_][a-zA-Z\d]*$/;
var CONSTRUCTOR_NAME = 'constructor';


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
var Class = module.exports = function Class() {
    // Class constructor
};

Class.classId = classId++;
Class.className = 'Class';
Class.superClass = null;



/**
 * 类的继承
 * @param prototype {Object} 原型链
 * @param prototype.constructor {Function} 构造函数
 * @param [prototype.className="anonymous"] {String} 类的命令
 * @returns {Class}
 */
module.exports.extend = function extend(prototype) {
    if (!prototype) {
        throw new SyntaxError('原型链不能为空');
    }

    var superClass = this;
    var constructor = prototype.constructor;

    if (!typeis.Function(constructor) || constructor === Object) {
        throw new SyntaxError('原型链的构造函数不能为空');
    }

    /**
     * 赋值 Super
     * @param the
     */
    var assignSuperPrototype = function (the) {
        the.Super = {};
        the.Super.classId = superClass.classId;
        the.Super.className = superClass.className;
        the.Super.superClass = superClass.superClass;

        object.each(superClass.prototype, function (superKey, superVal) {
            if (superKey !== CONSTRUCTOR_NAME && rePublicKey.test(superKey) && typeis.Function(superVal)) {
                the.Super[superKey] = function () {
                    return superVal.apply(the, arguments);
                };
            }
        });
    };

    /**
     * 子类
     */
    var ChildClass = function () {
        var the = this;

        /**
         * @type Function
         */
        the.Super = function () {
            superClass.apply(the, arguments);
        };

        constructor.apply(the, arguments);
    };

    /**
     * 类的原型继承
     * @type {superClass}
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
    ChildClass.className = prototype.className = prototype.className || fun.name(ChildClass);

    /**
     * 当前类的父类指向
     * @type {exports}
     */
    ChildClass.superClass = superClass;

    /**
     * 子类原型
     * @type {ChildClass}
     */
    prototype.constructor = ChildClass;

    /**
     * 子类的继承方法
     * @type {Function}
     */
    ChildClass.extend = extend;

    /**
     * 类的别名
     * @param aliasName {String} 别名
     * @param originalName {String} 原名
     */
    ChildClass.alias = function alias(aliasName, originalName) {
        ChildClass.prototype[aliasName] = ChildClass.prototype[originalName]
    };

    /**
     * 生成类唯一识别号，用于创建保护属性名
     * @returns {string}
     */
    ChildClass.sole = function sole() {
        return '__' + ChildClass.className + '_' + random.guid();
    };

    /**
     * 给原型添加 Super 功能
     */
    ChildClass.Super = function () {
        /**
         * 原型链复原
         */
        object.each(ChildClass.__classSuper__ ? ChildClass.prototype : prototype, function (key, val) {
            var oldVal = val;

            if (!oldVal.__classSuper__ && key !== CONSTRUCTOR_NAME && typeis.Function(oldVal)) {
                val = function () {
                    var the = this;

                    assignSuperPrototype(the);
                    var ret = oldVal.apply(the, arguments);
                    the.Super = null;
                    return ret;
                };
                val.__classSuper__ = true;
            }

            ChildClass.prototype[key] = val;
        });

        ChildClass.__classSuper__ = true;
    };

    ChildClass.Super();

    return ChildClass;
};