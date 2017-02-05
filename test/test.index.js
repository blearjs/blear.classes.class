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
                AA.parent(this);
                this.aa = aa;
            }
        });

        AA.prototype.getAA = function () {
            return this.aa;
        };

        var BB = Class.extend({
            constructor: function (bb) {
                this.bb = bb;
                BB.parent(this);
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

    it('.extend:function', function () {
        var AA = Class.extend(function () {
            AA.parent(this);
            this.aa = 'aa';
        });

        var BB = AA.extend(function () {
            BB.parent(this);
        });

        var CC = BB.extend(function () {
            CC.parent(this);
        });

        var DD = CC.extend(function () {
            DD.parent(this);
        });

        var dd = new DD();
        expect(dd.aa).toBe('aa');
    });

    it('.extend:mix', function () {
        var AA = Class.extend(function () {
            AA.parent(this);
            this.aa = 'aa';
        });

        var BB = AA.extend(function () {
            BB.parent(this);
        });

        var CC = BB.extend({
            constructor: function () {
                CC.parent(this);
            },
            sayAA: function () {
                return this.aa;
            }
        });

        var DD = CC.extend(function () {
            DD.parent(this);
        });

        var dd = new DD();
        expect(dd.aa).toBe('aa');
        expect(dd.sayAA()).toBe('aa');
    });

    it('.extend:multiple', function (done) {
        var AA = Class.extend({
            constructor: function AA(aa) {
                this._aa = aa;
                AA.parent(this);
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
                BB.parent(this, aa);
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
                BB.invoke('destroy', this);
                this._bb = '';
            }
        });
        var CC = BB.extend({
            constructor: function CC(aa, bb, cc) {
                CC.parent(this, aa, bb);
                this._cc = cc;
            },
            getCC: function () {
                return this._cc;
            },
            destroy: function () {
                CC.invoke('destroy', this);
                this._cc = '';
            }
        });
        var DD = CC.extend({
            constructor: function (aa, bb, cc, dd) {
                DD.parent(this, aa, bb, cc);
                this._dd = dd;
            },
            getDD: function () {
                return this._dd;
            },
            destroy: function () {
                DD.invoke('destroy', this);
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

    it('.sole', function () {
        var A = Class.extend({
            constructor: function A(name) {
                this.name = name;
                A.parent(this);
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

    it('#invoke 1', function () {
        var A = Class.extend({
            constructor: function () {
                A.parent(this);
            },

            a: function () {
                return 'a';
            }
        });

        var B = A.extend({
            constructor: function () {
                B.parent(this);
            },
            a: function () {
                return B.invoke('a', this) + '/';
            }
        });

        var b = new B();
        expect(b.a()).toEqual('a/');
    });

    it('#invoke 2', function () {
        var A = Class.extend({
            constructor: function () {
                A.parent(this);
            },

            a: function () {
                return 'a';
            }
        });

        var B = A.extend({
            constructor: function () {
                B.parent(this);
            }
        });

        var C = B.extend({
            constructor: function () {
                C.parent(this);
            },
            a: function () {
                return C.invoke('a', this) + '/';
            }
        });

        var c = new C();
        expect(c.a()).toEqual('a/');
    });

    it('#invoke 3', function () {
        var A = Class.extend({
            constructor: function () {
                A.parent(this);
            },

            a: function () {
                return 'a';
            }
        });

        var B = A.extend({
            constructor: function () {
                B.parent(this);
            }
        });

        var C = B.extend({
            constructor: function () {
                C.parent(this);
            }
        });

        var D = C.extend({
            constructor: function () {
                D.parent(this);
            },
            a: function () {
                return D.invoke('a', this) + '/';
            }
        });

        var d = new D();
        expect(d.a()).toEqual('a/');
    });

    it('.parent constructor no instance', function () {
        var A = Class.extend({
            constructor: function () {
                A.parent(this);
            }
        });

        var B = A.extend({
            constructor: function () {
                B.parent();
            }
        });

        var errTimes = 0;

        try {
            new B();
        } catch (err) {
            errTimes++;
        }

        expect(errTimes).toEqual(1);
    });

    it('undefined prototype', function () {
        var times = 0;

        try {
            var A = Class.extend();
        } catch (err) {
            times++;
        }

        expect(times).toEqual(1);
    });

    it('empty prototype', function () {
        var times = 0;

        try {
            var A = Class.extend({});
        } catch (err) {
            times++;
        }

        expect(times).toEqual(1);
    });

    it('un object/function prototype', function () {
        var times = 0;

        try {
            var A = Class.extend(1);
        } catch (err) {
            times++;
        }

        expect(times).toEqual(1);
    });

    it('.ify', function () {
        Class.ify(Function);
        Class.ify(Function);
        var B = Function.extend({
            constructor: function (a, b) {
                B.parent(this);
                this.b = b;
            }
        });
        var C = function () {

        };

        var b = new B(1, 2);

        expect(b.length).toEqual(0);
        expect(b.b).toEqual(2);
        expect(Class.is(B)).toBe(true);
        expect(Class.is(C)).toBe(false);
    });

    it('.ify not function', function () {
        var A;
        var times = 0;

        try {
            Class.ify(A);
        } catch (err) {
            times++;
        }

        expect(times).toEqual(1);
    });

    it('invoke error', function () {
        var A = Class.extend({
            constructor: function () {
                A.parent(this);
            },

            say: function () {
                return __abc___def__();
            }
        });

        var B = A.extend({
            constructor: function () {
                B.parent(this);
            }
        });

        var C = B.extend({
            constructor: function () {
                ___mmm___nnn___();
                C.parent(this);
            }
        });

        var D = C.extend({
            constructor: function () {
                D.parent(this);
            }
        });

        try {
            var d1 = new D();
        } catch (err) {
            console.log(err.stack);
        }
    });

    it('.superInvoke', function () {
        var A = Class.extend(function () {

        });

        A.prototype.say = function () {
            return 'a';
        };

        var B = A.extend({
            constructor: function () {

            },

            say: function () {
                return B.superInvoke('say', this) + 'b';
            }
        });

        var b = new B();

        expect(b.say()).toBe('ab');
    });
});
