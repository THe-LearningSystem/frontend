autoSim.LangProductionRules = function ($scope) {
    var self = this;

    self.productionId = 0;
    self.grammarType = null;

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Calls the createWithId function, with ascending productionId.
     * @param {[[Type]]} left  [[Description]]
     * @param {[[Type]]} right [[Description]]
     */
    self.create = function (left, right) {
        self.menuRight = undefined;
        self.menuLeft = undefined;

        return self.createWithId(self.productionId++, left, right);
    };

    /**
     * Creates the production and adds it to itself.
     * @param {[[Type]]} id    [[Description]]
     * @param {[[Type]]} left  [[Description]]
     * @param {[[Type]]} right [[Description]]
     */
    self.createWithId = function (id, left, right) {
        var production = new autoSim.LangProductionRuleObject(id, left, right);
        self.push(production);

        self.updateFollowerRules();
        self.checkLanguageType();
        $scope.langCore.langUpdateListener();

        return production;
    };

    /**
     * Deletes the given production rules and calls the other tab methods.
     * @param {[[Type]]} prId [[Description]]
     */
    self.removeWithId = function (prId) {

        if (self.getByRuleId(prId) == self.getStartRule()) {
            self.changeStart(-1);
        }

        self.splice(self.getIndexByRuleId(prId), 1);
        self.checkLanguageType();
        $scope.langCore.langUpdateListener();
    };

    /**
     * Set's the follower of each production rule.
     */
    self.updateFollowerRules = function () {

        _.forEach(self, function (tmp) {

            _.forEach(tmp.right, function (char) {

                if (char === angular.lowercase(char)) {
                    tmp.followerRuleId.push(-1);

                } else {
                    //Create the new follower array, which is filled in the complete array.
                    var followerInsert = [];

                    _.forEach(self, function (production) {

                        if (char === production.left) {
                            followerInsert.push(production.id);
                        }
                    });
                    tmp.followerRuleId.push(followerInsert);
                }
            });
        });
    };
    
    /**
     * Counts the Follower of an Rule, and returns the count.
     * @param   {[[Type]]} followerArray [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.countFollowers = function (followerArray) {
        var result = 0;
        
        _.forEach(followerArray, function (value) {
            result++;
        });
        
        return result;
    };

    /**
     * Check the array for an existing value and returns true, if this value exist's.
     * @param   {[[Type]]} followerArray [[Description]]
     * @param   {[[Type]]} toCheck         [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkIfValueExists = function (array, toCheck) {
        var check = false;

        _.forEach(array, function (value) {

            if (value == toCheck) {
                check = true;
            }
        });

        return check;
    };
    
    /**
     * Checks the rules for type 3 or 2.
     */
    self.checkLanguageType = function () {
        var ruleCount = self.length;
        var loopCounter = 0;
        
        _.forEach(self, function (value) {
            if (value.right.length === 2 && value.right !== 'ε' && value.right[0] === angular.lowercase(value.right[0]) && value.right[1] === angular.uppercase(value.right[1]) && value.right[2] === undefined) {
                loopCounter++;
            
            } else if (value.right === 'ε') {
                ruleCount--;
            }
        });
        
        if (ruleCount === loopCounter)
            self.grammarType = '3';
        else
            self.grammarType = '2';
    };

    /**
     * Returns the start rule.
     * @param   {[[Type]]} left [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getStartRule = function () {
        var result;

        _.forEach(self, function (value) {

            if (value.isStart) {
                result = value;
            }
        });

        return result;
    };

    /**
     * Returns the rule with the given id.
     * @param nonTerminalId
     * @returns {object} Returns the objectReference of the production undefined if not found
     */
    self.getByRuleId = function (ruleId) {

        return self[self.getIndexByRuleId(ruleId)];
    };

    /**
     * Get the array position of the given rule.
     * @param   {[[Type]]} nonTerminalId [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getIndexByRuleId = function (ruleId) {

        return _.findIndex(self, function (value) {
            if (value.id === ruleId) {

                return value;
            }
        });
    };

    /**
     * Searches and returns the follower array of the given rule id.
     * @param   {[[Type]]} id [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getFollowerRuleIds = function (id) {
        var result = [-1];

        _.forEach(self, function (value) {

            if (value.id == id) {
                result = value.followerRuleId;
            }
        });

        return result;
    };

    /**
     * Changes the start values of the production rules.
     * @param {[[Type]]} left [[Description]]
     */
    self.changeStart = function (rule) {

        _.forEach(self, function (value) {

            if (value.isStart === true) {
                value.isStart = false;
            }

            if (rule.id == value.id) {
                value.isStart = true;
            }
        });
        $scope.langCore.langUpdateListener();
    };

    // Called by the listener in the core.
    self.updateFunction = function () {

        _.forEach(self, function (value) {
            while (value.followerRuleId.pop() !== undefined) {}
        });

        self.updateFollowerRules();
        
        $scope.langProductionRules.change.checkStartRuleDropdown();
    };

};
autoSim.LangProductionRules.prototype = Array.prototype;
