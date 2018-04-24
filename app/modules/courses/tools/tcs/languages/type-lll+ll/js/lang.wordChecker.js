autoSim.LangWordChecker = function ($scope) {
    var self = this;

    self.inputAccepted = false;
    self.foundCandidate = undefined;
    self.running = false;
    
    self.maxTries = 50000;
    self.counter = 0;
    self.ruleIdCounter = 0;

    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Function, that tries to create the Wort, entered in the input field.
     * @returns {[[Type]]} [[Description]]
     */
    self.searchInputWord = function () {
        self.inputAccepted = false;
        
        var firstStep = true;
        var noSolution = false;

        if ($scope.langProductionRules.getStartRule() === undefined)
            return false;
        
        if ($scope.langProductionRules.change.errorsExist())
            return false;
                
        // Counter is only a boundary limiter, for development.
        while ((!noSolution || self.foundCandidate !== undefined) && self.counter < self.maxTries) {

            if (self.length === 0 && firstStep) {
                var startRule = $scope.langProductionRules.getStartRule();
                var checkInformation = new autoSim.LangCheckInformationObject(startRule.right, startRule.followerRuleId);

                //----- New Position Array.
                var newPositionArray = [];
                var newArray = [];
                var j = 0;

                for (var i = 0; i < startRule.right.length; i++) {
                    newPositionArray.push([0]);
                    newArray.push([self.ruleIdCounter]);
                }
                self.ruleIdCounter++;
                checkInformation.treeOrderArray = newPositionArray;
                checkInformation.position = newArray;

                //-----

                self.push(checkInformation);
                firstStep = false;

            } else {
                var nextCheck;
                var acceptedWord = undefined;

                if (self.length === 0) {
                    noSolution = true;
                    self.running = false;

                } else {
                    nextCheck = self.shift();

                    if (self.followerExisting(nextCheck.steps)) {
                        acceptedWord = self.createNextInfoObject(nextCheck);
                    }

                    if (self.checkString(nextCheck.string) || acceptedWord !== undefined) {

                        if (acceptedWord !== undefined) {
                            self.foundCandidate = acceptedWord;
                            acceptedWord.applyPositionIds();

                        } else {
                            self.foundCandidate = nextCheck;
                            nextCheck.applyPositionIds();
                        }
                        self.inputAccepted = true;

                        while (self.pop() !== undefined) {}
                        self.running = false;

                        return true;
                    }
                }
            }
        }
        self.running = false;
    };

    /**
     * Adds the values of an array to an existing one.
     * @param   {Array}    array [[Description]]
     * @param   {[[Type]]} toAdd [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.addArrayToArray = function (array, toAdd) {

        _.forEach(toAdd, function (value) {

            if (!self.checkElementExistsInArray(array, value)) {
                array.push(value);
            }
        });

        return array;
    };

    /**
     * Creates the next string and steps and saves it as an InformationObject.
     * Creates the array, which saves the level and the follower of the objects in the derivation tree.
     * @param   {object}  nCheck [[Description]]
     * @returns {boolean} [[Description]]
     */
    self.createNextInfoObject = function (nCheck) {
        var onlyOnce = true;
        var helperPosition = null;
        
        self.counter++;

        for (var position = 0; position <= nCheck.steps.length - 1; position++) {
            
            if (nCheck.steps[position].constructor === Array && onlyOnce) {
                var newInfoObject;
                onlyOnce = false;

                _.forEach(nCheck.steps[position], function (searchId) {
                    var current = $scope.langProductionRules.getByRuleId(searchId);
                    var tmpString = self.cloneString(nCheck.string);
                    var string = nCheck.string.substring(0, position) + current.right + nCheck.string.substring(position + 1, nCheck.steps.length);
                    var newArray = self.cloneArray(nCheck.steps);
                    newArray.splice(position, 1);

                    //---- New tree order array changes.

                    var posArray = self.cloneArray(nCheck.treeOrderArray);
                    var testArray = self.cloneArray(nCheck.position);
                    var counter1 = 0;
                    var counter2 = 1;
                    
                    _.forEach(current.followerRuleId, function (value) {
                        var test = false;

                        if (current.followerRuleId[counter1 + 1] !== undefined) {

                            if (current.followerRuleId[counter1 + 1].constructor === Array) {
                                test = true;
                            }
                        }
                        
                        if (current.followerRuleId.length === 1 || (counter2 === 1 && !test)) {
                            counter2 = current.followerRuleId.length;
                            posArray[position + counter1].unshift(current.id);
                            testArray[position + counter1].unshift(self.ruleIdCounter);
                            
                        } else if (test) {
                            posArray.splice(position, 0, [current.id]);
                            testArray.splice(position, 0, [self.ruleIdCounter]);

                        } else {
                            posArray.splice(position + counter1, 0, [current.id]);
                            testArray.splice(position + counter1, 0, [self.ruleIdCounter]);
                            counter2--;
                        }
                        counter1++;
                    });
                    self.ruleIdCounter++;

                    //----

                    for (var i = current.followerRuleId.length; i > 0; i--) {
                        newArray.splice(position, 0, current.followerRuleId[i - 1]);
                    }
                    newInfoObject = new autoSim.LangCheckInformationObject(string, newArray, testArray);

                    if (self.checkStringLength(newInfoObject.string) <= $scope.languageData.inputWord.length + 1) {
                        newInfoObject.appliedRules = self.cloneArray(nCheck.appliedRules);
                        newInfoObject.treeOrderArray = posArray;
                        newInfoObject.position = testArray;
                        self.push(newInfoObject);
                        newInfoObject.addAppliedRule(position, searchId);
                    }
                });

                if (newInfoObject !== undefined) {
                
                    if (self.checkString(newInfoObject.string)) {
                        self.running = false;

                        return newInfoObject;
                    }
                }
            }
        }
    };

    /**
     * Counts the values in array in an array, and returns the longest array included.
     * @param   {[[Type]]} array [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getLongestArrayCountInPosArray = function (array) {
        var result = 0;

        _.forEach(array, function (tmpArray) {
            var count = 0;

            _.forEach(tmpArray, function (value) {
                count++;
            });
            var oldCount = count;

            if (result < count) {
                result = count;
            }
        });

        return result;
    };

    /**
     * Checks, if the transmitted steps array contains follower rules.
     * @param   {[[Type]]} steps [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.followerExisting = function (steps) {
        var result = false;

        _.forEach(steps, function (value) {

            if (value !== -1) {
                result = true;
            }
        });

        return result;
    };

    /**
     * Searches the transferred production id, and returns the follower of it.
     * @param   {[[Type]]} object [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getNextStep = function (index) {

        return self.foundCandidate[index + 1];
    };

    /**
     * Clone an String, for working with copies of them.
     * @param   {[[Type]]} string [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.cloneString = function (string) {
        var tmp = "";

        _.forEach(string, function (char) {
            tmp += char;
        });

        return tmp;
    };

    /**
     * Clone the steps array, for working with copies of them.
     * @param   {object}   array [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.cloneArray = function (array) {
        var tmp = [];

        _.forEach(array, function (value) {

            if (value.constructor === Array) {
                var newValue = [];

                _.forEach(value, function (val) {
                    newValue.push(val);
                });
                tmp.push(newValue);

            } else {
                tmp.push(value);
            }
        });

        return tmp;
    };

    /**
     * Prepares the input word with the epsilon at the end.
     * @param   {[[Type]]} string [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.prepareInputWord = function (string) {

        return string + 'ε';
    };

    /**
     * Checks an array for containing a single element.
     * @param   {[[Type]]} array [[Description]]
     * @param   {[[Type]]} value [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkElementExistsInArray = function (array, value) {

        return _.includes(array, value);
    };

    /**
     * Checks, if the delivered string is equal to the input word.
     * @param {[[Type]]} infoObject [[Description]]
     */
    self.checkString = function (givenString) {
        var inputWord = $scope.languageData.inputWord;

        if ($scope.langProductionRules.grammarType === '3') {
            
            if (self.prepareInputWord($scope.languageData.inputWord) === givenString) {
                return true;
            }
        
        } else if ($scope.langProductionRules.grammarType === '2') {

            if (self.cloneString(givenString).replace(/ε/g, "") === inputWord) {
                return true;
            }
        }
    };

    /**
     * Checks the given string for terminals and returns the count of them.
     * @param   {[[Type]]} string [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkStringLength = function (string) {
        var count = 0;

        _.forEach(string, function (char) {
            
            if (char !== 'ε' && char === angular.lowercase(char))
                count++;
        });
        
        return count;
    };

    /**
     * checks, if the transmitted string, doesn't exist in no one other Object.
     * @param   {[[Type]]} string [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.stringDontExist = function (string) {
        var result = true;

        _.forEach(self, function (value) {

            if (value.string === string) {
                result = false;
            }
        });

        return result;
    };
    
    /**
     * Counts the number of values in the arrays, which are in an array.
     * @param   {[[Type]]} posArray [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.countPositionValuesArray = function (posArray) {
        var result = 0;
        
        for (var i = 0; i < posArray.length; i++) {
            var tmp = posArray[i];
            
            for (var j = 0; j < tmp.length; j++) {
                result ++;
            }
        }

        return result;
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        while (self.pop() !== undefined) {}
        
        self.inputAccepted = false;
        self.foundCandidate = undefined;
        self.counter = 0;
        self.ruleIdCounter = 0;
        
        self.searchInputWord();
    };
};
autoSim.LangWordChecker.prototype = Array.prototype;
