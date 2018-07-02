autoSim.StateDiagramPN = function ($scope) {
    "use strict";
    var self = this;
    
    autoSim.StateDiagram.apply(this, arguments);

    self.createTransitionPn = function (e) {
        //add listener that the selectedState follows the mouse
        self.svgOuter.on("mousemove", function () {
            var position = self.getCleanedPositionValues(d3.mouse(this)[0], d3.mouse(this)[1]);
            $scope.states.selected.y = position.y;
            $scope.states.selected.x = position.x;
            $scope.saveApply();
        });
        //create a new selectedState in a position not viewable
        $scope.states.selected = $scope.states.createTransitionWithPresets(-10000, -10000);
        $scope.states.isInCreation = true;
        $scope.saveApply();
    };
};
