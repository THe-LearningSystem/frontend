autoSim.SimulatorPN = function ($scope) {
    var self = this;
    
    autoSim.Simulator.apply(this, arguments);
    
    self.reset = function () {
        self.startMarkingFunction = {
            saved: false,
            states: null,
            transitions: null
        };

        self.undoList = [];
        self.redoList = [];
        self.lastStep = null;
        self.startMarking = false;

        self.hover = null;
        self.errors = [];
    };
    //set values on init
    self.reset();
    
    self.resetSimulation = function () {
        self.startMarkingFunction.saved = false;

        $scope.core.closeMenus();
        
        _.forEach(self.startMarkingFunction.states, function (state) {
            
            _.forEach($scope.states, function (value) {
                
                if (value.id === state.id) {
            
                    if (value.place) {
                        $scope.states.changeTokenCount(value, state.tokens);
                    }
                }
            });
        });
        self.undoList = [];
        self.redoList = [];
        self.isInPlay = false;
        self.startMarkingFunction = {
            saved: false,
            states: null,
            transitions: null
        };
    };
    
    self.playOrPause = function () {
        
        if (self.isInPlay) {
            
        } else {
            
            if (!self.startMarkingFunction.saved) {
                self.startMarkingFunction.saved = true;
                self.startMarkingFunction.states = _.cloneDeep($scope.states);
                self.startMarkingFunction.transitions = _.cloneDeep($scope.transitions);
            }
            $scope.core.closeMenus();
        }
        
        self.isInPlay = !self.isInPlay;
    };
    
    self.switchTransition = function (trans) {
        self.undoList.push(_.cloneDeep($scope.states));
        self.executePreRegion(trans);
        self.executePostRegion(trans);
        self.checkErrors();
        self.redoList = [];
    };
    
    self.executePreRegion = function (state) {
        
        _.forEach($scope.transitions, function (transitions) {
            
            if (transitions[0].toState.id === state.id) {
                transitions[0].fromState.tokens -= transitions[0].tokens;
            }
        });
    };
    
    self.executePostRegion = function (state) {
                
        _.forEach($scope.transitions, function (transitions) {
            
            if (transitions[0].fromState.id === state.id) {
                transitions[0].toState.tokens += transitions[0].tokens;
            }
        });
    };
    
    self.checkErrors = function () {
        
        _.forEach($scope.states, function (value) {
            
            if (value.place) {
        
                if ($scope.states.onlyPositiveNumbers(value.tokens) || $scope.states.onlyPositiveNumbers(value.capacity) || !$scope.states.capacityBiggerThanTokens(value.capacity, value.tokens)) {
                    if (!_.includes(self.errors, value)) {
                        self.errors.push(value);
                        self.isInPlay = false;
                        $scope.states.menu.edit.open(value);
                    }
                } else {
                    _.remove(self.errors, function(n) {
                        return n.id === value.id;
                    });
                }
            }
        });
    };
    
    self.removeError = function (state) {
        _.remove(self.errors, function(n) {
            return n.id === state.id;
        });
    };
    
    // Marking of place in statediagram.
    self.checkPlaceMarking = function (state) {
        
        _.forEach($scope.transitions, function (value) {
            
            if (value[0].toState === self.hover) {
                
                if (value[0].fromState === state) {
                    return true;
                }
            }
            
            if (value[0].fromState === self.hover) {

                if (value[0].toState === state) {
                    return true;
                }
            }
        });
    };
    
    self.mouseover = function (check) {
        
        _.forEach($scope.states, function (value) {
            
            if (!value.place && check.id === value.id && self.isInPlay) {
                self.hover = check;
                self.hover.states = [];
                
                _.forEach($scope.transitions, function (value) {
                    
                    if (value.fromState === check && value.toState.place) {
                        
                        if (!_.includes(self.hover.states, value.toState))
                            self.hover.states.push(value.toState);
                        
                    } else if (value.toState === check && value.fromState.place) {

                        if (!_.includes(self.hover.states, value.fromState))
                            self.hover.states.push(value.fromState);
                    }
                });
            }
        });
    };

    self.hoverPlace = function (state) {
        
        if (self.hover !== null)
            return _.includes(self.hover.states, state);
    };
            
    self.mouseleave = function () {
        self.hover = null;
    };
    
    self.undo = function () {
        var tmp = null;
        $scope.core.closeMenus();
        
        if (self.redoList.length === 0 && !self.startMarking) {
            self.startMarking = true;
            self.redoList.push(_.cloneDeep($scope.states));
        }
        
        if (self.lastStep === "redo") {
            tmp = self.undoList.pop();
            self.redoList.push(tmp);
        }
        
        tmp = self.undoList.pop();
        self.redoList.push(tmp);
        $scope.states.updateTokens(tmp);
        self.checkErrors();
        self.lastStep = "undo";
    };
    
    self.redo = function () {
        var tmp = null;
        $scope.core.closeMenus();

        if (self.lastStep === "undo") {
            tmp = self.redoList.pop();
            self.undoList.push(tmp);
        }
        
        tmp = self.redoList.pop();
        self.undoList.push(tmp);
        $scope.states.updateTokens(tmp);
        self.checkErrors();
        self.lastStep = "redo";
    };
    
    self.switchable = function (state) {
        var pre = self.checkPreRegion(state);
        var post = self.checkPostRegion(state);
        //var simpleLoop = self.checkSimpleLoop(state);
        
        if (pre && post)
            return true;
    };
    
    self.checkPreRegion = function (state) {
        var trans = 0;
        var checkedTrans = 0;
        
        _.forEach($scope.transitions, function (transition) {
            
            if (state === transition.toState) {
                trans++;

                if ((transition.fromState.tokens - transition[0].tokens) >= 0) {
                    checkedTrans++;
                
                } else if (self.checkSimpleLoop(state, transition, true)) {
                    checkedTrans++;
                }
            }
        });
        
        if (trans === checkedTrans || trans === 0)
            return true;
        
        return false;
    };
    
    self.checkPostRegion = function (state) {
        var trans = 0;
        var checkedTrans = 0;
        
        _.forEach($scope.transitions, function (transition) {
            
            if (state === transition.fromState) {
                trans++;

                if ($scope.states.capacityBiggerThanTokens(transition.toState.capacity, (transition.toState.tokens + transition[0].tokens))) {
                    checkedTrans++;
               
                } else if (self.checkSimpleLoop(state, transition, false)) {
                    checkedTrans++;
                }
            }
        });

        if (trans === checkedTrans || trans === 0)
            return true;
        
        return false;
    };
    
    self.checkSimpleLoop = function (state, transition, from) {
        result = false;
        
        _.forEach($scope.transitions, function (search) {

            if (from) {

                // transition === toState -> switch
                if (state === search.fromState) {

                    if (transition.fromState === search.toState) {
                        var calculated = transition.fromState.tokens - transition[0].tokens;
                        calculated += search[0].tokens;

                        if ($scope.states.capacityBiggerThanTokens(transition.fromState.capacity, calculated) && calculated >= 0) {
                            result = true;
                        }
                    }
                }
            
            } else {
                
                // transition === fromState -> switch
                if (state === search.toState) {

                    if (search.fromState === transition.toState) {
                        var calculated = search.fromState.tokens - search[0].tokens;
                        calculated += transition[0].tokens;

                        if ($scope.states.capacityBiggerThanTokens(transition.toState.capacity, calculated) && calculated >= 0)
                            result = true;
                    }
                }
            }
        });
        
        return result;
    };
};
