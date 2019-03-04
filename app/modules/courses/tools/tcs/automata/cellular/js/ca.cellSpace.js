autoSim.CellSpace = function ($scope) {
    var vm = this;

    vm.sizeX = 50;
    vm.sizeY = 50;
    vm.cellSize = 30;
    vm.selectedColor = '#FFFF00';
    vm.twoD = true;
    vm.unlimitedCellSpace = false;

    vm.canvas = document.getElementById('cellSpace');
    vm.stage = new createjs.Stage('cellSpace');
    vm.stage.name = "Cellular Automata";
    createjs.Touch.enable(vm.stage);
    vm.stage.enableMouseOver(10);

    /**
     * Funktion um ein zweidimensionales Array zu erstellen
     * @param columns = Anzahl der gewünschten Spalten
     * @returns {Array}: 2D Array
     */
    var _create2DArray = function (columns) {
        var arr = [];
        for (var i = 0; i < columns; i++) {
            arr[i] = [];
        }
        return arr;
    };

    /**
     * Füllt ein 2D Array mit Zellen
     * @param array: Array das zu füllen ist
     * @param rows: Wie viele Zeilen es geben soll
     * @returns {*}
     */
    var fillArray = function (array, rows) {
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < rows; j++) {
                array[i][j] = new cell('#FFFFFF');
            }
        }
        return array;
    };

    /**
     * Liefert Zufallszahl. 0 oder 1.
     * @returns {number}
     */
    var randomNumber = function () {
        return Math.round(Math.random());
    };

    /**
     * Initialisiert den Zellraum
     */
    vm.init = function () {
        vm.sizeY = vm.sizeX;
        vm.stage.removeAllChildren();
        if (vm.twoD) {
            vm.cellData = _create2DArray(vm.sizeX);
            vm.cellData = fillArray(vm.cellData, vm.sizeY);
            vm.draw2DCanvas();
        } else {
            $scope.simulator.developmentHistory = _create2DArray(vm.sizeX);
            vm.cellData = _create2DArray(vm.sizeX);
            vm.cellData = fillArray(vm.cellData, 1);
            vm.draw1DCanvas();
        }
    };

    /**
     * Färbt eine Zelle mit der gewählten Farbe
     * @param cell: eine Zelle
     */
    vm.paintCell = function (cell) {
        cell.color = vm.selectedColor;
    };

    /**
     * Färbt die Zellen im Zellraum zufällig mit der ausgewählten Farbe
     */
    vm.randomize = function () {
        if (vm.twoD) {
            _.forEach(vm.cellData, function (row) {
                _.forEach(row, function (cell) {
                    if (randomNumber() === 1) {
                        vm.paintCell(cell);
                    }
                });
            });
            vm.draw2DCanvas();
        } else {
            for (var i = 0; i < vm.cellData.length; i++) {
                for (var j = 0; j < 1; j++) {
                    if (randomNumber() === 1) {
                        vm.paintCell(vm.cellData[i][j]);
                    }
                }
            }
            vm.draw1DCanvas();
        }
    };

    /**
     * Leert den Zellraum
     */
    vm.clearCellSpace = function () {
        $scope.simulator.reset();
        vm.stage.removeAllChildren();
        // vm.stage.update();
        if (vm.twoD) {
            vm.cellData = _create2DArray(vm.sizeX);
            vm.cellData = fillArray(vm.cellData, vm.sizeY);
            vm.draw2DCanvas();
        } else {
            $scope.simulator.developmentHistory = _create2DArray(vm.sizeX);
            vm.cellData = _create2DArray(vm.sizeX);
            vm.cellData = fillArray(vm.cellData, 1);
            vm.draw1DCanvas();
        }
    };

    /**
     * Zeichnet das Canvas für den 1D Automaten
     */
    vm.draw1DCanvas = function () {
        _.forEach(vm.cellData, function (column, indexX) {
            _.forEach(column, function (cell, indexY) {
                var rect = new createjs.Shape();
                rect.graphics.setStrokeStyle(1);
                rect.graphics.beginStroke('#c4c4c4');
                rect.graphics.beginFill(cell.color);
                rect.graphics.drawRect(indexX * vm.cellSize, 630 - indexY * vm.cellSize, vm.cellSize, vm.cellSize);
                rect.graphics.endFill();

                if(indexY=== 0) {
                    rect.addEventListener("click", function (event) {
                        var target = event.target;
                        cell.color = vm.selectedColor;
                        target.graphics.clear()
                            .setStrokeStyle(1)
                            .beginStroke('#c4c4c4')
                            .beginFill(cell.color)
                            .drawRect(indexX * vm.cellSize, 630 - indexY * vm.cellSize, vm.cellSize, vm.cellSize)
                            .endFill();
                    });
                }
                vm.stage.addChild(rect);
            });
        });
        vm.stage.update();
    };

    /**
     * Zeichnet das Canvas für einen 2D Automaten
     */
    vm.draw2DCanvas = function () {
        _.forEach(vm.cellData, function (row, indexX) {
            _.forEach(row, function (cell, indexY) {
                var rect = new createjs.Shape();
                rect.graphics.setStrokeStyle(1);
                rect.graphics.beginStroke('#c4c4c4');
                rect.graphics.beginFill(cell.color);
                rect.graphics.drawRect(indexX * vm.cellSize, indexY * vm.cellSize, vm.cellSize, vm.cellSize);
                rect.graphics.endFill();

                rect.addEventListener("click", function (event) {
                    var target = event.target;
                    cell.color = vm.selectedColor;
                    target.graphics.clear()
                        .setStrokeStyle(1)
                        .beginStroke('#c4c4c4')
                        .beginFill(cell.color)
                        .drawRect(indexX * vm.cellSize, indexY * vm.cellSize, vm.cellSize, vm.cellSize)
                        .endFill();
                });
                vm.stage.addChild(rect);
            });
        });
        vm.stage.update();
    };

    /**
     * Beobachtet die X-Größe des Zellraumes. Wenn die sich ändert
     * wird der Zellraum neu initialisiert.
     */
    $scope.$watch('cellSpace.sizeX', function () {
        vm.init();
    });

    /**
     * Updatet die Canvas-Stage des Zellraumes und der Regeln in regelmäßigen Abständen
     */
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {
        vm.stage.update();
        _.forEach(vm.ruleStages, function (tmpStage) {
            tmpStage.update();
        });
    }
};