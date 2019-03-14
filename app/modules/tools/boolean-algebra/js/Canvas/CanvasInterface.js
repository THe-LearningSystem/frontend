/**
 * Created by Sergej on 30.12.2016.
 */

var CanvasInterface = Class.extend(function () {
    this.create = function () {

    };
});

CanvasInterface.isTouch = false;
CanvasInterface.use = function (framework) {
    var interfaces = {"EaselJS": EaselInterface};
    return new interfaces[framework];
};