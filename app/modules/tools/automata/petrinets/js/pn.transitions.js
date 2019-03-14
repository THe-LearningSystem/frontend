autoSim.TransitionsPN = function ($scope) {
    var self = this;

    autoSim.Transitions.apply(this, arguments);
    
    self.create = function (fromState, toState, inputSymbol) {
        self.inputSymbolAlphabet.addIfNotExists(inputSymbol);
            
        return self.createWithId(self.transitionsId++, fromState, toState, inputSymbol);
    };
    
    self.createWithId = function (transitionId, fromState, toState, inputSymbol) {
        var tokens = 1;
        var transitionGroup = self.getTransitionGroup(fromState, toState);
        var transition = undefined;
        if (transitionGroup === undefined) {
            transitionGroup = new autoSim.TransitionGroupPN(fromState, toState);
            transition = transitionGroup.create(transitionId, tokens);
            self.push(transitionGroup);
        } else {
            transition = transitionGroup.create(transitionId, tokens);
        }
        //update the approach transition if there is one
        if (self.getTransitionGroup(transitionGroup.toState, transitionGroup.fromState) !== undefined) {
            var approachTransitionGroup = self.getTransitionGroup(transitionGroup.toState, transitionGroup.fromState);
            approachTransitionGroup.svgConfig = self.getTransitionSvgConfig(approachTransitionGroup, true);
        }
        $scope.core.updateListener();
        return transition;
    };
    
    self.modify = function (transition, tokens) {
        tokens = parseInt(tokens);
        if (!self.exists(transition.fromState, transition.toState, tokens, transition.id)) {
            self.inputSymbolAlphabet.removeIfNotUsedFromOthers(transition);
            self.inputSymbolAlphabet.addIfNotExists(tokens);
            transition.tokens = tokens;
            $scope.simulator.reset();
            $scope.core.updateListener();
        }
    };
    
    self.tokensBiggerZero = function (tokens) {
        
        if (tokens > 0) {
            return true;
        
        } else {
            return false;
        }
    };
    
    self.checkOnlyOneTransitionObject = function (from, to) {
        var result = false;
        var tmp = false;
        
        if (self.length > 0) {
                
            _.forEach(self, function(transGroup) {

                if (transGroup[0].fromState === from && transGroup[0].toState === to) {

                    if (transGroup[0] === undefined) {
                        result = true;
                        tmp = false;

                    } else {
                        result = false;
                        tmp = true;
                    }

                } else if (!tmp) {
                    result = true;
                }
            });
        
        } else {
            return true;
        }

        return result;
    };
};
autoSim.TransitionsPN.prototype = Array.prototype;