//Simulator for the simulation of the automata
/**
 * Simulator for the simulation of the cellular automaton
 */
autoSim.SimulatorCA = function ($scope, $uibModal) {
    var vm = this;

    vm.stepTimeOut = 500;
    vm.alreadyPlayed = false;
    vm.startConfig = [];
    vm.sequence = [];
    vm.sequenceNumber = 0;
    vm.isInPlay = false;
    vm.simulationPaused = false;

    /**
     * Funktion um 2D Array zu erstellen
     * @param columns : gewünschte Spaltenanzahl
     * @returns {Array} 2D Array
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
     * Initialisiert den Simulator
     */
    vm.init = function () {
        vm.reset();
        $scope.stateTransitionRules.init();
        $scope.cellSpace.init();
    };

    /**
     * Resetet den Simulator
     */
    vm.reset = function () {
        vm.isInPlay = false;
        vm.simulationPaused = true;

        vm.alreadyPlayed = false;
        vm.sequence.clear();
        vm.sequenceNumber = 0;
    };

    /**
     * Setzt den Automaten zurück
     */
    vm.resetAutomaton = function(){
        vm.init();
    };

    /**
     * Speichert die Startkonfiguration des Automaten
     */
    vm.storeStartConfig = function () {
        vm.startConfig = _.clone($scope.cellSpace.cellData);
    };

    /**
     * Funktion die ausgeführt wird, wenn Play oder Pause gedrückt wurde
     */
    vm.playOrPause = function () {
        if (!vm.alreadyPlayed) {
            vm.storeStartConfig();
            vm.alreadyPlayed = true;
        }
        vm.isInPlay = !vm.isInPlay;
        if (vm.isInPlay) {
            vm.simulationPaused = false;
            vm.play();
        } else {
            vm.pause();
        }
    };

    /**
     * Spielt die Simulation ab
     */
    vm.play = function () {
        if (!vm.simulationPaused) {
            vm.isInPlay = true;
            vm.calcDevelopment($scope.cellSpace.cellData);
            setTimeout(function () {
                vm.play();
            }, vm.stepTimeOut);
        }
    };

    /**
     * Lässt die Simulation pausieren
     */
    vm.pause = function () {
        if (!vm.simulationPaused) {
            vm.simulationPaused = true;
            vm.isInPlay = false;
        }
    };

    /**
     * Stoppt die Simulation
     */
    vm.stop = function () {
        vm.pause();
        if (vm.alreadyPlayed) {
            $scope.cellSpace.stage.removeAllChildren();
            $scope.cellSpace.cellData = _.clone(vm.startConfig);
        }
        if ($scope.cellSpace.twoD) {
            $scope.cellSpace.draw2DCanvas();
        } else {
            $scope.cellSpace.draw1DCanvas();
        }
        vm.reset();
    };

    /**
     * Bewegt sich in der Simulation einen Schritt vorwärts
     */
    vm.stepForward = function () {
        if (!vm.alreadyPlayed) {
            vm.storeStartConfig();
            vm.alreadyPlayed = true;
        }
        vm.calcDevelopment($scope.cellSpace.cellData);
    };

    /**
     * Bewegt sich in der Simulation einen Schritt rückwärts
     */
    vm.stepBackwards = function () {
        vm.sequenceNumber = vm.sequenceNumber - 1;
        if (vm.sequenceNumber === 0) {
            vm.alreadyPlayed = false;
        }
        $scope.cellSpace.cellData = _.clone(vm.sequence[vm.sequenceNumber]);
        $scope.cellSpace.stage.removeAllChildren();
        if ($scope.cellSpace.twoD) {
            $scope.cellSpace.draw2DCanvas();
        } else {
            $scope.cellSpace.draw1DCanvas();
        }
    };

    /**
     * Berechnet die Entwicklung des Zellraumes
     * @param cellData Zellraum, für den die Entwicklung berechnet werden soll
     */
    vm.calcDevelopment = function (cellData) {
        // vm.startConfig = _.cloneDeep(vm.cellData);
        vm.sequence[vm.sequenceNumber++] = cellData;
        var tmpData = _.cloneDeep(cellData);
        if ($scope.cellSpace.twoD) {
            _.forEach(tmpData, function (row, i) {
                _.forEach(row, function (cell, j) {
                    _.forEach($scope.stateTransitionRules.array, function (rule) {
                        if ($scope.cellSpace.unlimitedCellSpace) {
                            if (vm.checkMooreEquality(vm.getOpenMooreNeighbourhood(cellData, i, j), rule.neighbourhood)) {
                                tmpData[i][j].color = rule.newState;
                            }
                        } else {
                            if (vm.checkMooreEquality(vm.getClosedMooreNeighbourhood(cellData, i, j), rule.neighbourhood)) {
                                tmpData[i][j].color = rule.newState;
                            }
                        }
                    });
                });
            });
            $scope.cellSpace.cellData = _.clone(tmpData);
            $scope.cellSpace.draw2DCanvas();
        } else {
            for (var i = 0; i < $scope.cellSpace.sizeX; i++) {
                tmpData[i].unshift(_.clone(tmpData[i][0]));
            }
            for (var j = 0; j < $scope.cellSpace.sizeX; j++) {
                for (var k = 0; k < 1; k++) {
                    for (var l = 0; l < $scope.stateTransitionRules.array.length; l++) {
                        if ($scope.cellSpace.unlimitedCellSpace) {
                            if (vm.checkNeumannEquality(vm.getOpenVonNeumannNeighbourhood($scope.cellSpace.cellData, j), $scope.stateTransitionRules.array[l].neighbourhood)) {
                                tmpData[j][k].color = $scope.stateTransitionRules.array[l].newState;
                            }
                        } else {
                            if (vm.checkNeumannEquality(vm.getClosedVonNeumannNeighbourhood($scope.cellSpace.cellData, j), $scope.stateTransitionRules.array[l].neighbourhood)) {
                                tmpData[j][k].color = $scope.stateTransitionRules.array[l].newState;
                            }
                        }
                    }
                }
            }
            $scope.cellSpace.cellData = _.clone(tmpData);
            $scope.cellSpace.draw1DCanvas();
        }
    };

    /**
     * Sammelt die Nachbarn in einem 2D Zellraum mit Zellumlauf
     * @param cellData: Zellraum
     * @param column: Spalte der Zelle
     * @param row: Zeile der Zelle
     * @returns {Array}: Nachbarn der Zelle
     */
    vm.getOpenMooreNeighbourhood = function (cellData, column, row) {
        var neighbours = _create2DArray(3);
        if (column === 0 && row === 0) {
            // Ecke links oben
            neighbours[0][0] = new cell('#FFFFFF');
            neighbours[0][1] = new cell('#FFFFFF');
            neighbours[0][2] = new cell('#FFFFFF');
            neighbours[1][0] = new cell('#FFFFFF');
            neighbours[2][0] = new cell('#FFFFFF');
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
            neighbours[2][1] = cellData[column + 1][row];
            neighbours[2][2] = cellData[column + 1][row + 1];
        } else if (column === 0 && row === cellData[column].length - 1) {
            // Ecke links unten
            neighbours[0][0] = new cell('#FFFFFF');
            neighbours[0][1] = new cell('#FFFFFF');
            neighbours[0][2] = new cell('#FFFFFF');
            neighbours[1][2] = new cell('#FFFFFF');
            neighbours[2][2] = new cell('#FFFFFF');
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[2][0] = cellData[column + 1][row - 1];
            neighbours[2][1] = cellData[column + 1][row];
        } else if (column === cellData.length - 1 && row === 0) {
            // Ecke rechts oben
            neighbours[0][0] = new cell('#FFFFFF');
            neighbours[1][0] = new cell('#FFFFFF');
            neighbours[2][0] = new cell('#FFFFFF');
            neighbours[2][1] = new cell('#FFFFFF');
            neighbours[2][2] = new cell('#FFFFFF');
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[0][2] = cellData[column - 1][row + 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
        } else if (column === cellData.length - 1 && row === cellData[column].length - 1) {
            // Ecke rechts unten
            neighbours[2][0] = new cell('#FFFFFF');
            neighbours[2][1] = new cell('#FFFFFF');
            neighbours[2][2] = new cell('#FFFFFF');
            neighbours[1][2] = new cell('#FFFFFF');
            neighbours[0][2] = new cell('#FFFFFF');
            neighbours[0][0] = cellData[column - 1][row - 1];
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
        } else if (column === 0) {
            neighbours[0][0] = new cell('#FFFFFF');
            neighbours[0][1] = new cell('#FFFFFF');
            neighbours[0][2] = new cell('#FFFFFF');
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
            neighbours[2][0] = cellData[column + 1][row - 1];
            neighbours[2][1] = cellData[column + 1][row];
            neighbours[2][2] = cellData[column + 1][row + 1];
        } else if (row === 0) {
            neighbours[0][0] = new cell('#FFFFFF');
            neighbours[1][0] = new cell('#FFFFFF');
            neighbours[2][0] = new cell('#FFFFFF');
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[0][2] = cellData[column - 1][row + 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
            neighbours[2][1] = cellData[column + 1][row];
            neighbours[2][2] = cellData[column + 1][row + 1];
        } else if (column === cellData.length - 1) {
            neighbours[2][0] = new cell('#FFFFFF');
            neighbours[2][1] = new cell('#FFFFFF');
            neighbours[2][2] = new cell('#FFFFFF');
            neighbours[0][0] = cellData[column - 1][row - 1];
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[0][2] = cellData[column - 1][row + 1];
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
        } else if (row === cellData[column].length - 1) {
            neighbours[0][2] = new cell('#FFFFFF');
            neighbours[1][2] = new cell('#FFFFFF');
            neighbours[2][2] = new cell('#FFFFFF');
            neighbours[0][0] = cellData[column - 1][row - 1];
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[2][0] = cellData[column + 1][row - 1];
            neighbours[2][1] = cellData[column + 1][row];
        } else {
            neighbours[0][0] = cellData[column - 1][row - 1];
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[0][2] = cellData[column - 1][row + 1];
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
            neighbours[2][0] = cellData[column + 1][row - 1];
            neighbours[2][1] = cellData[column + 1][row];
            neighbours[2][2] = cellData[column + 1][row + 1];
        }
        return neighbours;
    };

    /**
     * Sammelt die Nachbarn in einem 2D Zellraum, der geschlossen ist
     * @param cellData: Zellraum
     * @param column: Spalte der Zelle
     * @param row: Zeile der Zelle
     * @returns {Array}: Nachbarn der Zelle
     */
    vm.getClosedMooreNeighbourhood = function (cellData, column, row) {
        var neighbours = _create2DArray(3);
        if (column === 0 && row === 0) {
            // Ecke links oben
            neighbours[0][0] = cellData[cellData.length-1][cellData[cellData.length-1].length-1];
            neighbours[0][1] = cellData[cellData.length-1][row];
            neighbours[0][2] = cellData[cellData.length-1][row + 1];
            neighbours[1][0] = cellData[column][cellData[column].length-1];
            neighbours[2][0] = cellData[column + 1][cellData[column].length-1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
            neighbours[2][1] = cellData[column + 1][row];
            neighbours[2][2] = cellData[column + 1][row + 1];
        } else if (column === 0 && row === cellData[column].length - 1) {
            // Ecke links unten
            neighbours[0][0] = cellData[cellData.length-1][row - 1];
            neighbours[0][1] = cellData[cellData.length-1][row];
            neighbours[0][2] = cellData[cellData.length-1][0];
            neighbours[1][2] = cellData[column][0];
            neighbours[2][2] = cellData[column+1][0];
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[2][0] = cellData[column + 1][row - 1];
            neighbours[2][1] = cellData[column + 1][row];
        } else if (column === cellData.length - 1 && row === 0) {
            // Ecke rechts oben
            neighbours[0][0] = cellData[column-1][cellData[column-1].length-1];
            neighbours[1][0] = cellData[column][cellData[column].length-1];
            neighbours[2][0] = cellData[0][cellData[0].length-1];
            neighbours[2][1] = cellData[0][row];
            neighbours[2][2] = cellData[0][row+1];
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[0][2] = cellData[column - 1][row + 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
        } else if (column === cellData.length - 1 && row === cellData[column].length - 1) {
            // Ecke rechts unten
            neighbours[2][0] = cellData[0][row-1];
            neighbours[2][1] = cellData[0][row];
            neighbours[2][2] = cellData[0][0];
            neighbours[1][2] = cellData[column][0];
            neighbours[0][2] = cellData[column-1][0];
            neighbours[0][0] = cellData[column - 1][row - 1];
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
        } else if (column === 0) {
            neighbours[0][0] = cellData[cellData.length-1][row-1];
            neighbours[0][1] = cellData[cellData.length-1][row];
            neighbours[0][2] = cellData[cellData.length-1][row+1];
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
            neighbours[2][0] = cellData[column + 1][row - 1];
            neighbours[2][1] = cellData[column + 1][row];
            neighbours[2][2] = cellData[column + 1][row + 1];
        } else if (row === 0) {
            neighbours[0][0] = cellData[column-1][cellData[column-1].length-1];
            neighbours[1][0] = cellData[column][cellData[column].length-1];
            neighbours[2][0] = cellData[column+1][cellData[column+1].length-1];
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[0][2] = cellData[column - 1][row + 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
            neighbours[2][1] = cellData[column + 1][row];
            neighbours[2][2] = cellData[column + 1][row + 1];
        } else if (column === cellData.length - 1) {
            neighbours[2][0] = cellData[0][row-1];
            neighbours[2][1] = cellData[0][row];
            neighbours[2][2] = cellData[0][row+1];
            neighbours[0][0] = cellData[column - 1][row - 1];
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[0][2] = cellData[column - 1][row + 1];
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
        } else if (row === cellData[column].length - 1) {
            neighbours[0][2] = cellData[column-1][0];
            neighbours[1][2] = cellData[column][0];
            neighbours[2][2] = cellData[column+1][0];
            neighbours[0][0] = cellData[column - 1][row - 1];
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[2][0] = cellData[column + 1][row - 1];
            neighbours[2][1] = cellData[column + 1][row];
        } else {
            neighbours[0][0] = cellData[column - 1][row - 1];
            neighbours[0][1] = cellData[column - 1][row];
            neighbours[0][2] = cellData[column - 1][row + 1];
            neighbours[1][0] = cellData[column][row - 1];
            neighbours[1][1] = cellData[column][row];
            neighbours[1][2] = cellData[column][row + 1];
            neighbours[2][0] = cellData[column + 1][row - 1];
            neighbours[2][1] = cellData[column + 1][row];
            neighbours[2][2] = cellData[column + 1][row + 1];
        }
        return neighbours;
    };

    /**
     * Prüft eine Nachbarschaft und eine Regel im 2D Automaten auf ihre Gleichheit
     * @param mooreArray: Nachbarschaft einer Zelle
     * @param ruleObjectNeighbourhood: visuelle Repräsentation einer Regel
     * @returns {boolean}: true wenn gleich; false wenn ungleich
     */
    vm.checkMooreEquality = function (mooreArray, ruleObjectNeighbourhood) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (mooreArray[i][j].color !== ruleObjectNeighbourhood[i][j].color) {
                    return false;
                }
            }
        }
        return true;
    };

    /**
     * Gibt die Nachbarn für eine Zelle im geschlossenen 1D Zellraum zurück
     * @param array: Zellraum
     * @param column: Spalte der Zelle
     * @returns {Array}: Nachbarn
     */
    vm.getClosedVonNeumannNeighbourhood = function (array, column) {
        var neighbours = [];
        if (column === 0) {
            neighbours[0] = array[array.length - 1];
            neighbours[1] = array[column];
            neighbours[2] = array[column + 1];
        } else if (column === array.length - 1) {
            neighbours[0] = array[column - 1];
            neighbours[1] = array[column];
            neighbours[2] = array[0];
        } else {
            neighbours[0] = array[column - 1];
            neighbours[1] = array[column];
            neighbours[2] = array[column + 1];
        }
        return neighbours;
    };

    /**
     * Gibt die Nachbarn für eine Zelle in einem 1D Zellraum mit Zellumlauf zurück
     * @param array: Zellraum
     * @param column: Spalte der Zelle
     * @returns {Array}: Nachbarn
     */
    vm.getOpenVonNeumannNeighbourhood = function (array, column) {
        var neighbours = [];
        if (column === 0) {
            neighbours[0] = [new cell('#FFFFFF')];
            neighbours[1] = array[column];
            neighbours[2] = array[column + 1];
        } else if (column === array.length - 1) {
            neighbours[0] = array[column - 1];
            neighbours[1] = array[column];
            neighbours[2] = [new cell('#FFFFFF')];
        } else {
            neighbours[0] = array[column - 1];
            neighbours[1] = array[column];
            neighbours[2] = array[column + 1];
        }
        return neighbours;
    };

    /**
     * Prüft ein eindimensionales Regelobjekt und eine Nachbarschaft auf Gleichheit
     * @param neumannArray: Nachbarschaft
     * @param ruleObjectNeighbourhood: Regelobjekt
     * @returns {boolean}: true wenn gleich; false wenn ungleich
     */
    vm.checkNeumannEquality = function (neumannArray, ruleObjectNeighbourhood) {
        for (var i = 0; i < neumannArray.length; i++) {
            if (neumannArray[i][0].color !== ruleObjectNeighbourhood[i][0].color) {
                return false;
            }
        }
        return true;
    };

    /**
     * ruft ein Modal auf, wenn der Automat gelöscht werden soll
     */
    vm.deleteAutomaton = function () {
        $scope.uibModal.open({
            ariaLabelledBy: 'modal-title',
            templateUrl: '/modules/courses/tools/tcs/automata/directives/modal/resetAutomaton/resetAutomaton.modal.view.html',
            controller: 'ResetAutomatonModalCtrl',
            controllerAs: 'vm',
            resolve: {
                data: function () {
                    return {
                        parentScope:$scope
                    };
                }
            }
        });
    };
};