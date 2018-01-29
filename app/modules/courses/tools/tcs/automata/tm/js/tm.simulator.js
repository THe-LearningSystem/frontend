//Simulator for the simulation of the automata
/**
 * Simulator for the simulation of the turing machine
 */
autoSim.SimulatorTM = function ($scope, $uibModal) {
    var self = this;
    autoSim.Simulator.apply(this, arguments);

    //if the simulation loops (start at the end again)
    self.loopSimulation = false;


    self.tape = new autoSim.TMTape($scope);
    self.virtualTape = new autoSim.TMTape($scope);

    self.tape.refillTape();
    self.tape.setPointer($scope.automatonData.inputWord);
    self.virtualTape.refillTape();
    self.virtualTape.setPointer($scope.automatonData.inputWord);


    //save the reference
    var parentReset = this.reset;

    /**
     *  Resets the simulation and refills the tape with blank symbols
     *  and writes the inputword back to the tape
     */
    self.reset = function () {
        self.tape.refillTape();
        self.tape.fillTape($scope.automatonData.inputWord);
        self.virtualTape.refillTape();
        self.virtualTape.fillTape($scope.automatonData.inputWord);
        self.currentSequencePosition = 0;
        self.animated = {
            currentState: null,
            transition: null,
            nextState: null,
            currentTapeItem: null
        };
        parentReset.apply(this);
    }

    /**
     * Prepares the simulation
     * Resets the simulation and fetches the sequences for the simulation
     */
    self.prepareSimulation = function () {
        self.reset();
        self.isInAnimation = true;
        self.sequences = self.getSequences($scope.automatonData.inputWord);
        console.log(self.sequences);
    };

    /**
     * Makes a step forward in simulation-sequence
     */
    self.stepForward = function () {
        if (!self.isInAnimation) {
            self.prepareSimulation();
        }
        if (!_.includes(["accepted", "notAccepted"], self.status)) {
            if (self.tape.isEmpty() && $scope.states.final.isFinalState($scope.states.startState) && $scope.transitions.length === 0) {
                self.animateEmptyWord();
            } else {
                if (self.animated.currentState === null) {
                    self.animateCurrentState();
                    self.animateCurrentTapeItem();
                } else if (self.animated.transition === null) {
                    self.animateTransition();
                    self.animateCurrentTapeItem();
                    if (self.animated.transition !== null) {
                        self.tape.writeOnTape(self.animated.transition.outputSymbol);
                        if (self.animated.transition.movingDirection === "→") {
                            self.tape.pointerGoRight();
                        } else if (self.animated.transition.movingDirection === "←") {
                            self.tape.pointerGoLeft();
                        } else {
                            self.tape.pointerStay();
                        }
                    }
                    if (self.tape.pointer > 24) {
                        self.animated.nextState = self.animated.transition.toState;
                        self.status = 'notAccepted';
                        self.pause();
                        $scope.core.openInfoModal('as.tm.error', 'as.tm.outOfBounds');
                    }
                    if (self.tape.pointer < 0 && !self.modalIsDisplayed) {
                        self.animated.nextState = self.animated.transition.toState;
                        self.status = 'notAccepted';
                        self.pause();
                        $scope.core.openInfoModal('as.tm.error', 'as.tm.outOfBounds');
                    }
                } else if (self.animated.nextState === null) {
                    self.animateNextState();
                    self.animateCurrentTapeItem();
                } else {
                    self.changeNextStateToCurrentState();
                }
            }
        }
        $scope.saveApply();
    };

    /**
     * Animates the tapeitem on which the pointer stands
     */
    self.animateCurrentTapeItem = function () {
        self.animated.currentTapeItem = self.tape.pointer;
    };


    /**
     * Changes the next state to the current state
     */
    self.changeNextStateToCurrentState = function () {
        self.currentPosition++;
        self.currentSequencePosition++;
        self.animated.currentState = self.animated.nextState;
        self.animated.nextState = null;
        self.animated.transition = null;
        if (self.isAnimationAccepted()) {
            self.status = "accepted";
            self.isInPlay = false;
        }
    };

    /**
     * tells us if the inputword is accepted
     * @return {boolean} Returns 'true' if simulation is in the last animation step of the sequence and the sequence is
     * an possible sequence
     */
    self.isAnimationAccepted = function () {
        return self.currentSequencePosition == self.sequences.sequences[0].length && self.sequences.possible;
    };

    /**
     * Goes a step back in the simulation
     */
    self.goAnimationBack = function () {
        self.status = "unknown";
        if (self.currentPosition !== 0) {
            self.currentPosition--;
            self.animated.nextState = self.animated.currentState;
            self.animated.transition = self.getLongestSequence(self.sequences.sequences)[self.currentPosition];
            if (self.animated.transition.movingDirection === "→") {
                self.tape.pointerGoLeft();
            } else if (self.animated.transition.movingDirection === "←") {
                self.tape.pointerGoRight();
            } else {
                self.tape.pointerStay();
            }
            self.tape.writeOnTape(self.animated.transition.inputSymbol);
            self.animated.currentState = self.animated.transition.fromState;
        } else {
            self.reset();
        }
    };

    /**
     * Checks if a word is accepted from the automaton
     * @return {Boolean}: Returns 'true' if the inputWord is accepted, returns 'false' if not.
     */
    self.isInputWordAccepted = function (tapeWord) {
        self.virtualTape.tapeSetup($scope.automatonData.inputWord);
        return self.getSequences(tapeWord).possible;
    };

    /**
     * Returns the sequence for the automaton with the inputword
     * @param tapeWord: word written on the tape to be edited
     * @return {Array}: array tmpObj containing the simulation steps, a variable that indicates whether the simulation is
     * complete or not and the edited output word
     */
    self.getSequences = function (tapeWord) {
        self.virtualTape.fillTape(tapeWord);
        var tape = self.virtualTape.tapeArray;
        var tmpObj = {};
        var tmpObj2 = self.getAllPossibleSequences(tape, tapeWord);
        if (self.tape.isEmpty() && $scope.states.final.isFinalState($scope.states.startState) && $scope.transitions.length === 0) {
            tmpObj.possible = true;
            tmpObj.sequences = [];
            return tmpObj;
        }

        if (tmpObj2.completeSequence === true && tmpObj2.possibleSequences.length !== 0) {
            tmpObj.possible = true;
            tmpObj.sequences = tmpObj2.possibleSequences;
            tmpObj.outputWord = tmpObj2.outputWord;
            return tmpObj;
        } else {
            tmpObj.possible = false;
            tmpObj.sequences = tmpObj2.possibleSequences;
            return tmpObj
        }
    };

    /**
     * returns all possible transition, which go from the fromState with the inputSymbol to a state
     * @param fromState: state from which you want to search
     * @param tapeSymbol: character for the next transition to be searched for
     * @returns {Array}: an array with transitions which run out from the fromState and contain the specific tapeSymbol
     * as input symbol
     */
    self.getNextTransitions = function (fromState, tapeSymbol) {
        var transitions = [];
        _.forEach($scope.transitions, function (transitionGroup) {
            _.forEach(transitionGroup, function (transition) {
                if (transition.fromState == fromState && transition.inputSymbol == tapeSymbol) {
                    transitions.push([transition]);
                }
            })
        });
        return transitions;
    };


    /**
     * Returns the possible sequence of animation steps. If there is no possible sequence the broadest sequence is
     * returned
     * @param tape: tape to be worked with
     * @param tapeWord: word for which a sequence is to be searched
     * @returns {Array}: array tmpObj which contains the possible animation steps, a variable that indicates whether
     * the sequence is complete or not and the output word
     */
    self.getAllPossibleSequences = function (tape, tapeWord) {
        var tmpObj = {};
        tmpObj.completeSequence = false;
        tmpObj.possibleSequences = [];
        var state = $scope.states.startState;
        var possibleSequence = [];

        self.virtualTape.pointer = self.virtualTape.searchPointerStart(tapeWord);
        while (self.getNextTransitions(state, self.virtualTape.tapeArray[self.virtualTape.pointer]).length !== 0) {
            var possibleTransition = self.getNextTransitions(state, self.virtualTape.tapeArray[self.virtualTape.pointer]);

            if (possibleTransition[0][0].inputSymbol === tape[self.virtualTape.pointer]) {
                self.virtualTape.writeOnTape(possibleTransition[0][0].outputSymbol);
                if (possibleTransition[0][0].movingDirection === "→") {
                    self.virtualTape.pointerGoRight();
                } else if (possibleTransition[0][0].movingDirection === "←") {
                    self.virtualTape.pointerGoLeft();
                } else {
                    self.virtualTape.pointerStay();
                }
                possibleSequence.push(possibleTransition[0][0]);
            }
            state = possibleTransition[0][0].toState;
        }
        if (possibleSequence.length > 0) {
            tmpObj.possibleSequences.push(possibleSequence);
        }
        tmpObj.outputWord = self.virtualTape.getOutputWord();
        self.virtualTape.refillTape();
        if (tmpObj.possibleSequences.length > 0 && $scope.states.final.isFinalState(state) && self.virtualTape.pointer < 25 && self.virtualTape.pointer >= 0) {
            tmpObj.completeSequence = true;
            return tmpObj;
        }
        return tmpObj;

    };
};
