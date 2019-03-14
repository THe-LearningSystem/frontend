autoSim.TransitionMenusPN = function ($scope) {
    var self = this;

    autoSim.TransitionMenus.apply(this, arguments);

    self.prepareTransitionMenuData = function (transitionGroup) {
        self.edit.transitionGroup = _.cloneDeep(transitionGroup);
        _.forEach(self.edit.transitionGroup, function (transition) {
            var tmpInputSymbol = transition.tokens;
            transition.inputSymbol = {};
            transition.inputSymbol.value = tmpInputSymbol;
            transition.inputSymbol.error = false;
        });
    };
    
    self.edit.addWatcher = function () {
        for (var i = 0; i < self.edit.transitionGroup.length; i++) {
            self.edit.watcher.push($scope.$watch("transitions.menu.edit.transitionGroup['" + i + "']", function (newValue, oldValue) {
                var inputSymbolErrorFound = false;
                if (newValue.inputSymbol.value !== oldValue.inputSymbol.value) {
                    newValue.inputSymbol.error = false;
                    
                    if (newValue.inputSymbol.value !== "" && !$scope.transitions.exists($scope.states.getById(newValue.fromState.id), $scope.states.getById(newValue.toState.id), newValue.inputSymbol.value) && !$scope.states.onlyPositiveNumbers(newValue.inputSymbol.value) && $scope.transitions.tokensBiggerZero(newValue.inputSymbol.value)) {
                        $scope.transitions.modify($scope.transitions.getById(newValue.id), newValue.inputSymbol.value, newValue.inputSymbol.value);
                    } else {
                        newValue.inputSymbol.error = true;
                        inputSymbolErrorFound = true;
                    }
                }
                if ($scope.transitions.exists($scope.states.getById(newValue.fromState.id),
                        $scope.states.getById(newValue.toState.id),
                        newValue.inputSymbol.value, newValue.id)) {
                    newValue.isUnique = false;
                    newValue.inputSymbol.error = true;
                } else {
                    if (!newValue.isUnique) {
                        newValue.inputSymbol.error = inputSymbolErrorFound;
                    }
                    newValue.isUnique = true;
                }
                $scope.saveApply();
            }, true));
        }
    };
};
