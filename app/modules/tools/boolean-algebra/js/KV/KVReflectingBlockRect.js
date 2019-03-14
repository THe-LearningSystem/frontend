/**
 * Created by Sergej on 02.02.2017.
 */
var _Rectangle_ = Class.extend(function () {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.constructor = function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
});
var KVReflectingBlockRectOpen = function () {
    this.right = false;
    this.left = false;
    this.up = false;
    this.down = false;
};
var KVReflectingBlockRect = _Rectangle_.extend(function () {
    this.block = null;
    this.open = new KVReflectingBlockRectOpen();
    this.constructor = function (x, y, width, height, block) {
        this.block = block;
        this.super(x, y, width, height);
    };
});