autoSim.StateMenusPN = function ($scope) {

    var self = this;

    autoSim.StateMenus.apply(this, arguments);
    
    self.edit.open = function (state) {
        $scope.core.closeMenus();
        if (d3.event !== null && d3.event.stopPropagation !== undefined) {
            d3.event.stopPropagation();
        }
        $scope.states.selected = state;
        self.edit.state = _.cloneDeep(state);

        self.edit.watcher.push($scope.$watch('states.menu.edit.state.name', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (newValue !== "" && newValue != undefined && !$scope.states.existsWithName(newValue, self.edit.state.id)) {
                    !$scope.states.rename($scope.states.selected, newValue);
                }
            }
        }));
        
        //For Tokens.
        self.edit.watcher.push($scope.$watch('states.menu.edit.state.tokens', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (newValue !== "" && newValue != undefined) {
                    !$scope.states.changeTokenCount($scope.states.selected, newValue);
                }
            }
        }));
        self.edit.isOpen = true;

        $scope.saveApply();
    };
};