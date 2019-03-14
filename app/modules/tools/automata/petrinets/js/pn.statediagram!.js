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
    
    // For identification from which to which State the transition is going
    self.fromPlace = null;
    
    self.createTransition = function (fromState) {
        self.inCreateTransition = true;
        var approachTransitionGroup = undefined;
        self.tmpTransition = {};
        self.tmpTransition.fromState = fromState;
        var mouseInState = false;
        
        if (fromState === undefined) {
            self.fromPlace = null;

            d3.selectAll(".state").on("click", function () {
                d3.event.stopPropagation();
                var fromState = $scope.states.getById(parseInt(d3.select(this).attr("object-id")));
                
                if (fromState.place)
                    self.fromPlace = true;
                else
                    self.fromPlace = false;
                
                self.createTransition(fromState);
            });

        } else {
            d3.selectAll('.state').on('click', null);
            d3.selectAll(".state").on("click", function () {
                var toState = $scope.states.getById(parseInt(d3.select(this).attr("object-id")));
                
                if (self.fromPlace !== toState.place && $scope.transitions.checkOnlyOneTransitionObject(fromState, toState)) {
                    $scope.transitions.createWithDefaults(self.tmpTransition.fromState, toState);
                    $scope.transitions.menu.edit.open($scope.transitions.getTransitionGroup(self.tmpTransition.fromState, toState));
                    self.removeTmpTransition();
                    $scope.$apply();
                    d3.selectAll(".state").on("click", $scope.states.menu.edit.openHandler);
                }
            }).on("mouseover", function () {
                mouseInState = true;
                var toState = $scope.states.getById(parseInt(d3.select(this).attr("object-id")));
                var tmpTransitionGroup = new autoSim.TransitionGroup(self.tmpTransition.fromState, toState);
                var svgConfig = $scope.transitions.getTransitionSvgConfig(tmpTransitionGroup);
                approachTransitionGroup = $scope.transitions.getTransitionGroup(toState, self.tmpTransition.fromState);
                $scope.$apply(function () {
                    if (approachTransitionGroup !== undefined) {
                        approachTransitionGroup.svgConfig = $scope.transitions.getTransitionSvgConfig(approachTransitionGroup, true);
                    }
                    self.tmpTransition.path = svgConfig.path;
                });
            }).on("mouseleave", function () {
                $scope.$apply(function () {
                    if (approachTransitionGroup !== undefined)
                        approachTransitionGroup.svgConfig = $scope.transitions.getTransitionSvgConfig(approachTransitionGroup);
                });
                mouseInState = false;
            });
            d3.select("#diagram-svg").on("mousemove", function () {
                if (!mouseInState) {
                    var position = self.getCleanedPositionValues(d3.mouse(this)[0], d3.mouse(this)[1]);
                    var path = d3.path();
                    path.moveTo(self.tmpTransition.fromState.x, self.tmpTransition.fromState.y);
                    path.lineTo(position.x, position.y);
                    $scope.$apply(function () {
                        self.tmpTransition.path = path.toString();
                    });
                }
            });
        }
    };
};
