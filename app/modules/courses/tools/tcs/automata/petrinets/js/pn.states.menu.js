autoSim.StateMenusPN = function ($scope) {

    var self = this;

    autoSim.StateMenus.apply(this, arguments);
  
    self.edit.openHandler = function () {
        if ($scope.states.isInCreation) {
            $scope.statediagram.svgOuter.on("mousemove", null);
            $scope.states.isInCreation = false;
            $scope.saveApply();
        }
        
        if (!$scope.simulator.isInPlay) {
            $scope.states.menu.edit.open($scope.states.getById(parseInt(d3.select(this).attr("object-id"))));
        
        } else {
            
            if (!$scope.states.getById(parseInt(d3.select(this).attr("object-id"))).place) {
                $scope.simulator.switchTransition($scope.states.getById(parseInt(d3.select(this).attr("object-id"))));
            
            } else {
                $scope.states.menu.edit.open($scope.states.getById(parseInt(d3.select(this).attr("object-id"))));
            }
        }
    };
    
    self.edit.open = function (state) {
        var tmpCheck = true;
        
        if ($scope.simulator.isInPlay && !state.place) {
            tmpCheck = false;
        }
        
        if (tmpCheck) {
            $scope.core.closeMenus();
            if (d3.event !== null && d3.event.stopPropagation !== undefined) {
                d3.event.stopPropagation();
            }
            $scope.states.selected = state;
            self.edit.state = _.cloneDeep(state);

            self.edit.watcher.push($scope.$watch('states.menu.edit.state.name', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue !== "" && newValue !== undefined && !$scope.states.existsWithName(newValue, self.edit.state.id)) {
                        $scope.states.rename($scope.states.selected, newValue);
                    }
                }
            }));

            //For tokens.
            self.edit.watcher.push($scope.$watch('states.menu.edit.state.tokens', function (newValue, oldValue) {
                newValue = parseInt(newValue);
                
                if (newValue !== oldValue) {
                    if (newValue !== "" && newValue !== undefined && $scope.states.capacityBiggerThanTokens($scope.states.selected.capacity, newValue)) {
                        $scope.states.changeTokenCount($scope.states.selected, newValue);
                        $scope.states.changeCapacity($scope.states.selected, $scope.states.menu.edit.state.capacity);
                        $scope.simulator.startMarkingFunction.states = _.cloneDeep($scope.states);
                    }
                }
            }));

            //For capacity.
            self.edit.watcher.push($scope.$watch('states.menu.edit.state.capacity', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue !== "" && newValue !== undefined && $scope.states.capacityBiggerThanTokens(newValue, $scope.states.selected.tokens)) {
                        $scope.states.changeTokenCount($scope.states.selected, $scope.states.menu.edit.state.tokens);
                        $scope.states.changeCapacity($scope.states.selected, newValue);
                    }
                }
            }));
            self.edit.isOpen = true;

            $scope.saveApply();
        }
    };
};