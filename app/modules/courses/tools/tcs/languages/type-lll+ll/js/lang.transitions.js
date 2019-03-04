autoSim.LangTransitions = function ($scope) {
    var self = this;

    self.transitionId = 0;
    self.radius = 15;

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Calls the "createWithId" method, to create a new transition.
     * @param {[[Type]]} from [[Description]]
     * @param {[[Type]]} to   [[Description]]
     */
    self.create = function () {
        var rules = $scope.langDerivationtree.draw;

        _.forEach(rules, function (value) {

            _.forEach(rules, function (value2) {

                if (value.ruleId === value2.predecessor && value !== value2 && value.level > 0) {

                    if (value.level > value2.level && !value2.predecessorExists) {
                        value2.predecessorExists = true;
                        self.createWithId(value, value2, value.ruleId);
                    
                    } else if (value2.level > value.level && !value.predecessorExists) {
                        value.predecessorExists = true;
                        self.createWithId(value2, value, value2.ruleId);
                    
                    } else if (value.level === value2.level && !value2.predecessorExists) {
                        value2.predecessorExists = true;
                        self.createWithId(value, value2, value.ruleId);
                    }
                }
            });
        });
    };
    
    /**
     * Creates a new transition.
     * @param {[[Type]]} id   [[Description]]
     * @param {[[Type]]} from [[Description]]
     * @param {[[Type]]} to   [[Description]]
     */
    self.createWithId = function (from, to, animationGroup) {
        var transition = new autoSim.LangTransitionObject(self.transitionId++, from, to, self.calculatePath(from, to), animationGroup);
        self.push(transition);
    };

    /**
     * Checks if the transition between two productions exists.
     * @param   {[[Type]]} production1 [[Description]]
     * @param   {[[Type]]} production2 [[Description]]
     * @returns {boolean}  [[Description]]
     */
    self.checkIfTransitionExists = function (production1, production2) {
        var check = false;

        _.forEach(self, function (transition) {

            if (production1 == transition.from && production2 == transition.to) {
                check = true;

            } else if (production1 == transition.to && production2 == transition.from) {
                check = true;
            }
        });
        return check;
    };

    /**
     * Calculates the path of the transition.
     * @param   {object}   from [[Description]]
     * @param   {object}   to   [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.calculatePath = function (from, to) {
        var obj = {};
        var path = d3.path();

        var pX = from.posX;
        var pY = from.posY + self.radius;
        var downLine = 11;
        
        path.moveTo(pX, pY);

        if (from.posY === to.posY) {
            
            if (from.posX > to.posX) {
                var moveX = (pX - self.radius);
                var moveY = pY - self.radius;

                var newX = moveX - $scope.langDerivationtree.grid.spaceBetweenSnappingPoint * (from.position-to.position -0.5);

                path.moveTo(moveX, moveY);
                path.lineTo(newX, moveY);
                
            } else if (from.posX < to.posX) {
                var moveX = (pX + self.radius);
                var moveY = pY - self.radius;

                var newX = moveX - $scope.langDerivationtree.grid.spaceBetweenSnappingPoint * (from.position-to.position +0.5);

                path.moveTo(moveX, moveY);
                path.lineTo(newX, moveY);
            }
            
        } else if (from.posX > to.posX) {
            var newY = pY + $scope.langDerivationtree.grid.spaceBetweenSnappingPoint * (from.level-to.level) - self.radius;
            
            path.lineTo(pX, pY + downLine);
            path.lineTo(pX - (pX-to.posX), pY + downLine);
            path.lineTo(pX - (pX-to.posX), newY - downLine);
        
        } else if (from.posX == to.posX) {
            var newY = pY + $scope.langDerivationtree.grid.spaceBetweenSnappingPoint * (from.level-to.level) - self.radius;
            
            path.lineTo(pX, newY - downLine);
            
        } else {
            var newX = (to.position - from.position) * $scope.langDerivationtree.grid.spaceBetweenSnappingPoint;
            var newY = pY + $scope.langDerivationtree.grid.spaceBetweenSnappingPoint * (from.level-to.level) - self.radius;

            path.lineTo(pX, pY + downLine);            
            path.lineTo(pX + newX, pY + downLine);
            path.lineTo(pX + newX, newY - downLine);
        }

        obj = path.toString();
        path.closePath();

        return obj;
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        while (self.pop() !== undefined) {}

        self.create();
    };
};
autoSim.LangTransitions.prototype = Array.prototype;
