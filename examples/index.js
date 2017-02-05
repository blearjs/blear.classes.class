/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var Class = require('../src/index');

var UI = Class.extend({
    constructor: function() {
        UI.parent(this);
        this[_UIOptions] = {width: 100};
    },

    getWidth: function() {
        return this[_UIOptions].width;
    }
});
var _UIOptions = UI.sole();

var Window = UI.extend({
    constructor: function() {
        Window.parent(this);
        this[_WindowOptions] = {height: 200};
    },

    getHeight: function() {
        return this[_WindowOptions].height;
    }
});
var _WindowOptions = UI.sole();

var win = new Window();
win.getWidth();
// => 100

win.getHeight();
// => 200

