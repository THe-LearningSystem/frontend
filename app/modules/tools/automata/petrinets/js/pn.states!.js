autoSim.StatesPN = function ($scope) {
    var self = this;
    
    autoSim.States.apply(this, arguments);
 
    self.transitionPrefix = "T";

    self.createTransitionWithPresets = function (x, y) {
        var transitionNameNumber = self.length;
        while (self.existsWithName((self.transitionPrefix + transitionNameNumber))) {
            transitionNameNumber++;
        }
        var obj = self.createTransition((self.transitionPrefix + transitionNameNumber), x, y);

        return obj;
    };

    self.createTransition = function (transitionName, x, y) {
        if (!self.existsWithName(transitionName)) {
            return self.createTransitionWithId(self.statesId++, transitionName, x, y);
        } else {
            console.error("State with name already exists!", self.getByName(transitionName));
            return undefined;
        }
    };

    self.createTransitionWithId = function (transitionId, transitionName, x, y) {
        var transition = new autoSim.TransitionPn(transitionId, transitionName, x, y, false);
        self.push(transition);
        $scope.core.updateListener();
        $scope.saveApply();
        
        return transition;
    };
    
    self.remove = function (state) {

        if (self.hasTransitions(state)) {
            $scope.$uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/tools/automata/directives/modal/deleteState/deleteState.modal.view.html',
                controller: 'DeleteStateModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {
                            state: state,
                            parentScope: $scope
                        };
                    }
                }
            });
            return false;
        } else {
            self.splice(self.getIndexByStateId(state.id), 1);
            $scope.simulator.removeError(state);
            $scope.simulator.undoList = [];
            $scope.simulator.redoList = [];
            $scope.core.updateListener();
            return true;
        }
    };
    
    self.updateTokens = function (states) {
        
        _.forEach(states, function (state) {
            
            
            for(var i = 0; i < self.length; i++) {

                if (self[i].id === state.id) {
                    self[i].tokens = state.tokens;
                }
            }
             
        });
    };

    self.createWithId = function (placeId, placeName, x, y) {
        var tokens = 0;
        var capacity = "∞";
        var place = new autoSim.Place(placeId, placeName, tokens, capacity, x, y, true);
        self.push(place);
        $scope.core.updateListener();
        $scope.saveApply();

        return place;
    };
    
    self.changeTokenCount = function (state, newTokenCount) {

        if (self.onlyPositiveNumbers(newTokenCount) && state.place) {
            console.error("Tokens can only be positive numbers!", self.getByName(newTokenCount));
            return false;
        } else {
            newTokenCount = parseInt(newTokenCount);
            state.tokens = newTokenCount;
            $scope.simulator.checkErrors(state);
            $scope.core.updateListener();
            $scope.simulator.undoList = [];
            $scope.simulator.redoList = [];
            return true;
        }
    };
    
    self.changeCapacity = function (state, capacity) {

        if (self.onlyPositiveNumbers(capacity) && state.place) {
            console.error("Capacity can only be positive numbers!", self.onlyPositiveNumbers(capacity));
            return false;
        } else {
            
            if (capacity !== "∞")
                capacity = parseInt(capacity);
            state.capacity = capacity;
            $scope.simulator.checkErrors(state);
            $scope.core.updateListener();
            $scope.simulator.undoList = [];
            $scope.simulator.redoList = [];
            return true;
        }
    };
    
    self.onlyPositiveNumbers = function (toCheck) {
        
        if (toCheck === "∞")
            return false;
        else if (toCheck !== undefined)
            return !/^\+?(0|[1-9]\d*)$/.test(toCheck);
    };
    
    self.capacityBiggerThanTokens = function (capacity, tokens) {
        tokens = parseInt(tokens);
        
        if (capacity === "∞")
            return true;
        else 
            return capacity >= tokens;
    };
    
};
autoSim.StatesPN.prototype = Array.prototype;