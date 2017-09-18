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
        var rule = $scope.langDerivationtree.draw;
        var animationGroup = 0;

        _.forEach(rule, function (value) {

            _.forEach(value.follower, function (id) {
                var value2 = $scope.langDerivationtree.draw.getById(id);
                self.createWithId(self.transitionId++, value, value2, animationGroup);
            });
            animationGroup++;
        });
    };

    /**
     * Creates a new transition.
     * @param {[[Type]]} id   [[Description]]
     * @param {[[Type]]} from [[Description]]
     * @param {[[Type]]} to   [[Description]]
     */
    self.createWithId = function (id, from, to, animationGroup) {
        var transition = new autoSim.LangTransitionObject(id, from, to, self.calculatePath(from, to), animationGroup);
        self.push(transition);
    };

    /**
     * Searches the transferred transition group, and returns the follower group of it.
     * @param   {[[Type]]} transitionGroup [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getTransitionGroup = function (transitionGroup, next) {
        var value = 1;

        if (!next) {
            value = -1;
        }

        for (var i = 0; i < self.length; i++) {

            if (self[i].animationGroup === transitionGroup && self[i + value].animationGroup !== transitionGroup) {

                return self[i + value].animationGroup;
            }
        }
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
        var obj2 = {};
        var path2 = d3.path();

        var pX = from.posX;
        var pY = from.posY + self.radius;
        var downLine = 11;

        if (from.posX > to.posX) {
            path2.moveTo(pX, pY);
            path2.lineTo(pX, pY + downLine);
            path2.lineTo(pX - 50, pY + downLine);
            path2.lineTo(pX - 50, pY + downLine + downLine);
        }

        if (from.posX < to.posX) {
            path2.moveTo(pX, pY + downLine);
            path2.lineTo(pX + 50, pY + downLine);
            path2.lineTo(pX + 50, pY + downLine + downLine);
        }
        
        // For more than 2 follower.
        if (from.posX === to.posX) {
            
        }

        obj2 = path2.toString();
        path2.closePath();

        return obj2;
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        while (self.pop() !== undefined) {}

        self.create();
    };
};
autoSim.LangTransitions.prototype = Array.prototype;
