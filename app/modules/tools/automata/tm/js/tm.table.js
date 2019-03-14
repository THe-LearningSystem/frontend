/**
 * Creating and updating the tabular display format
 * @param $scope
 */
autoSim.TableTM = function ($scope) {
    var self = this;
    autoSim.Table.apply(this, arguments);
    self.statesTransitions = [];
    $scope.core.updateListeners.push(self);

    /**
     * Collects and saves all states and transitions from the state diagram
     */
    self.getStatesWithTransition = function () {
        var tmpObject;
        _.forEach($scope.states, function (state) {
            tmpObject = {};
            tmpObject.state = state;
            tmpObject.trans = [];

            _.forEach($scope.transitions.transitionAlphabet, function (inputSymbol) {
                var trans = [];

                _.forEach($scope.transitions, function (transitionGroup) {
                    _.forEach(transitionGroup, function (transition) {
                        if (transition.fromState === tmpObject.state && transition.inputSymbol === inputSymbol) {
                            var tmpTransition = _.cloneDeep(transition);
                            if ($scope.simulator.animated.transition === transition)
                                tmpTransition.animated = true;
                            _.forEach($scope.transitions.selected, function (selectedTransition) {
                                if (selectedTransition === transition)
                                    tmpTransition.selected = true;
                            });
                            trans.push(tmpTransition);
                        }
                    });
                });

                tmpObject.trans.push(trans);
            });
            self.statesTransitions.push(tmpObject);
        });
    };

    /**
     * Collects and saves all input symbols from the state diagram
     */
    self.getAlphabet = function () {
        var tmpObject;
        _.forEach($scope.transitions.transitionAlphabet, function (inputSymbol) {
            tmpObject = {};

            tmpObject.inputSymbol = inputSymbol;
            if ($scope.transitions.selected) {
                _.forEach($scope.transitions.selected, function (transition) {
                    if (transition.inputSymbol === tmpObject.inputSymbol) {
                        tmpObject.selected = true;
                    }
                })
            }

            if ($scope.simulator.animated.transition && $scope.simulator.animated.transition.inputSymbol === inputSymbol) {
                tmpObject.animated = true;
            }
            self.transitionAlphabet.push(tmpObject);
        });
    };

    /**
     * function called by the watchers to update the table
     */
    self.updateFunction = function () {
        self.statesTransitions = [];
        self.transitionAlphabet = [];

        //prepare alphabet
        self.getAlphabet();
        self.getStatesWithTransition();
    };

    /**
     * Watchers which are looking out for changes of the state diagram
     */
    $scope.$watch('simulator.animated.currentState', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });

    $scope.$watch('simulator.animated.transition', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
    $scope.$watch('simulator.animated.nextState', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
    $scope.$watch('transitions.tapeAlphabet', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
};
