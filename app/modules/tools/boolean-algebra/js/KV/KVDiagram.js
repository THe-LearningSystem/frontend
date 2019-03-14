/**
 * Created by Sergej on 11.01.2017.
 */
var KVDiagram = function(expression, canvas){
    var V = expression.rootNode.getLetters();
    this.field = [];
    this.cells = [];
    var width = 0;

    const size = KVDiagram.SIZE;

    this.getWidth = function(){
        return width;
    };
    this.getHeight = function() {
        return this.field.length;
    };

    this.getRow = function(index){
        return this.field[index];
    };

    var reflectV = function (A) {
        var reflField = [];
        for (var r = A.length - 1; r >= 0; r--) {
            var row = A[r];
            reflField.push(row.clone());
        }
        return A.concat(reflField);
    };

    var reflectH = function(A) {
        for (var r = 0; r < A.length; r++) {
            var mirror = [];
            var row = A[r];
            for (var c = row.getLength() - 1; c >= 0; c--) {
                var col = row.getCell(c);
                mirror.push(col.clone());
            }
            row.appendCols(mirror);
        }
        return A;
    };

    /* Spiegel das Feld in der horizontalen */
    this.reflectHorizontal = function (Var) {
        if (this.field.length < 1) {
            var newRow = new KVRow();
            newRow.addCell(new KVCell(0));
            newRow.addCell(new KVCell(0));
            this.field.push(newRow);
        } else {
            this.field = reflectH(this.field);
        }

        width = this.field[0].getLength();
        var half = width / 2;
        for (var i = 0; i < this.field.length; i++) {
            var row = this.field[i];
            for (var j = 0; j < half; j++) {
                var colA = row.getCell(j);
                var colB = row.getCell(half + j);
                colA.addVar(Var, 1);
                colB.addVar(Var, 0);
            }
        }
    };
    /* Spiegel das Feld in der vertikalen */
    this.reflectVertical = function(Var) {
        if (this.field.length < 2) {
            var row = this.field[0].clone();
            this.field.push(row);
        } else {
            this.field = reflectV(this.field);
        }

        var half = this.getHeight() / 2;
        for (var i = 0; i < half; i++) {
            var rowA = this.field[i];
            var rowB = this.field[half + i];
            for (var j = 0; j < rowA.getLength(); j++) {
                rowA.getCell(j).addVar(Var, 1);
                rowB.getCell(j).addVar(Var, 0);
            }
        }
    };

    this.calcView = function(){
        var h = Math.ceil(V.length / 2);
        var w = V.length - h;

        var width = w * size + this.getWidth() * size + size;
        var height = h * size + this.getHeight() * size + size;

        return {width: width, height: height};
    };

    /* Verbinde alle Zellen miteinander */
    this.createNetwork = function(){
        var w = this.getWidth();
        var w2 = w - 1;
        var h = this.getHeight();
        var L = w * h;
        var L2 = L - 1;

        for (var n = 0; n < this.cells.length; n++) {
            var cell = this.cells[n];
            cell.n = n;

            var nMw = n % w;

            var r = nMw == w2 ? n - w2 : n + 1;
            cell.right = this.cells[r];

            var l = nMw == 0 ? n + w2 : n - 1;
            cell.left = this.cells[l];

            var b = n <= L2 - w ? n + w : n - L + w;

            cell.bottom = this.cells[b];

            var t = n < w ? L - (w - n) : n - w;
            cell.top = this.cells[t];

            /*console.log("n: " + n + ", r: " + r + ", l: " + l + ", b: " + b + ", t: " + t);*/
        }
    };
    /* Erstelle die optische Darstellung der Blöcke */
    this.generateBlocks = function(canvas){
        var h = Math.ceil(V.length / 2);
        var w = V.length - h;

        var gridOffset = {x: size * w, y: size * h};
        canvas.setOffset(gridOffset);

        canvas.clearChildren();

        this.cells = [];
        for (var r = 0; r < this.getHeight(); r++) {
            var row = this.getRow(r);

            var firstcol = row.getCell(0);

            var block, aVar;

            for (var rI = 1, offX = 1; rI < firstcol.getVarLength(); rI+=2, offX++) {
                aVar = firstcol.getVarAtIndexStr(rI);
                block = new IBlock(gridOffset.x + offX * -size, gridOffset.y + r * size, size, size, aVar);

                canvas.add(block);
            }

            for (var c = 0; c < this.getWidth(); c++) {
                var col = row.getCell(c);

                if (r == 0) {
                    for (var cI = 0, offY = 1; cI < col.getVarLength(); cI+=2, offY++) {
                        aVar = col.getVarAtIndexStr(cI);
                        block = new IBlock(gridOffset.x + c * size, gridOffset.y + offY * -size, size, size, aVar);
                        canvas.add(block);
                    }
                }
                col.value = expression.getResult(col.assignedVars);
                block = new KVBlock(gridOffset.x + c * size, gridOffset.y + r * size, size, size, col);

                this.cells.push(col);
                canvas.add(block);
            }
        }
        canvas.refresh(true);
    };

    var allBlocks = [];
    /* Erstelle KNF und DNF */
    this.minimize = function () {
        var searchAlgo = new KVReflectingSearch();

        var info = {
            dnf: {
                expr: null,
                blocks: null
            },
            knf: {
                expr: null,
                blocks: null
            }
        };
        info.dnf.blocks = searchAlgo.search(this.cells, 1);
        info.knf.blocks = searchAlgo.search(this.cells, 0);
        allBlocks = info.dnf.blocks.concat(info.knf.blocks);

        var expr = "", i, block, minExpr;
        var dnf = [];
        for (i = 0; i < info.dnf.blocks.length; i++) {
            block = info.dnf.blocks[i];
            minExpr = block.getExpr(true);
            dnf.push(minExpr);
        }
        dnf.sort();
        for (i = 0; i < dnf.length; i++) {
            var d = dnf[i];
            if (dnf.length > 1 && (d.indexOf(SYMBOL_OR) > -1 || d.indexOf(SYMBOL_AND) > -1)) {

                d = "(" + d + ")";
            }
            expr = KVDiagram.Disjunction(expr, d);
        }
        info.dnf.expr = new BAExpression(expr);
        expr = "";
        var knf = [];
        for (i = 0; i < info.knf.blocks.length; i++) {
            block = info.knf.blocks[i];
            minExpr = block.getExpr(true);
            knf.push(minExpr);
        }
        knf.sort();
        for (i = 0; i < knf.length; i++) {
            var k = knf[i];
            if (knf.length > 1 && (k.indexOf(SYMBOL_OR) > -1 || k.indexOf(SYMBOL_AND) > -1)) {
                k = "(" + k + ")";
            }
            expr = KVDiagram.Conjunction(expr, k);
        }
        info.knf.expr = new BAExpression(expr);

        return info;
    };


    this.colorBlocks = function(blocks){
        if (!Array.isArray(blocks)) blocks = [blocks];
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (!block.color) block.color = ColorGenerator.generate(60, ColorGenerator.value1);
            var rects = block.createColorRects(this.getWidth(), this.getHeight());
            canvas.addRectsToColorContainer(rects);
        }
        canvas.refresh();
    };

    this.init = function(V) {
        for (var i = 0; i < V.length; i++) {
            if (i % 2 == 0) {
                this.reflectHorizontal(V[i]);
            } else {
                this.reflectVertical(V[i]);
            }
        }

        this.generateBlocks(canvas);
        this.createNetwork();
    };
    this.init(V);
};
KVDiagram.SIZE = 32;
KVDiagram.Disjunction = function(a, b){
    if (a == undefined || a == "") return b;
    if (b == undefined || b == "") return a;
    return a + SYMBOL_OR + b;
};
KVDiagram.Conjunction = function(a, b) {
    if (a == undefined || a == "") return b;
    if (b == undefined || b == "") return a;
    return a + SYMBOL_AND + b;
};