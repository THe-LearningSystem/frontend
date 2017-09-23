/**
 * Constructor for the transitionGroup
 * @param fromState: state from which the transition run out
 * @param toState: state to which the transitions go
 * @constructor
 */
autoSim.TransitionGroupTM = function (fromState, toState) {
    var self = this;
    autoSim.TransitionGroup.apply(this, arguments);

    /**
     * Creates a transition with the given values
     * @param id: id of the transition
     * @param inputSymbol: input symbol of the transition
     * @param outputSymbol: output symbol which will be written on the tape
     * @param movingDirection: moving direction for the writing-reading-head
     * @returns {*}
     */
    self.create = function (id, inputSymbol, outputSymbol, movingDirection) {
        return self[self.push(new autoSim.TransitionObjectTM(id, self.fromState, self.toState, inputSymbol, outputSymbol, movingDirection)) - 1];
    };
};
autoSim.TransitionGroupTM.prototype = Array.prototype;

/**
 * The transition object for a single transition
 * @param id
 * @param fromState
 * @param toState
 * @param inputSymbol
 * @param outputSymbol
 * @param movingDirection
 */
autoSim.TransitionObjectTM = function (id, fromState, toState, inputSymbol, outputSymbol, movingDirection) {
    var self = this;
    self.id = id;
    self.fromState = fromState;
    self.toState = toState;
    self.inputSymbol = inputSymbol;
    self.outputSymbol = outputSymbol;
    self.movingDirection = movingDirection;
};

/**
 * Constructor for the transition alphabet. It contains all symbols which are used for the transitions
 * It is used as Array for the tape alphabet and the transition alphabet
 * @param $scope
 * @constructor
 */
autoSim.TransitionAlphabet = function ($scope) {
    var self = this;

    /**
     * Adds a new input symbol, provided it is not yet used
     * @param newInputSymbol
     * @returns {boolean}
     */
    self.addIfNotExists = function (newInputSymbol) {
        if (!_.some(self, function (savedInputSymbol) {
                return savedInputSymbol === newInputSymbol;
            })) {
            self.push(newInputSymbol);
            return true;
        }
        return false;
    };

    /**
     * Removes a char from the alphabet if this char is only used from the given transition
     * @param  transition
     * @return {boolean} Returns 'true' if it was removed, 'false' if not removed
     */
    self.removeIfNotUsedFromOthers = function (transition) {
        for (var i = 0; i < $scope.transitions.length; i++) {
            var notFound = true;
            _.forEach($scope.transitions, function (transitionGroup) {
                _.forEach(transitionGroup, function (tmpTransition) {
                    if (tmpTransition.inputSymbol === transition.inputSymbol && tmpTransition.id !== transition.id) {
                        notFound = false;
                    }
                });
            });
            if (notFound) {
                _.pull(self, transition.inputSymbol);
                return true;
            }
        }
    };

    /**
     * Exports the transition input alphabet
     * @return {Array}: array with the transition input alphabet
     */
    self.export = function () {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function (inputSymbol) {
            exportData.array.push(inputSymbol);
        });
        return exportData;
    };

    /**
     * Imports the data
     * @param importData: Must be an array of characters
     */
    self.import = function (importData) {
        self.clear();
        _.forEach(importData.array, function (inputSymbol) {
            self.addIfNotExists(inputSymbol);
        });
    };

    /**
     * Deletes all characters in the array
     */
    self.clear = function () {
        _.forEach(self, function () {
            self.pop();
        });
    };
};
autoSim.TransitionAlphabet.prototype = Array.prototype;

/**
 * Constructor for a transitionInputAlphabet for the turing machine. It is used as array for the symbols of the inputword
 * @param $scope
 * @constructor
 */
autoSim.TransitionInputAlphabetTM = function ($scope) {
    var self = this;
    $scope.core.updateListeners.push(self);

    /**
     * Adds the newInputSymbol to the input alphabet if the char does not already exist
     * @param newInputWord: Character to be inserted
     */
    self.addIfNotExists = function (newInputWord) {
        for (var i = 0; i < newInputWord.length; i++) {
            if (!_.some(self, function (savedInputSymbol) {
                    return savedInputSymbol === newInputWord[i];
                })) {
                self.push(newInputWord[i]);
                return true;
            }
        }
    };

    /**
     * Removes a character from the inputSymbolAlphabet if the character is not used in the inputWord
     * @param  inputWord
     */
    self.removeIfNotUsed = function (inputWord) {
        for (var i = 0; i < $scope.transitions.inputSymbolAlphabet.length; i++) {
            tmpObj = false;
            for (var j = 0; j < inputWord.length; j++) {
                if (inputWord[j] === $scope.transitions.inputSymbolAlphabet[i]) {
                    tmpObj = true;
                }
            }
            if (tmpObj === false) {
                _.pull(self, $scope.transitions.inputSymbolAlphabet[i]);
            }
        }
    };

    /**
     * exports the transitionInputAlphabet
     * @returns {object}
     */
    self.export = function () {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function (inputWordSymbol) {
            exportData.array.push(inputWordSymbol);
        });
        return exportData;
    };

    /**
     * Imports the data of the inputSymbolAlphabet
     * @param importData
     */
    self.import = function (importData) {
        self.clear();
        _.forEach(importData.array, function (inputWordSymbol) {
            self.addIfNotExists(inputWordSymbol);
        });
    };

    /**
     * Clears the InputAlphabet
     */
    self.clear = function () {
        _.forEach(self, function () {
            self.pop();
        });
    };

    /**
     * Function which updates the array
     */
    self.updateFunction = function () {
        //prepare alphabet
        self.addIfNotExists($scope.automatonData.inputWord);
        self.removeIfNotUsed($scope.automatonData.inputWord);
    };

    /**
     * Watcher, who looks out for changes of the input word
     *
     * Watcher fires two times. Why?
     * TODO: Fix!
     */
    $scope.$watch('automatonData.inputWord', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
};

autoSim.TransitionInputAlphabetTM.prototype = Array.prototype;

/**
 * Constructor for the tape alphabet
 * @param $scope
 * @constructor
 */
autoSim.TransitionTapeAlphabet = function ($scope) {
    var self = this;
    self.blankSymbol = "☐";
    self.push(self.blankSymbol);

    /**
     * Adds the newTapeSymbol to the tape alphabet if the char does not already exists
     * @param newTapeSymbol
     */
    self.addIfNotExists = function (newTapeSymbol) {
        if (newTapeSymbol !== 'undefined' && newTapeSymbol !== null) {
            for (var i = 0; i < newTapeSymbol.length; i++) {
                if (!_.some(self, function (savedTapeSymbol) {
                        return savedTapeSymbol === newTapeSymbol[i];
                    })) {
                    self.push(newTapeSymbol[i]);
                }
            }
        }
    };

    /**
     * Removes a char from the alphabet if this char is only used from the given transition and if it isn't the blank
     * symbol
     * @param transition: a transition to be deleted
     * @returns {boolean} Returns 'false' if character was not removed
     */
    self.removeIfNotUsedFromOthers = function (transition) {
        var notFound = true;
        var notFound2 = true;
        if (transition.outputSymbol !== '☐') {
            _.forEach($scope.transitions, function (transitionGroup) {
                _.forEach(transitionGroup, function (tmpTransition) {
                    notFound2 = true;
                    if (transition.id !== tmpTransition.id && (transition.outputSymbol === tmpTransition.outputSymbol || transition.outputSymbol === tmpTransition.inputSymbol)) {
                        notFound2 = false;
                        console.log(notFound2);
                        return false;
                    }
                });
                if (notFound2 === false) {
                    return false;
                }
            });
        } else {
            notFound2 = false;
        }
        if (transition.inputSymbol !== '☐') {
            _.forEach($scope.transitions, function (transitionGroup) {
                _.forEach(transitionGroup, function (tmpTransition) {
                    if (transition.id !== tmpTransition.id && (transition.inputSymbol === tmpTransition.inputSymbol || transition.inputSymbol === tmpTransition.outputSymbol)) {
                        notFound = false;
                        return false;
                    }
                });
                if (notFound === false) {
                    return false;
                }
            });
        } else {
            notFound = false;
        }
        if (notFound) {
            _.pull(self, transition.inputSymbol);
        }
        if (notFound2) {
            console.log(notFound2);
            _.pull(self, transition.outputSymbol);
        }
    };

    /**
     * Removes a char from the alphabet when it is not used
     * @param  transition
     * @returns {boolean} true if it was removed
     * @returns {boolean} false if not removed
     */
    self.removeIfNotUsed = function (char) {
        for (var i = 1; i < self.length; i++) {
            var found = false;
            var found2 = false;
            var found3 = false;
            //Search in transitionAlphabet for char
            for (var j = 0; j < $scope.transitions.transitionAlphabet.length; j++) {
                if ($scope.transitions.transitionAlphabet[j] === self[i]) {
                    found = true;
                }
            }
            //Search in inputWord for char
            for (var k = 0; k < $scope.automatonData.inputWord.length; k++) {
                if (self[i] === $scope.automatonData.inputWord[k]) {
                    found2 = true;
                }
            }
            //Search in transitions and outputSymbols for inputCharacter
            _.forEach($scope.transitions, function (transitionGroup) {
                _.forEach(transitionGroup, function (tmpTransition) {
                    if (tmpTransition.outputSymbol === self[i]) {
                        found3 = true;
                    }
                });
            });
            if (found === false && found2 === false && found3 === false) {
                _.pull(self, self[i]);
            }
        }
    };

    /**
     * exports the transitionInputAlphabet
     * @returns {object}
     */
    self.export = function () {
        var exportData = {};
        exportData.array = [];
        _.forEach(self, function (tapeSymbol) {
            exportData.array.push(tapeSymbol);
        });
        return exportData;
    };

    /**
     * Imports the data
     * @param importData
     */
    self.import = function (importData) {
        self.clear();
        _.forEach(importData.array, function (tapeSymbol) {
            self.addIfNotExists(tapeSymbol);
        });
    };

    /**
     * Clears the InputAlphabet
     */
    self.clear = function () {
        _.forEach(self, function () {
            self.pop();
        });
    };

    self.updateFunction = function () {
        //prepare alphabet
        self.addIfNotExists($scope.automatonData.inputWord);
        self.removeIfNotUsed($scope.automatonData.inputWord);
    };

    /**
     * Watcher who looks out for changes of the input word
     *
     * Watcher fires twice. Why?
     * TODO: Fix!
     */
    $scope.$watch('automatonData.inputWord', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });
};
autoSim.TransitionTapeAlphabet.prototype = Array.prototype;


/**
 * Constructor for the tape of the turing machine
 * @param $scope
 */
autoSim.TMTape = function ($scope) {
    var self = this;
    self.blankSymbol = "☐";
    self.tapeSize = 25;
    self.numOfChar = 0;
    var tapeArray = new Array();
    self.tapeArray = tapeArray;
    self.pointer = (Math.round(self.tapeArray.length / 2) - 1);
    self.pointerStartRight = false;


    /**
     * Sets the pointer on the starting character of the input word
     * @param inputWord: inputWord which was written on the tape
     */
    self.setPointer = function (inputWord) {
        var x = inputWord.length;
        var y = inputWord.length;

        if (x % 2 === 0 && x !== 0) {
            x = x - 1;
        }

        if (y !== 0) {
            y = y - 1;
        }

        if (self.pointerStartRight === false) {
            self.pointer = (Math.round(self.tapeArray.length / 2) - Math.floor(x / 2) - 1);
        } else {
            self.pointer = (Math.round(self.tapeArray.length / 2) - Math.floor(x / 2) - 1) + y;
        }
    };

    /**
     * Searches the starting character of the input word on the tape
     * @param inputWord: input word which was written on the tape
     * @returns {number}: position of the first character of the input word on the tape
     */
    self.searchPointerStart = function (inputWord) {
        var i = 0;
        if (self.isEmpty()) {
            i = (Math.round(self.tapeArray.length / 2) - 1);
            return i;
        }
        while (tapeArray[i] === '☐') {
            i++
        }
        if (self.pointerStartRight === true) {
            i = i + inputWord.length - 1;
        }
        return i;
    };

    /**
     * Writes the input word on the tape
     * @param inputWord: Word to be written on the tape
     */
    self.fillTape = function (inputWord) {
        var j = 0;
        self.numOfChar = 0;
        for (var i = (Math.round((self.tapeArray.length - inputWord.length) / 2)); i < (Math.round((self.tapeArray.length - inputWord.length) / 2) + inputWord.length); i++) {
            self.tapeArray[i] = inputWord[j];
            self.numOfChar++;
            j++;
        }
        self.setPointer(inputWord);
    };

    /**
     * Refills the tape with blank symbols
     */
    self.refillTape = function () {
        var n = 0;
        while (n < self.tapeSize) {
            self.tapeArray[n] = "☐";
            n++;
        }
    };

    /**
     * sets the tape up with blank symbols and the input word
     * @param inputWord: Word to be written on the tape
     */
    self.tapeSetup = function (inputWord) {
        self.refillTape();
        self.fillTape(inputWord);
    };

    /**
     * Writes an character in the tape array at the current pointer position
     * @param outputSymbol: Character to be written on the tape at the current pointer position
     */
    self.writeOnTape = function (outputSymbol) {
        self.tapeArray[self.pointer] = outputSymbol;
    };

    /**
     * Pointer moves one step left
     */
    self.pointerGoLeft = function () {
        self.pointer--;
    };

    /**
     * Pointer moves one step right
     */
    self.pointerGoRight = function () {
        self.pointer++;
    };

    /**
     * Pointer doesn't move
     */
    self.pointerStay = function () {
        self.pointer = self.pointer;
    };

    /**
     * Updates the tape. Tape is filled with blank symbols and the input word is written on it
     */
    self.updateFunction = function () {
        self.refillTape();
        self.fillTape($scope.automatonData.inputWord);
    };

    /**
     * Checks if the tape is empty
     * @returns {boolean} Returns 'true' if array is empty, except blank symbols, and 'false' if it is not
     */
    self.isEmpty = function () {
        for (var i = 0; i < tapeArray.length; i++) {
            if (tapeArray[i] !== "☐") {
                return false;
            }
        }
        return true;
    }

    /**
     * Creates an empty tape. Its an array full of blank symbols
     * @returns {Array} Array emptyTape
     */
    self.emptyTape = function () {
        var emptyTape = [self.tapeSize];
        for (var i = 0; i < self.tapeSize; i++) {
            emptyTape[i] = "☐";
            i++;
        }
        return emptyTape;
    };

    /**
     * Extracts the output word from the edited tape
     * @returns {string} output word
     */
    self.getOutputWord = function () {
        var outputWord = '';
        for (var i = 0; i < self.tapeArray.length; i++) {
            if (self.tapeArray[i] !== '☐') {
                outputWord += self.tapeArray[i];
            }
        }
        return outputWord;
    };

    /**
     * Watcher who looks out for changes of the input word and the switch which indicates if the pointer should start
     * right or left
     *
     * Watcher fires twice. Why?
     * TODO: Fix!
     */
    $scope.$watch('automatonData.inputWord', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.updateFunction();
        }
    });

    $scope.$watch('simulator.tape.pointerStartRight', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.setPointer($scope.automatonData.inputWord);
            $scope.simulator.virtualTape.pointerStartRight = $scope.simulator.tape.pointerStartRight;
            $scope.simulator.virtualTape.setPointer($scope.automatonData.inputWord);
        }
    });
};
