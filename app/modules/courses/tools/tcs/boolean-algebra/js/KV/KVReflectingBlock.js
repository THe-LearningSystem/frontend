/**
 * Created by Sergej on 18.01.2017.
 */
var KVReflectingBlock = Class.extend(function(){
    var $this = this;
    var width = 1;

    this.cells = [];
    this.allowedCells = null;

    this.constructor = function(cell, allowedCells){
        this.cells = [[cell]];
        if (allowedCells) this.allowedCells = allowedCells;
    };
    this.getWidth = function(){
        return width;
    };
    this.setWidth = function(w){
        width = w;
    };
    this.getHeight = function(){
        return this.cells.length;
    };

    this.cellList = [];
    this.createCellList = function () {
        if (this.cellList.length > 0) return this.cellList.clone();
        for (var y = 0; y < this.getHeight(); y++) {
            for (var x = 0; x < this.getWidth(); x++) {
                var cell = this.cells[y][x];
                this.cellList.push(cell);
            }
        }
        return this.cellList.clone();
    };

    this.equals = function(block) {
        if (this.getWidth() != block.getWidth() || this.getHeight() != block.getHeight()) {
            return false;
        }
        var listA = this.createCellList();
        var listB = block.createCellList();
        if (listA.length != listB.length) return false;

        for (var i = 0; i < listB.length; i++) {
            var objB = listB[i];
            for (var j = 0; j < listA.length; j++) {
                var objA = listA[j];
                if (objA.equals(objB)) {
                    listA.splice(j, 1);
                    break;
                }
            }
        }

        return listA.length == 0;
    };

    this.createColorRects = function(fieldWidth, fieldHeight){
        var createKVReflectingBlockRect = function(x, y, width, height){
            return new KVReflectingBlockRect(x, y, width, height, $this);
            return {x: x, y: y, width: 0, height: 0, open: {right: false, up: false, down: false, left: false}, block: $this};
        };


        var correctionValues = {x: 8, y: 8, width: -16, height: -16};
        var correctionRect = function(rect){
            rect.x += correctionValues.x;
            rect.y += correctionValues.y;
            rect.width += correctionValues.width;
            rect.height += correctionValues.height;
        };

        var openRects = function (rects, fieldWidth, fieldHeight) {
            var rect = rects[0];
            var xDistance = fieldWidth - (rect.x + rect.width);
            var yDistance = fieldHeight - (rect.y + rect.height);
            if (xDistance < 0 && yDistance < 0) {
                openRectAll(rect, rects, xDistance, yDistance);
            } else if (xDistance < 0) {
                openRectRightLeft(rect, rects, xDistance);
            } else if (yDistance < 0) {
                openRectUpDown(rect, rects, yDistance);
            }
            correctionRect(rect);
        };

        var openRectAll = function (rect, rects, xDistance, yDistance) {
            rect.open.right = rect.open.down = true;

            var newRectUpLeft = createKVReflectingBlockRect(xDistance, yDistance, rect.width, rect.height);
            newRectUpLeft.open.left = newRectUpLeft.open.up = true;
            correctionRect(newRectUpLeft);
            rects.push(newRectUpLeft);

            var newRectUpRight = createKVReflectingBlockRect(rect.x, yDistance, rect.width, rect.height);
            newRectUpRight.open.right = newRectUpRight.open.up = true;
            correctionRect(newRectUpRight);
            rects.push(newRectUpRight);

            var newRectDownLeft = createKVReflectingBlockRect(xDistance, rect.y, rect.width, rect.height);
            newRectDownLeft.open.left = newRectDownLeft.open.down = true;
            correctionRect(newRectDownLeft);
            rects.push(newRectDownLeft);
        };

        var openRectRightLeft = function (rect, rects, xDistance) {
            rect.open.right = true;
            var newRect = createKVReflectingBlockRect(xDistance, rect.y, rect.width, rect.height);
            newRect.open.left = true;
            correctionRect(newRect);
            rects.push(newRect);
        };

        var openRectUpDown = function (rect, rects, yDistance) {
            rect.open.down = true;
            var newRect = createKVReflectingBlockRect(rect.x, yDistance, rect.width, rect.height);
            newRect.open.up = true;
            correctionRect(newRect);
            rects.push(newRect);
        };

        var rects = [];

        var cell = $this.cells[0][0];
        var x = parseInt(cell.n % fieldWidth);
        var y = parseInt(cell.n / fieldWidth);

        var rect = createKVReflectingBlockRect(x * KVDiagram.SIZE, y * KVDiagram.SIZE);
        rects.push(rect);
        rect.width = $this.getWidth() * KVDiagram.SIZE;
        rect.height = $this.getHeight() * KVDiagram.SIZE;

        openRects(rects, fieldWidth * KVDiagram.SIZE, fieldHeight * KVDiagram.SIZE);

        return rects;
    };

    this.clone = function () {
        var block = new KVReflectingBlock(cell);
        block.setWidth(this.getWidth());
        block.cells = this.cells;
        return block;
    };

    var minVars = {};
    var calcMin = function(key, value) {
        var minEntry = minVars[key];
        if (minEntry == -1) return;
        if (minEntry == 0 || minEntry == 1) {
            if (minEntry != value) {
                minVars[key] = -1;
            }
        } else {
            minVars[key] = value;
        }
    };

    this.getExpr = function(asString){
        if (minVars.length > 0) return minVars;
        var key, value;
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            for (var c = 0; c < this.getWidth(); c++) {
                var cell = row[c];
                var vars = cell.assignedVars;
                for (key in vars) {
                    calcMin(key, vars[key]);
                }
            }
        }
        var newMinVarsKeys = [];

        for (key in minVars) {
            value = minVars[key];
            if (value < 0) continue;
            newMinVarsKeys.push(key);
        }
        newMinVarsKeys.sort();

        var expr = "";
        var eConnect = cell.value == 1 ? KVDiagram.Conjunction : KVDiagram.Disjunction;
        for (var i = 0; i < newMinVarsKeys.length; i++) {
            key = newMinVarsKeys[i];
            value = minVars[key];
            var keyValue = key;

            if (cell.value == 0 && value == 1) keyValue = SYMBOL_NEG + key;
            if (cell.value == 1 && value == 0) keyValue = SYMBOL_NEG + key;

            expr = eConnect(expr, keyValue);
        }

        if (asString) return expr;
        return new BAExpression(expr);
    };

    this.concatHorizontal = function(A, B) {
        var C = [];
        // FEHLER WENN A != B
        var maxHeight = Math.min(A.length, B.length);
        for (var r = 0; r < maxHeight; r++) {
            C.push(A[r].concat(B[r]));
        }
        this.cells = C;
        width = this.cells[0].length;
        minVars = {};
    };

    this.concatVertical = function(A, B) {
        this.cells = A.concat(B);
        minVars = {};
    };

    this.areReflectable = function(cellA, cellB) {
        return cellA.n != cellB.n && cellA.value == cellB.value;
    };

    this.reflect = function(){
        if (this.reflectRight(false)) {
            return true;
        } else if (this.reflectDown(false)) {
            return true;
        } else if (this.reflectLeft(false)) {
            return true;
        } else if (this.reflectUp(false)) {
            return true;
        } else if (this.reflectRight(true)) {
            return true;
        } else if (this.reflectDown(true)) {
            return true;
        } else if (this.reflectLeft(true)) {
            return true;
        } else if (this.reflectUp(true)) {
            return true;
        }

        return false;
    };

    this.reflectRight = function (throughWall) {
        var collection = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            var first = row[0];
            var last = row[row.length - 1];
            var next = last;
            var collectionRow = [];
            for (var c = 0; c < this.getWidth(); c++) {
                next = next.right;
                if (next.n < last.n && !throughWall) return false;
                if (next.equals(first)) return false;
                if (!this.areReflectable(last, next)) return false;
                if (this.allowedCells && !this.allowedCells.contains(next)) return false;
                collectionRow.push(next);
            }
            collection.push(collectionRow);
        }
        this.concatHorizontal(this.cells, collection);
        return true;
    };

    this.reflectLeft = function(throughWall){
        var collection = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.cells[r];
            var first = row[0];
            var last = row[row.length - 1];
            var next = first;
            var collectionRow = [];
            for (var c = 0; c < this.getWidth(); c++) {
                next = next.left;
                if (next.n > first.n && !throughWall) return false;
                if (next.equals(last)) return false;
                if (!this.areReflectable(first, next)) return false;
                if (this.allowedCells && !this.allowedCells.contains(next)) return false;
                collectionRow.unshift(next);
            }
            collection.push(collectionRow);
        }
        this.concatHorizontal(collection, this.cells);
        return true;
    };

    this.reflectDown = function(throughWall){
        var lastRow = this.cells[this.cells.length - 1];
        var firstRow = this.cells[0];

        var collection = [];
        for (var c = 0; c < this.getWidth(); c++) {
            var first = firstRow[c];
            var last = lastRow[c];
            var next = last;
            for (var r = 0; r < this.getHeight(); r++) {
                next = next.bottom;
                if (next.n < last.n && !throughWall) return false;
                if (next.equals(first)) return false;
                if (!this.areReflectable(last, next)) return false;
                if (this.allowedCells && !this.allowedCells.contains(next)) return false;
                var collectionRow;
                if (collection.length <= r) {
                    collection.push(collectionRow = []);
                } else {
                    collectionRow = collection[r];
                }
                collectionRow.push(next);
            }
        }

        this.concatVertical(this.cells, collection);
        return true;
    };

    this.reflectUp = function(throughWall){
        var lastRow = this.cells[this.cells.length - 1];
        var firstRow = this.cells[0];
        var collection = [];
        for (var c = 0; c < this.getWidth(); c++) {
            var first = firstRow[c];
            var last = lastRow[c];
            var next = first;
            for (var r = 0; r < this.getHeight(); r++) {
                next = next.top;
                if (next.n > first.n && !throughWall) return false;
                if (next.equals(last)) return false;
                if (!this.areReflectable(first, next)) return false;
                if (this.allowedCells && !this.allowedCells.contains(next)) return false;
                var collectionRow;
                if (collection.length <= r) {
                    collection.push(collectionRow = []);
                } else {
                    collectionRow = collection[r];
                }
                collectionRow.push(next);
            }
        }
        var newCollection = [];
        for (var i = collection.length - 1; i >= 0; i--) {
            newCollection.push(collection[i]);
        }
        this.concatVertical(newCollection, this.cells);
        return true;
    };
});

