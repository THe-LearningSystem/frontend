/**
 * Created by Sergej on 18.01.2017.
 */
var ColorPathLayer = function(color){
    var $this = this;
    this.color = color;
    this.cellField = [];
    this.cells = [];

    this.diagram = null;

    /* Is right or wrong State */
    this.resultState = 0;

    this.expression = new BAExpression();
    this.expression.onTextChanged = function () {
        /* Reset state if text was changed */
        $this.resultState = 0;
    };
    this.blocks = [];
    this.value = -1;

    var searchAlgo = new KVReflectingSearch(this.cells);

    var exprBuffer = null;
    this.getBlocksExpr = function(asString){
        if (!isDirty) return asString ? exprBuffer.text : exprBuffer;
        var expr = "";
        var eConnect = this.value == 0 ? KVDiagram.Conjunction : KVDiagram.Disjunction;
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            var e = block.getExpr();
            var eStr = e.text;
            if (this.blocks.length > 1 && IS_OPERATOR(e.rootNode.value)) eStr = "(" + eStr + ")";
            expr = eConnect(expr, eStr);
        }
        if (asString) return expr;
        isDirty = false;
        return exprBuffer = new BAExpression(expr);
    };

    var isDirty = true;
    this.checkExpression = function () {
        var blocksExpr  = this.getBlocksExpr();
        var inputExpr = this.expression;

        var compBlocks = new KVExprCompare(blocksExpr);
        var compInput = new KVExprCompare(inputExpr);
        this.resultState = compInput.equals(compBlocks) ? 1 : -1;
        return this.resultState;
    };

    this.toggleCell = function(cell, width) {
        if (this.value != -1 && this.value != cell.value) return;
        var pos = {col: parseInt(cell.n % width), row: parseInt(cell.n / width)};
        var row = this.cellField[pos.row];
        if (!row) {
            row = this.cellField[pos.row] = new KVRow();
        }
        if (row.getCell(pos.col)) {
            row.removeCell(pos.col);
        } else {
            row.setCell(pos.col, cell);
        }
        isDirty = true;
        this.cells.toggleObject(cell);
        if (this.cells.length == 0) {
            this.value = -1;
        }
        else if (this.cells.length == 1) {
            this.value = this.cells[0].value;
        }
        this.blocks = searchAlgo.search(this.cells, this.value);
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].color = this.color;
        }
        return this.cells.length;
    };
};