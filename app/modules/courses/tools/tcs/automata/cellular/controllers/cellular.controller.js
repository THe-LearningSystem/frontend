
(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CellularCtrl', CellularCtrl);

    CellularCtrl.$inject = ['$scope','$state','Courses', '$stateParams','Authentication','$uibModal'];

    function CellularCtrl($scope,$state,Courses, $stateParams,Authentication,$uibModal) {
        var vm = this;

        vm.test = "Hallo";
        vm.sizeX = 100;
        vm.sizeY = 100;

        vm.cellSize = 15;
        var _create2DArray =function(rows) {
            var arr = [];

            for (var i=0;i<rows;i++) {
                arr[i] = [];
            }

            return arr;
        };

        function randomColor(){
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }

        vm.cellData =   _create2DArray(vm.sizeX);
        _.forEach(vm.cellData,function(row){
            for(var i = 0; i<= vm.sizeY;i++){
                    // row[i] = new cell(randomColor());
                row[i] = new cell('#000000');
            }
            // console.log(row);
        });
        console.log(vm.cellData);

        vm.selectedColor = '#ff0000';
        vm.isSelectedAlive = true;
        vm.dyeCell = function(cell){
            cell.color = vm.selectedColor;
        };

        vm.stage = new createjs.Stage('cellular-canvas');
        vm.stage.name= "Cellular Automata";
        createjs.Touch.enable(vm.stage);
        vm.stage.enableMouseOver(10);

        _.forEach(vm.cellData,function(row,indexX){
            _.forEach(row,function(cell,indexY){
                var rect = new createjs.Shape();
                rect.graphics.beginFill(cell.color);
                rect.graphics.drawRect(indexX*vm.cellSize, indexY*vm.cellSize, vm.cellSize, vm.cellSize);
                rect.graphics.endFill();
                rect.overColor = "#3281FF";
                rect.outColor = cell.color;
                rect.onMouseOver = handleMouseOver;
                rect.onMouseOut = handleMouseOut;
                rect.addEventListener("click", function(event) {
                    console.log("test",event.timeStamp -Date.now());
                    var target = event.target;
                    cell.color = vm.selectedColor;
                    cell.isAlive = vm.isSelectedAlive;
                    target.graphics.clear().beginFill(cell.color).drawRect(indexX*vm.cellSize, indexY*vm.cellSize, vm.cellSize, vm.cellSize).endFill();
                    // rect.graphics.beginFill(vm.selectedColor);
                });
                // console.log("asd",indexX,indexY);

                vm.stage.addChild(rect);
            })
        });
        vm.stage.update();

    vm.simulate= function(){
        _.forEach(vm.cellData,function(row,indexX){
            _.forEach(row,function(cell,indexY) {
                if(cell.isAlive){
                    console.log("am leben");

                    // cell.getNa
                }

            });
        });
    };
    


        function handleMouseOver(event) {
            console.log(event);
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
        }

    }
}());
