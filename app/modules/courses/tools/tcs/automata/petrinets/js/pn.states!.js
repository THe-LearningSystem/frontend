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
    

    self.createWithId = function (placeId, placeName, x, y) {
        console.log("test");
        var tokens = 0;
        var place = new autoSim.Place(placeId, placeName, tokens, x, y, true);
        self.push(place);
        $scope.core.updateListener();
        $scope.saveApply();

        return place;
    };
    
    self.changeTokenCount = function (state, newTokenCount) {
        if (angular.isNumber(newTokenCount)) {
            console.error("Tokens can only be numbers!", self.getByName(newTokenCount));
            return false;
        } else {
            state.tokens = newTokenCount;
            $scope.core.updateListener();
            return true;
        }
    };
};
autoSim.StatesPN.prototype = Array.prototype;