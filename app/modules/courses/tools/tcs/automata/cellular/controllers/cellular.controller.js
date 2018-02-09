(function () {
    'use strict';

    angular
        .module('courses.tcs')
        .controller('CellularCtrl', CellularCtrl);

    CellularCtrl.$inject = ['$scope', '$state', 'Courses', '$stateParams', 'Authentication', '$uibModal'];

    function _initAutomaton($scope) {

        window.rootScope = $scope;
        $scope.saveApply = scopeSaveApply;
        $scope.debug = true;

        // Config Object
        $scope.automatonData = new autoSim.AutomatonData('CA');
        // $scope.simulator = new autoSim.SimulatorCA($scope);
        //$scope.simulator = new autoSim.SimulatorTM($scope);
        //$scope.statediagram = new autoSim.StateDiagram($scope);
        //$scope.statediagram.zoom = new autoSim.StateDiagramZoom($scope);
    }

    function CellularCtrl($scope, $state, Courses, $stateParams, Authentication, $uibModal) {
        var vm = this;

        _initAutomaton($scope);

        vm.twoD = false;
        vm.sizeX = 36;
        vm.sizeY = 36;
        vm.neighbourhoodSize = 3;
        vm.cellSize = 30;
        vm.selectedColor = '#FFFF00';
        vm.isSelectedAlive = true;
        vm.alreadyPlayed = false;
        vm.startConfig = [];
        vm.sequence = [];
        vm.sequenceNumber = 0;
        vm.stateTransitionRules = [];
        vm.ruleStages = [];
        vm.ruleId = 0;

        vm.stage = new createjs.Stage('cellSpace');
        vm.stage.name = "Cellular Automata";
        createjs.Touch.enable(vm.stage);
        vm.stage.enableMouseOver(10);


        vm.init = function () {
            vm.reset();
            vm.sequence.clear();
            vm.sequenceNumber = 0;
            vm.stateTransitionRules.clear();
            vm.ruleStages.clear();
            vm.ruleId = 0;
            vm.stage.removeAllChildren();
            // vm.stage.update();
            if (vm.twoD) {
                vm.cellData = _create2DArray(vm.sizeX);
                vm.cellData = fillArray(vm.cellData, vm.sizeY);
                vm.drawCanvas(vm.cellData);
            } else {
                vm.cellData = _create2DArray(vm.sizeX);
                vm.cellData = fillArray(vm.cellData, 1);
                vm.drawCanvas(vm.cellData);
            }
        };

        var _create2DArray = function (columns) {
            var arr = [];
            for (var i = 0; i < columns; i++) {
                arr[i] = [];
            }
            return arr;
        };

        var fillArray = function (array, rows) {
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < rows; j++) {
                    array[i][j] = new cell('#FFFFFF');
                }
            }
            // _.forEach(array, function (row) {
            //     for (var i = 0; i < vm.sizeY; i++) {
            //         // row[i] = new cell(randomColor());
            //         row[i] = new cell('#FFFFFF');
            //     }
            //     // console.log(row);
            // });
            return array;
        };

        // vm.cellData = _create2DArray(vm.sizeX);
        // vm.cellData = fillArray(vm.cellData);

        vm.drawCanvas = function (dataArray) {
            _.forEach(dataArray, function (row, indexX) {
                _.forEach(row, function (cell, indexY) {
                    var rect = new createjs.Shape();
                    rect.graphics.setStrokeStyle(1);
                    rect.graphics.beginStroke('#c4c4c4');
                    rect.graphics.beginFill(cell.color);
                    rect.graphics.drawRect(indexX * vm.cellSize, indexY * vm.cellSize, vm.cellSize, vm.cellSize);
                    rect.graphics.endFill();
                    // rect.overColor = "#3281FF";
                    // rect.outColor = cell.color;
                    // rect.onMouseOver = handleMouseOver;
                    // rect.onMouseOut = handleMouseOut;
                    // rect.addEventListener("mouseover", function (event) {
                    //     var target = event.target;
                    //     target.graphics.clear().setStrokeStyle(1).beginStroke('#c4c4c4').beginFill('#3281FF').drawRect(indexX*vm.cellSize, indexY*vm.cellSize, vm.cellSize, vm.cellSize).endFill();
                    // });
                    // rect.addEventListener("mouseout", function (event) {
                    //     var target = event.target;
                    //     target.graphics.clear().setStrokeStyle(1).beginStroke('#c4c4c4').beginFill('#FFFFFF').drawRect(indexX*vm.cellSize, indexY*vm.cellSize, vm.cellSize, vm.cellSize).endFill();
                    // });
                    rect.addEventListener("click", function (event) {
                        var target = event.target;
                        cell.color = vm.selectedColor;
                        cell.isAlive = vm.isSelectedAlive;
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

        vm.randomNumber = function () {
            return Math.round(Math.random());
        };

        vm.paintCell = function (cell) {
            cell.color = vm.selectedColor;
        };

        // vm.simulate = function () {
        //     _.forEach(vm.cellData, function (row, indexX) {
        //         _.forEach(row, function (cell, indexY) {
        //             if (cell.isAlive) {
        //                 console.log("am leben");
        //
        //                 // cell.getNa
        //             }
        //
        //         });
        //     });
        // };

        vm.stateTransitionRuleObject = function (id, oldState, newState) {
            var self = this;
            self.id = id;
            self.oldState = oldState;
            self.newState = newState;
            if (vm.twoD) {
                self.neighbourhood = _create2DArray(3);
                self.neighbourhood = fillArray(self.neighbourhood, 3);
            } else {
                self.neighbourhood = _create2DArray(3);
                self.neighbourhood = fillArray(self.neighbourhood, 1);
            }
        };
        // vm.stateTransitionRules = function () {
        //     var self = this;
        //     self.ruleId = 0;
        //
        //     self.create = function (oldState, newState, neighbourhood) {
        //         return self[self.push(new vm.stateTransitionRuleObject(self.ruleId++, oldState, newState, neighbourhood)) - 1];
        //     };
        //
        //     self.getById = function (id) {
        //         console.log();
        //         return self[_.findIndex(self, function (rule) {
        //             if (rule.id == id) {
        //                 return rule;
        //             }
        //         })];
        //     };
        // };
        // vm.stateTransitionRules.prototype = Array.prototype;

        // var tmp = new vm.stateTransitionRuleObject(vm.ruleId++, 'b', 'l');
        // vm.stateTransitionRules.push(tmp);
        // var tmp2 = new vm.stateTransitionRuleObject(vm.ruleId++, 'b', 'l');
        // vm.stateTransitionRules.push(tmp2);
        // var tmp3 = new vm.stateTransitionRuleObject(vm.ruleId++, 'b', 'l');
        // vm.stateTransitionRules.push(tmp3);

        vm.createRuleObject = function () {
            var ruleObject = new vm.stateTransitionRuleObject(vm.ruleId++, '#FFFFFF', '#FFFFFF');
            vm.stateTransitionRules.push(ruleObject);
            return ruleObject;
        };

        vm.initRule = function ($event, ruleId) {
            vm.createRule(ruleId);
        };

        vm.createRule = function (ruleId) {
            var ruleObject = vm.stateTransitionRules[ruleId];
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
                        ruleObject.oldState = ruleObject.neighbourhood[1][1].color;
                    });
                    tmpStage.addChild(rect);
                });
            });

            var newState = new createjs.Shape();
            newState.graphics.setStrokeStyle(1)
                .beginStroke('#c4c4c4')
                .beginFill('#FFFFFF');
            if (vm.twoD) {
                newState.graphics.drawRect(vm.cellSize * 4 + 1, vm.cellSize + 1, vm.cellSize, vm.cellSize)
                    .endFill();
            } else {
                newState.graphics.drawRect(vm.cellSize + 1, vm.cellSize + vm.cellSize/2 + 1, vm.cellSize, vm.cellSize)
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
                if (vm.twoD) {
                    newState.graphics.drawRect(vm.cellSize * 4 + 1, vm.cellSize + 1, vm.cellSize, vm.cellSize)
                        .endFill();
                } else {
                    newState.graphics.drawRect(vm.cellSize + 1, vm.cellSize + vm.cellSize/2 + 1, vm.cellSize, vm.cellSize)
                        .endFill();
                }
                ruleObject.newState = cell.color;
            });
            tmpStage.addChild(newState);

            tmpStage.update();
        };

        vm.deleteRule = function (id) {
            vm.ruleId = vm.ruleId - 1;
            vm.ruleStages.splice(id, 1);
            vm.stateTransitionRules.splice(id, 1);
        };

        vm.calcDevelopment = function () {
            // vm.startConfig = _.cloneDeep(vm.cellData);
            vm.sequence[vm.sequenceNumber++] = vm.cellData;
            var tmpData = _.cloneDeep(vm.cellData);
            _.forEach(tmpData, function (row, i) {
                _.forEach(row, function (cell, j) {
                    _.forEach(vm.stateTransitionRules, function (rule) {
                        if (vm.testNeighbourhoodEquality(vm.getMooreNeighbourhood(vm.cellData, i, j), rule.neighbourhood)) {
                            tmpData[i][j].color = rule.newState;
                        }
                    });
                });
            });
            vm.cellData = _.cloneDeep(tmpData);
            vm.drawCanvas(vm.cellData);
        };

        vm.getMooreNeighbourhood = function (cellData, column, row) {
            var neighbours = _create2DArray(3);
            if (column === 0 && row === 0) {
                // console.log("Ecke links oben");
                neighbours[0][0] = new cell('#FFFFFF');
                neighbours[0][1] = new cell('#FFFFFF');
                neighbours[0][2] = new cell('#FFFFFF');
                neighbours[1][0] = new cell('#FFFFFF');
                neighbours[2][0] = new cell('#FFFFFF');
                neighbours[1][1] = cellData[column][row];
                neighbours[1][2] = cellData[column][row + 1];
                neighbours[2][1] = cellData[column + 1][row];
                neighbours[2][2] = cellData[column + 1][row + 1];
            } else if (column === 0 && row === vm.sizeY - 1) {
                // console.log("Ecke links unten");
                neighbours[0][0] = new cell('#FFFFFF');
                neighbours[0][1] = new cell('#FFFFFF');
                neighbours[0][2] = new cell('#FFFFFF');
                neighbours[1][2] = new cell('#FFFFFF');
                neighbours[2][2] = new cell('#FFFFFF');
                neighbours[1][0] = cellData[column][row - 1];
                neighbours[1][1] = cellData[column][row];
                neighbours[2][0] = cellData[column + 1][row - 1];
                neighbours[2][1] = cellData[column + 1][row];
            } else if (column === vm.sizeX - 1 && row === 0) {
                // console.log("Ecke rechts oben");
                neighbours[0][0] = new cell('#FFFFFF');
                neighbours[1][0] = new cell('#FFFFFF');
                neighbours[2][0] = new cell('#FFFFFF');
                neighbours[2][1] = new cell('#FFFFFF');
                neighbours[2][2] = new cell('#FFFFFF');
                neighbours[0][1] = cellData[column - 1][row];
                neighbours[0][2] = cellData[column - 1][row + 1];
                neighbours[1][1] = cellData[column][row];
                neighbours[1][2] = cellData[column][row + 1];
            } else if (column === vm.sizeX - 1 && row === vm.sizeY - 1) {
                // console.log("Ecke rechts unten");
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
            } else if (column === vm.sizeX - 1) {
                neighbours[2][0] = new cell('#FFFFFF');
                neighbours[2][1] = new cell('#FFFFFF');
                neighbours[2][2] = new cell('#FFFFFF');
                neighbours[0][0] = cellData[column - 1][row - 1];
                neighbours[0][1] = cellData[column - 1][row];
                neighbours[0][2] = cellData[column - 1][row + 1];
                neighbours[1][0] = cellData[column][row - 1];
                neighbours[1][1] = cellData[column][row];
                neighbours[1][2] = cellData[column][row + 1];
            } else if (row === vm.sizeY - 1) {
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

        // vm.getVonNeumannNeighbourhood = function (array) {
        //     var neighbours = [];
        // };

        vm.testNeighbourhoodEquality = function (neighbourArray, ruleObjectNeighbourhood) {
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (neighbourArray[i][j].color !== ruleObjectNeighbourhood[i][j].color) {
                        return false;
                    }
                }
            }
            return true;
        };

        vm.isInPlay = false;
        vm.simulationPaused = false;

        vm.reset = function () {
            vm.isInPlay = false;
            vm.simulationPaused = true;

            vm.alreadyPlayed = false;
            vm.sequence = [];
            vm.sequenceNumber = 0;
        };

        vm.storeStartConfig = function () {
            vm.startConfig = _.cloneDeep(vm.cellData);
        };

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

        vm.play = function () {
            if (!vm.simulationPaused) {
                vm.isInPlay = true;
                vm.calcDevelopment();
                setTimeout(function () {
                    vm.play();
                }, 500);
            }
        };

        vm.pause = function () {
            if (!vm.simulationPaused) {
                vm.simulationPaused = true;
                vm.isInPlay = false;
            }
        };

        vm.stop = function () {
            vm.pause();
            vm.cellData = _.cloneDeep(vm.startConfig);
            vm.drawCanvas(vm.cellData);
            vm.reset();
        };

        vm.stepForward = function () {
            if (!vm.alreadyPlayed) {
                vm.storeStartConfig();
                vm.alreadyPlayed = true;
            }
            vm.calcDevelopment();
        };

        vm.stepBackwards = function () {
            vm.sequenceNumber = vm.sequenceNumber - 1;
            if (vm.sequenceNumber === 0) {
                vm.alreadyPlayed = false;
            }
            vm.cellData = _.cloneDeep(vm.sequence[vm.sequenceNumber]);
            vm.drawCanvas(vm.cellData);
        };

        vm.randomize = function () {
            _.forEach(vm.cellData, function (row, indexX) {
                _.forEach(row, function (cell, indexY) {
                    if (vm.randomNumber() === 1) {
                        vm.paintCell(cell);
                    }
                });
            });
            vm.drawCanvas(vm.cellData);
        };

        vm.init();

        function handleMouseOver(event) {
            var target = event.target;
            target.graphics.clear().beginFill(target.overColor).drawRect(0, 0, width, height).endFill();
        }

        function handleMouseOut(event) {
            var target = event.target;
            target.graphics.clear().beginFill(target.outColor).drawRect(0, 0, width, height).endFill();
        }

        createjs.Ticker.addEventListener("tick", handleTick);
        function handleTick() {
            vm.stage.update();
            _.forEach(vm.ruleStages, function (tmpStage) {
                tmpStage.update();
            });
        }

    }
}());
