autoSim.LangDerivationtreeDraw = function ($scope) {
    var self = this;

    self.orderId = 0;

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Creates the objects for the derivation tree.
     * @param {object} lastDerivationSequence [[Description]]
     * @param {object} foundCandidate         [[Description]]
     */
    self.createOrderObjects = function (lastDerivationSequence, foundCandidate) {
        var posX = $scope.langDerivationtree.grid.spaceBetweenSnappingPoint;
        var posY = $scope.langDerivationtree.grid.spaceBetweenSnappingPoint;
        var moveToX = $scope.langDerivationtree.grid.spaceBetweenSnappingPoint;
        var moveToY = $scope.langWordChecker.getLongestArrayCountInPosArray(foundCandidate.position) * $scope.langDerivationtree.grid.spaceBetweenSnappingPoint;
        var startPosition = Math.floor(foundCandidate.position.length / 2);

        var startOrderObject = new autoSim.LangDerivationtreeOrder(
            self.orderId++,
            $scope.langProductionRules.getStartRule().left,
            $scope.langWordChecker.getLongestArrayCountInPosArray(foundCandidate.position),
            startPosition * posX + moveToX,
            posY * -($scope.langWordChecker.getLongestArrayCountInPosArray(foundCandidate.position) - 1) + moveToY,
            startPosition,
            -1,
            0
        );

        self.push(startOrderObject);

        // Counts the position in each array (i).
        for (var i = $scope.langWordChecker.getLongestArrayCountInPosArray(foundCandidate.position); i >= 0; i--) {

            // Cycles through the main array with the given position (j).
            for (var j = 0; j < foundCandidate.position.length; j++) {
                var value = foundCandidate.treeOrderArray[j];
                var follower = foundCandidate.position[j];

                if (value[i] !== undefined) {
                    var tmp = i;

                    if (i === 0) {

                        for (; follower[tmp] === null;) {

                            if (follower[i] === null) {
                                tmp++;
                            }
                        }

                        if (tmp > i) {
                            var newOrderObject = new autoSim.LangDerivationtreeOrder(
                                self.orderId++,
                                lastDerivationSequence.sequence[j],
                                i,
                                posX * j + moveToX,
                                posY + moveToY,
                                j,
                                follower[tmp],
                                -1
                            );
                            self.push(newOrderObject);

                        } else {
                            var newOrderObject = new autoSim.LangDerivationtreeOrder(
                                self.orderId++,
                                lastDerivationSequence.sequence[j],
                                i,
                                posX * j + moveToX,
                                posY + moveToY,
                                j,
                                follower[i],
                                -1
                            );
                            self.push(newOrderObject);
                        }

                    } else {

                        if (value[i - 1] !== null) {
                            var char = $scope.langProductionRules.getByRuleId(value[i - 1]).left;
                            var newOrderObject = new autoSim.LangDerivationtreeOrder(
                                self.orderId++,
                                char,
                                i,
                                posX * j + moveToX,
                                -posY * (i - 1) + moveToY,
                                j,
                                follower[i],
                                follower[i - 1]
                            );
                            self.push(newOrderObject);
                        }
                    }
                }
            }
        }
    };

    /**
     * Checks the two foundCandidate arrays for right placement of rule and follower.
     * @param {object} foundCandidate [[Description]]
     */
    self.checkDerivationTree = function (foundCandidate) {
        var arrayAddDone = [];

        // Counts the position in each array (i).
        for (var i = $scope.langWordChecker.getLongestArrayCountInPosArray(foundCandidate.position); i >= 0; i--) {

            // Cycles through the main array with the given position (j).
            for (var j = 0; j < foundCandidate.position.length; j++) {
                var follower = foundCandidate.position[j];
                var value = foundCandidate.treeOrderArray[j];

                if (follower[i] !== undefined && follower[i - 1] !== undefined) {

                    // k = i.
                    for (var k = $scope.langWordChecker.getLongestArrayCountInPosArray(foundCandidate.position); k >= 0; k--) {

                        // l = j.
                        for (var l = 0; l < foundCandidate.position.length; l++) {
                            var checkFollower = foundCandidate.position[l];

                            if (checkFollower[k] === follower[i - 1]) {

                                if (i <= k && l <= j) {

                                    for (var m = 0; m < foundCandidate.position[l].length; m++) {

                                        if (follower.length - 1 < foundCandidate.position[l].length) {

                                            if (!_.includes(arrayAddDone, follower)) {
                                                follower.unshift(null);
                                                value.unshift(null);
                                            }
                                        }
                                    }
                                    arrayAddDone.push(follower);
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    /**
     * Searches through itself and returns the order object by "predecessor", with the given value.
     * @param   {[[Type]]} id [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getOrderObjectByPredecessor = function (id) {
        var rule;

        _.forEach(self, function (value) {

            if (value.predecessor === id) {
                rule = value;
            }
        });

        return rule;
    };

    /**
     * Searches through itself and returns the order object by "ruleId", with the given value.
     * @param   {[[Type]]} id [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getOrderObjectByRuleId = function (id) {
        var rule;

        _.forEach(self, function (value) {

            if (value.ruleId === id) {
                rule = value;
            }
        });

        return rule;
    };

    /**
     * Searches the transferred derivationtree group, and returns the follower group of it.
     * @param   {[[Type]]} object [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getNextAnimationRule = function (groupId, next) {
        var value = 1;
        var idArray = $scope.langWordChecker.foundCandidate.positionValues;

        if (groupId === null) {
            return idArray[0];
        }

        if (!next) {
            value = -1;
        }

        for (var i = 0; i < idArray.length; i++) {

            if (idArray[i + value] === undefined && i > 0) {
                return -1;
            }

            if (idArray[i] === groupId && idArray[i + value] !== groupId) {

                return idArray[i + value];
            }
        }
    };

    /**
     * Returns the rule with the given id.
     * @param nonTerminalId
     * @returns {object} Returns the objectReference of the production undefined if not found
     */
    self.getById = function (id) {

        return self[self.getIndexById(id)];
    };

    /**
     * Get the array position of the given rule.
     * @param   {[[Type]]} nonTerminalId [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getIndexById = function (id) {
        return _.findIndex(self, function (value) {
            if (value.id === id) {

                return value;
            }
        });
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        while (self.pop() !== undefined) { }

        if ($scope.langWordChecker.foundCandidate !== undefined) {
            self.checkDerivationTree($scope.langWordChecker.foundCandidate);

            self.createOrderObjects($scope.langDerivationSequence[$scope.langDerivationSequence.length - 1], $scope.langWordChecker.foundCandidate);

            //self.calculateTreeWidth(self[0]);
            //self.createPositions(self[0], 0, 0);
        }
    };
};
autoSim.LangDerivationtreeDraw.prototype = Array.prototype;
