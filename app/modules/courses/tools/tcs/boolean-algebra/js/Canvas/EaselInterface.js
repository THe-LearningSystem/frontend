/**
 * Created by Sergej on 11.01.2017.
 */

var EaselInterface = CanvasInterface.extend(function () {
    this.create = function (id) {
        var canvas = document.getElementById(id);

        /* Wenn es sich nicht um ein CANVAS-Tag handelt,
        sondern um ein div Container, so erstellte ein Canvas Objekt innerhalb dieses Containers */
        if (!canvas || canvas.tagName != "CANVAS") {
            var c = document.createElement("CANVAS");
            var cName = id + "_canvas";
            c.setAttribute("id", cName);
            canvas.appendChild(c);
            canvas = c;
            id = cName;
        }

        const labelColor = '#333';

        /* Initialisierung der Schichten */
        var stage = new createjs.Stage(id);
        stage.name = "stage";
        stage.enableMouseOver(20);

        var colorContainer = new createjs.Container();
        colorContainer.name = "colorContainer";
        colorContainer.x = colorContainer.y = 0;
        var gridOffset = {x: 0, y: 0};

        var blockContainer = new createjs.Container();
        blockContainer.name = "blockContainer";
        blockContainer.x = blockContainer.y = 0;

        var hoverContainer = new createjs.Container();
        hoverContainer.name = "hoverContainer";
        hoverContainer.x = hoverContainer.y = 0;


        var getHoverFullAlpha = function () {
          return CanvasInterface.isTouch ? 0 : 1;
        };
        var hoverBlock = new createjs.Shape();
        hoverBlock.x = hoverBlock.y = 0;
        hoverBlock.alpha = 0;

        /* Füge alle Schichten ein */
        hoverContainer.addChild(hoverBlock);

        stage.addChild(blockContainer);
        stage.addChild(colorContainer);
        stage.addChild(hoverContainer);

        const HALFSIZE = KVDiagram.SIZE / 2;
        const FOURSIZE = KVDiagram.SIZE / 4;

        const roundFactor = 5;
        canvas.colorBlock = function(block, color, x, y, width, height) {
            /* Zeichne einen gefärbten Block */
            block.graphics.setStrokeStyle(2).beginStroke(color).drawRoundRect(x,y, width - 1, height - 1, roundFactor).endStroke();
        };
        var openDownBlock = function(block, color, x, y, width, height, exclude){
            /* Zeichnen einen Block der nach unten geoffnet ist (optional: zusätzliche Öffnung nach rechts/links) */
            var g = block.graphics.setStrokeStyle(2), h = y + height, w = x + width;
            if (exclude && exclude == 'left') {
                g.beginStroke(color).moveTo(w / 2 - FOURSIZE, y).lineTo(w / 2, y).endStroke();
            } else {
                g.beginStroke(color).moveTo(x, h - HALFSIZE).lineTo(x,y + roundFactor).quadraticCurveTo(x, y, x + roundFactor, y).endStroke();
                g.beginStroke(color).moveTo(x + roundFactor, y).lineTo(w / 2, y).endStroke();
            }
            if (exclude && exclude == 'right') {
                g.beginStroke(color).moveTo(w / 2, y).lineTo(w - HALFSIZE, y).endStroke();
            } else {
                g.beginStroke(color).moveTo(w / 2, y).lineTo(w - roundFactor, y).quadraticCurveTo(w, y, w, y + roundFactor).endStroke();
                g.beginStroke(color).moveTo(w, y + roundFactor).lineTo(w, h - HALFSIZE).endStroke();
            }
        };
        var openUpBlock = function(block, color, x, y, width, height, exclude){
            /* Zeichnen einen Block der nach oben geoffnet ist (optional: zusätzliche Öffnung nach rechts/links) */
            var g = block.graphics.setStrokeStyle(2), h = y + height, w = x + width;
            if (exclude && exclude == 'left') {
                g.beginStroke(color).moveTo(w / 2 - FOURSIZE, h).lineTo(w / 2, h).endStroke();
            } else {
                g.beginStroke(color).moveTo(x, y + HALFSIZE).lineTo(x, h - roundFactor).quadraticCurveTo(x, h, x + roundFactor, h).endStroke();
                g.beginStroke(color).moveTo(x + roundFactor, h).lineTo(w / 2, h).endStroke();
            }
            if (exclude && exclude == 'right') {
                g.beginStroke(color).moveTo(x / 2, h).lineTo(w - HALFSIZE, h).endStroke();
            } else {
                g.beginStroke(color).moveTo(w / 2, h).lineTo(w - roundFactor, h).quadraticCurveTo(w, h, w, h - roundFactor).endStroke();
                g.beginStroke(color).moveTo(w, h - roundFactor).lineTo(w, y + HALFSIZE).endStroke();
            }

        };
        var openLeftBlock = function(block, color, x, y, width, height){
            /* Zeichnen einen Block der nach links geoffnet ist */
            var g = block.graphics.setStrokeStyle(2), s = x + width, h = y + height;
            g.beginStroke(color).moveTo(x + HALFSIZE, y).lineTo(s - roundFactor,y).quadraticCurveTo(s,y,s,y + roundFactor).endStroke();
            g.beginStroke(color).moveTo(s, y + roundFactor).lineTo(s, h).endStroke();
            g.beginStroke(color).moveTo(s, h - roundFactor).quadraticCurveTo(s,h,s = s - roundFactor,h).endStroke();
            g.beginStroke(color).moveTo(s, h).lineTo(x + HALFSIZE, h).endStroke();
        };
        var openRightBlock = function(block, color, x, y, width, height){
            /* Zeichnen einen Block der nach rechts geoffnet ist */
            var g = block.graphics.setStrokeStyle(2), s = 0, h = y + height;
            g.beginStroke(color).moveTo(x + width - HALFSIZE, y).lineTo(x + roundFactor,y).quadraticCurveTo(x,y,x,s = y + roundFactor).endStroke();
            g.beginStroke(color).moveTo(x, s).lineTo(x, s = h - roundFactor).endStroke();
            g.beginStroke(color).moveTo(x, s).quadraticCurveTo(x,h,x + roundFactor,h).endStroke();
            g.beginStroke(color).moveTo(x + roundFactor, h).lineTo(x + width - HALFSIZE, h).endStroke();
        };

        canvas.createColorBlock = function(rect) {
            var shape = new createjs.Shape();
            shape.x = rect.x;
            shape.y = rect.y;

            /* Überprüfe darauf, welche Öffnungen vorhanden sind und wähle dementsprechend den richtigen Block */
            if (rect.open.up) {
                if (rect.open.left) {
                    openUpBlock(shape, rect.block.color, 0, 0, rect.width, rect.height, 'left');
                } else if (rect.open.right) {
                    openUpBlock(shape, rect.block.color, 0, 0, rect.width, rect.height, 'right');
                } else {
                    openUpBlock(shape, rect.block.color, 0, 0, rect.width, rect.height);
                }
            } else if (rect.open.down) {
                if (rect.open.left) {
                    openDownBlock(shape, rect.block.color, 0, 0, rect.width, rect.height, 'left');
                } else if (rect.open.right) {
                    openDownBlock(shape, rect.block.color, 0, 0, rect.width, rect.height, 'right');
                } else {
                    openDownBlock(shape, rect.block.color, 0, 0, rect.width, rect.height);
                }
            } else if (rect.open.left) {
                openLeftBlock(shape, rect.block.color, 0, 0, rect.width, rect.height);
            } else if (rect.open.right) {
                openRightBlock(shape, rect.block.color, 0, 0, rect.width, rect.height);
            } else {
                canvas.colorBlock(shape, rect.block.color, 0, 0, rect.width, rect.height);
            }

            return shape;
        };

        /* Entferne alle gefärbten Blöcke */
        var colored_blocks = [];
        canvas.clearColoredBlocks = function(){
            colored_blocks = [];
            colorContainer.removeAllChildren();
        };

        canvas.setOffset = function(offset){
            gridOffset.x = offset.x;
            gridOffset.y = offset.y;
        };
        canvas.getOffset = function () {
            return gridOffset;
        };

        canvas.setHoverColor = function(color){
            canvas.colorBlock(hoverBlock, color, 8, 8, HALFSIZE, HALFSIZE);
        };

        canvas.clearColorContainer = function(){
            colorContainer.removeAllChildren();
            color_index = 0;
        };

        var color_index = 0;
        canvas.addRectsToColorContainer = function(rects){
            /* Rechtecke Array zum Canvas Container hinzufügen */
            var colorLayer = new createjs.Container();
            colorLayer.name = "colorLayer" + (color_index++);
            colorLayer.x = gridOffset.x;
            colorLayer.y = gridOffset.y;

            for (var r = 0; r < rects.length; r++) {
                var rect = rects[r];
                var shape = canvas.createColorBlock(rect);

                colorLayer.addChild(shape);
            }
            colorContainer.addChild(colorLayer);
        };

        var IBlocks = [];
        canvas.getIBlocks = function () {
            return IBlocks;
        };

        /* Füge ein IBlock Element zum Container hinzu. Also Zellelemente oder Variablen.
         * Das Canvas Block Element setzt sich aus drei createjs Elementen schichtweise zusammen:
         * 1) Container als Button-Rahmen, der alle anderen beinhaltet
         * 2) Shape als Hintergrund (weißer, transparenter
         * 3) Label als Inhalt
         * Der Container wird dann dem Blockcontainer hinzugefügt
         * */
        canvas.add = function(block, readonly) {
            IBlocks.push(block);
            var label = new createjs.Text(block.value, "20px Arial", labelColor);
            label.colors = {
                normal: labelColor,
                error: 'red'
            };
            label.textAlign = "center";
            label.textBaseline = "middle";
            label.x = block.width / 2;
            label.y = block.height / 2;

            var button = new createjs.Container();
            button.name = "block_" + block.x + "_" + block.y;
            button.x = block.x;
            button.y = block.y;

            block.ui = {
                label: label,
                button: button
            };

            if (block instanceof KVBlock){
                var bg = new createjs.Shape();
                bg.overColor = '#ddd';
                bg.outColor = "white";

                bg.graphics.beginFill(bg.outColor).beginStroke('black').drawRect(0, 0, block.width, block.height);
                button.addChild(bg);

                if (!readonly) {
                    button.addEventListener('click', function(evt){
                        if (canvas.onBlockClick) {
                            canvas.onBlockClick({event: evt, block: block, label: label, button: button, background: bg, cell: block.cell});

                        }
                        hoverBlock.alpha = 0;
                        canvas.refresh();
                    });
                    button.addEventListener('mouseover', function(evt) {
                        hoverBlock.alpha = getHoverFullAlpha();
                        hoverBlock.x = block.x;
                        hoverBlock.y = block.y;
                        if (canvas.onBlockHover) {
                            canvas.onBlockHover({event: evt, block: block, label: label, button: button, background: bg, cell: block.cell});
                        }
                        canvas.refresh();
                    });
                    button.addEventListener('mouseout', function(evt) {
                        hoverBlock.alpha = 0;
                        if (canvas.onBlockOut) {
                            canvas.onBlockOut({event: evt, block: block, label: label, button: button, background: bg, cell: block.cell});
                        }
                        canvas.refresh();
                    });
                }

                block.ui.bg = bg;
            }

            button.addChild(label);

            blockContainer.addChild(button);
        };

        canvas.getBlockContainer = function () {
            return blockContainer;
        };
        canvas.getColorContainer = function(){
            return colorContainer;
        };
        canvas.getStage = function () {
            return stage;
        };

        /* Erstelle eine Kopie dieses Canvas in ein anderes */
        canvas.copyIntoCanvas = function(cv) {
            cv.clearChildren();
            cv.clearColorContainer();

            cv.setOffset(canvas.getOffset());

            var iBlocks = canvas.getIBlocks();

            for (var i = 0; i < iBlocks.length; i++) {
                var iBlock = iBlocks[i];
                cv.add(iBlock, true);
            }

            cv.setSize(stage.canvas.width, stage.canvas.height);

        };

        canvas.clearChildren = function(){
            blockContainer.removeAllChildren();
            IBlocks = [];
        };

        canvas.onBlockHover = function(block){};
        canvas.onBlockClick = function(block){};
        canvas.onBlockOut = function(block){};

        canvas.setSize = function(width, height) {
            stage.canvas.width = width;
            stage.canvas.height = height;
        };

        canvas.refresh = function(force){
            stage.update();
        };


        return canvas;
    }
});
