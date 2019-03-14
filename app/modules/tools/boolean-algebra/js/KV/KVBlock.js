/**
 * Created by Sergej on 11.01.2017.
 */
/* Konstrukt, das lediglich zur Darstellung der Blöcke dient */
var IBlock = Class.extend(function () {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.value = 0;
    this.constructor = function(x, y, width, height, value) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
    };
    this.getValue = function(){
        return this.value;
    };
    this.setValue = function(val){
        this.value = val;
    };
    this.getX = function(){
        return this.x;
    };
    this.setX = function(x){
        this.x = x;
    };
    this.getY = function(){
        return this.y;
    };
    this.setY = function(y){
        this.y = y;
    };
    this.getWidth = function(){
        return this.width;
    };
    this.setWidth = function(width) {
        this.width = width;
    };
    this.getHeight = function(){
        return this.height;
    };
    this.setHeight = function(height) {
        this.height = height;
    };
});

var KVBlock = IBlock.extend(function () {
    this.cell = null;
    this.constructor = function(x, y, width, height, cell){
        this.cell = cell;
        this.super(x, y, width, height, cell.value);
    };
    this.setValue = function(val){
        this.cell.value = val;
    };
    this.getValue = function(){
        return this.cell.value;
    };
});