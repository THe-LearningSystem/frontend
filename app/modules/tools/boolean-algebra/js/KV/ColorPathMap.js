/**
 * Created by Sergej on 11.01.2017.
 */
var ColorPathMap = function(){
    this.diagram = null;
    this.canvas = null;

    this.layers = [];

    this.onChangedLayer = function(layer){};

    this.config = function(canvas, diagram) {
        this.diagram = diagram;
        this.canvas = canvas;
    };

    this.getLayer = function(color) {
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            if (layer.color == color) return layer;
        }
        return null;
    };

    this.clear = function(){
        this.layers.length = 0;
    };

    this.removeLayer = function(layer){
        var index = this.layers.indexOf(layer);
        this.layers.splice(index, 1);
        this.canvas.clearColorContainer();
        var blocks = this.analyze();
        this.diagram.colorBlocks(blocks);
    };

    this.analyze = function(cell, color) {
        if (cell && color) {
            var colorLayer = this.getLayer(color);
            if (colorLayer == null) {
                colorLayer = new ColorPathLayer(color);
                colorLayer.diagram = this.diagram;
                this.layers.push(colorLayer);
                this.onChangedLayer(colorLayer);
            }
            var length = colorLayer.toggleCell(cell, this.diagram.getWidth());
            if (length == 0) {
                var index = this.layers.indexOf(colorLayer);
                this.layers.splice(index, 1);
                this.onChangedLayer(colorLayer);
            }
        }

        var blocks = [];
        for (var i = 0; i < this.layers.length; i++) {
            blocks = blocks.concat(blocks, this.layers[i].blocks);
        }
        return blocks;
    };
};