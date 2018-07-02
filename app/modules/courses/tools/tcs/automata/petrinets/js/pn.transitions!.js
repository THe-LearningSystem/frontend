autoSim.TransitionsPN = function ($scope) {
    var self = this;
    
    autoSim.PlacesPN.apply(this, arguments);
    
    self.statePrefix = 'T';

    /**
     * Creates a Transition at the end of the Transitions array with a variable id
     * !!!don't use at other places!!!!
     * @param transId
     * @param transName
     * @param x
     * @param y
     * @returns {object} the created object
     */
    self.createWithId = function (transId, transName, x, y) {
        var trans = new autoSim.TransitionPN(transId, transName, x, y);
        self.push(trans);
        $scope.core.updateListener();
        $scope.saveApply();

        console.log(self);
        return trans;
    };
};
autoSim.TransitionsPN.prototype = Array.prototype;