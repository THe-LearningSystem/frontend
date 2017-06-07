/**
 * Created by Sergej on 11.01.2017.
 */
var KVRow = function(){
    this.cells = [];

    this.addCell = function(col){
        this.cells.push(col);
    };

    this.appendCols = function(A) {
        this.cells = this.cells.concat(A);
    };

    this.setCell = function(index, cell) {
        this.cells[index] = cell;
    };

    this.removeCell = function(index){
        this.cells[index] = null;
    };

    this.getCell = function(index) {
        return this.cells[index];
    };

    this.getLength = function(){
        return this.cells.length;
    };

    this.clone = function(){
        var row = new KVRow();
        for (var i = 0; i < this.cells.length; i++) {
            row.addCell(this.cells[i].clone());
        }
        return row;
    };
};