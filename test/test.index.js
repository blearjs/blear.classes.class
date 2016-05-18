/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Class = require('../src/index.js');

describe('测试文件', function () {
    it('.extend', function (done) {
        var AA = Class.extend({
            constructor: function (aa) {
                this.aa = aa;
            }
        });

        AA.prototype.getAA = function () {
            return this.aa;
        };

        var BB = Class.extend({
            constructor: function (bb) {
                this.bb = bb;
            },
            getBB: function () {
                return this.bb;
            }
        });

        var aa = new AA('aa');
        var bb = new BB('bb');

        expect(aa.getAA()).toEqual('aa');
        expect(bb.getBB()).toEqual('bb');
        expect(aa.constructor).toBe(AA);
        expect(bb.constructor).toBe(BB);
        expect(aa instanceof AA).toBe(true);
        expect(bb instanceof BB).toBe(true);

        done();
    });

    it('.extend:multiple', function (done) {
        var AA = Class.extend({
            constructor: function AA(aa) {
                this._aa = aa;
            }
        });
        AA.prototype.getAA = function () {
            return this._aa;
        };
        AA.prototype.destroy = function () {
            this._aa = '';
        };
        var BB = AA.extend({
            constructor: function BB(aa, bb) {
                this.Super(aa);
                this._bb = bb;
            },
            getBB: function () {
                return this._bb;
            },
            // @override
            getAA: function () {
                return this._aa.toUpperCase();
            },
            destroy: function () {
                this.Super.destroy();
                this._bb = '';
            }
        });
        var CC = BB.extend({
            constructor: function CC(aa, bb, cc) {
                this.Super(aa, bb);
                this._cc = cc;
            },
            getCC: function () {
                return this._cc;
            },
            destroy: function () {
                this.Super.destroy();
                this._cc = '';
            }
        });
        var DD = CC.extend({
            constructor: function (aa, bb, cc, dd) {
                this.Super(aa, bb, cc);
                this._dd = dd;
            },
            getDD: function () {
                return this._dd;
            },
            destroy: function () {
                this.Super.destroy();
                this._dd = '';
            }
        });

        var aa4 = new AA('aa4.1');
        var bb4 = new BB('aa4.2', 'bb4.2');
        var cc4 = new CC('aa4.3', 'bb4.3', 'cc4.3');
        var dd4 = new DD('aa4.4', 'bb4.4', 'cc4.4', 'dd4.4');

        expect(aa4.getAA()).toEqual('aa4.1');
        expect(bb4.getAA()).toEqual('AA4.2');
        expect(cc4.getAA()).toEqual('AA4.3');
        expect(dd4.getAA()).toEqual('AA4.4');

        expect(bb4.getBB()).toEqual('bb4.2');
        expect(cc4.getBB()).toEqual('bb4.3');
        expect(dd4.getBB()).toEqual('bb4.4');

        expect(cc4.getCC()).toEqual('cc4.3');
        expect(dd4.getCC()).toEqual('cc4.4');

        expect(dd4.getDD()).toEqual('dd4.4');

        aa4.destroy();
        bb4.destroy();
        cc4.destroy();
        dd4.destroy();

        expect(aa4.getAA()).toEqual('');
        expect(bb4.getAA()).toEqual('');
        expect(cc4.getAA()).toEqual('');
        expect(dd4.getAA()).toEqual('');

        expect(bb4.getBB()).toEqual('');
        expect(cc4.getBB()).toEqual('');
        expect(dd4.getBB()).toEqual('');

        expect(cc4.getCC()).toEqual('');
        expect(dd4.getCC()).toEqual('');

        expect(dd4.getDD()).toEqual('');

        expect(dd4.constructor).toBe(DD);
        expect(dd4 instanceof DD).toBe(true);
        expect(dd4 instanceof CC).toBe(true);
        expect(dd4 instanceof BB).toBe(true);
        expect(dd4 instanceof AA).toBe(true);

        done();
    });

    it('.alias', function () {
        var A = Class.extend({
            constructor: function A(name) {
                this.name = name;
            },
            say: function () {
                return this.name;
            }
        });

        A.alias('speak', 'say');

        var a = new A('a');

        expect(a.say()).toEqual(a.speak());
    });

    it('.sole', function () {
        var A = Class.extend({
            constructor: function A(name) {
                this.name = name;
            },
            say: function () {
                return this[_wrapName](this.name);
            }
        });

        var _wrapName = A.sole();
        A.prototype[_wrapName] = function () {
            return ['[', this.name, ']'].join('');
        };

        var a = new A('a');

        expect(a.say()).toEqual('[a]');
        expect(typeof a._wrapName).toEqual('undefined');
        expect(typeof a[_wrapName]).toEqual('function');
    });

    it('.Super', function () {
        var A = Class.extend({
            constructor: function () {

            }
        });

        A.prototype.say = function (name) {
            return 'i am ' + name;
        };

        var B = A.extend(function () {
            this.Super();
        });

        B.prototype.say = function (name) {
            return 'A say: "' + this.Super.saySomeThing(name) + '"';
        };

        var a = new A();
        var b = new B();
        var callError = false;

        var a1 = a.say('cloudcome');
        try {
            var b1 = b.say('cloudcome');
        } catch (err) {
            console.log(err);
            callError = true;
        }

        expect(a1).toEqual('i am cloudcome');
        expect(callError).toEqual(true);
    });
});
