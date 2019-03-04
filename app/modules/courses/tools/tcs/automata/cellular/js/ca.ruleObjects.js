/**
 * Menge der Regeln
 * @param $scope
 * @constructor
 */
autoSim.StateTransitionRules = function ($scope) {
    var vm = this;
    vm.deleteRules = true;
    vm.array = [];
    vm.ruleStages = [];
    vm.ruleId = 0;
    vm.cellSize = $scope.cellSpace.cellSize;
    vm.selectedColor = $scope.cellSpace.selectedColor;

    /**
     * Regel-Objekt
     * @param id: ID des Objektes
     * @param oldState: der alte Zustand
     * @param newState: der neue Zustand
     */
    vm.stateTransitionRuleObject = function (id, oldState, newState) {
        var self = this;
        self.id = id;
        self.oldState = oldState;
        self.newState = newState;
        if ($scope.cellSpace.twoD) {
            self.neighbourhood = _create2DArray(3);
            self.neighbourhood = fillArray(self.neighbourhood, 3);
        } else {
            self.neighbourhood = _create2DArray(3);
            self.neighbourhood = fillArray(self.neighbourhood, 1);
        }
    };

    /**
     * Funktion um 2D Array zu erstellen
     * @param columns gewünschte Spaltenzahl
     * @returns {Array}: Leeres 2D Array
     * @private
     */
    var _create2DArray = function (columns) {
        var arr = [];
        for (var i = 0; i < columns; i++) {
            arr[i] = [];
        }
        return arr;
    };

    /**
     * Füllt 2D Array mit Zellen
     * @param array: Array das zu befüllen ist
     * @param rows: gewünschte Zeilen
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
     * Initialisiert die Menge der Regeln
     */
    vm.init = function () {
        vm.array.clear();
        vm.ruleStages.clear();
        vm.ruleId = 0;
    };

    /**
     * erstellt ein Regel-Objet
     * @returns {autoSim.StateTransitionRules.stateTransitionRuleObject} erstelltes Regel-Objekt
     */
    vm.createRuleObject = function () {
        var ruleObject = new vm.stateTransitionRuleObject(vm.ruleId++, '#FFFFFF', '#FFFFFF');
        vm.array.push(ruleObject);
        return ruleObject;
    };

    /**
     * Initialisiert eine neue Regel
     * @param $event
     * @param ruleId
     */
    vm.initRule = function ($event, ruleId) {
        vm.drawRule(ruleId);
    };

    /**
     * Zeichnet eine Regel
     * @param ruleId: Id der Regel, die gezeichnet werden soll
     */
    vm.drawRule = function (ruleId) {
        var ruleObject = vm.array[ruleId];
        var tmpStage = new createjs.Stage('demoCanvas' + ruleObject.id);
        vm.ruleStages.push(tmpStage);
        // vm.ruleStage.name = "Rule Canvas";
        createjs.Touch.enable(tmpStage);
        _.forEach(ruleObject.neighbourhood, function (row, indexX) {
            _.forEach(row, function (cell, indexY) {
                var rect = new createjs.Shape();
                rect.graphics.setStrokeStyle(1)
                    .beginStroke('#c4c4c4')
                    .beginFill(cell.color)
                    .drawRect(indexX * vm.cellSize + 1, indexY * vm.cellSize + 1, vm.cellSize, vm.cellSize)
                    .endFill();


                rect.addEventListener("click", function (event) {
                    var target = event.target;
                    cell.color = vm.selectedColor;
                    cell.isAlive = vm.isSelectedAlive;
                    target.graphics.clear()
                        .setStrokeStyle(1)
                        .beginStroke('#c4c4c4')
                        .beginFill(cell.color)
                        .drawRect(indexX * vm.cellSize + 1, indexY * vm.cellSize + 1, vm.cellSize, vm.cellSize)
                        .endFill();
                    if ($scope.cellSpace.twoD) {
                        ruleObject.oldState = ruleObject.neighbourhood[1][1].color;
                    } else {
                        ruleObject.oldState = ruleObject.neighbourhood[1][0].color;
                    }
                });
                tmpStage.addChild(rect);
            });
        });

        var newState = new createjs.Shape();
        newState.graphics.setStrokeStyle(1)
            .beginStroke('#c4c4c4')
            .beginFill(ruleObject.newState);
        if ($scope.cellSpace.twoD) {
            newState.graphics.drawRect(vm.cellSize * 4 + 1, vm.cellSize + 1, vm.cellSize, vm.cellSize)
                .endFill();
        } else {
            newState.graphics.drawRect(vm.cellSize + 1, vm.cellSize + vm.cellSize / 2 + 1, vm.cellSize, vm.cellSize)
                .endFill();
        }

        newState.addEventListener("click", function (event) {
            var target = event.target;
            cell.color = vm.selectedColor;
            cell.isAlive = vm.isSelectedAlive;
            target.graphics.clear()
                .setStrokeStyle(1)
                .beginStroke('#c4c4c4')
                .beginFill(cell.color);
            if ($scope.cellSpace.twoD) {
                newState.graphics.drawRect(vm.cellSize * 4 + 1, vm.cellSize + 1, vm.cellSize, vm.cellSize)
                    .endFill();
            } else {
                newState.graphics.drawRect(vm.cellSize + 1, vm.cellSize + vm.cellSize / 2 + 1, vm.cellSize, vm.cellSize)
                    .endFill();
            }
            ruleObject.newState = cell.color;
        });
        tmpStage.addChild(newState);
        tmpStage.update();
    };

    /**
     * Löscht eine Regel
     * @param id: id der Regel, die gelöscht werden soll
     */
    vm.deleteRule = function (id) {
        _.pullAt(vm.array, [id]);
        for (var i = id; i < vm.array.length; i++) {
            vm.array[i].id -= 1;
        }

        vm.ruleId -= 1;

        while (vm.ruleStages.length > 0) {
            vm.ruleStages.pop();
        }
        vm.deleteRules = !vm.deleteRules;
    };

    var width = document.getElementById("ruleEditor").offsetWidth - 18;

    vm.buttonSize = {
        "width": width
    };

    /**
     * Updatet in regelmäßigen Abständen die Canvas-Stages der Regelobjekte
     */
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {
        _.forEach(vm.ruleStages, function (tmpStage) {
            tmpStage.update();
        });
    }
};