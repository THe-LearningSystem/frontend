//Simulator for the simulation of the automata
autoSim.LangSimulator = function ($scope) {
    "use strict";
    var self = this;

    //if the simulation loops (start at the end again)
    self.loopSimulation = true;
    //time between the steps
    self.stepTimeOut = 500;
    //Time between loops when the animation restarts
    self.loopTimeOut = 500;

    // Not in reset.
    self.isInPlay = false;
    self.simulationPaused = false;

    self.isInAnimation = false;
    self.simulationDone = false;
    self.startReached = true;
    self.isFirstStep = true;
    self.animationStarted = false;

    /**
     * Changes the icon and the state to play or pause.
     */
    self.playOrPause = function () {
        self.isInPlay = !self.isInPlay;

        if (self.isInPlay) {
            self.simulationPaused = false;
            self.play();

        } else {
            self.pause();
        }
    };

    /**
     * Pause the animation.
     */
    self.pause = function () {
        if (!self.simulationPaused) {
            self.simulationPaused = true;
            self.isInPlay = false;
        }
    };

    /**
     * Play the simulation.
     */
    self.play = function () {
        //if the simulation is paused then return
        if (!self.simulationPaused) {
            //start and prepare for the play
            if (!self.isInAnimation) {
                self.prepareSimulation();
                setTimeout(self.play, self.stepTimeOut);
            } else {
                self.nextStep();
                if (!self.simulationDone)
                    setTimeout(self.play, self.stepTimeOut);
            }
        }
    };

    /**
     * stop the animation
     */
    self.stop = function () {
        self.pause();
        self.reset();
    };

    /**
     * This wrapper function is for the button.
     */
    self.nextStepWrapper = function () {
        if (self.isInPlay)
            self.pause();
        self.nextStep();
    };

    /**
     * Calls all methods for calculating the next animation step.
     */
    self.nextStep = function () {

        if (!self.isInAnimation) {
            self.prepareSimulation();
        }
        self.checkAnimation();
        self.getDerivationSequenceStep(true);
        self.getDerivationTreeStep(true);
        self.getTransitionStep(true);
        self.animateGrammar(true);
        self.checkSimulationStatus(true);
        $scope.langCore.langUpdateListener();
    };

    /**
     * This wrapper function is for the button
     */
    self.previousStepWrapper = function () {
        if (self.isInPlay)
            self.pause();
        self.previousStep();
    };

    /**
     * Calls all methods for calculating the previous animation step.
     */
    self.previousStep = function () {

        if (!self.isInAnimation) {
            self.prepareSimulation();
        }
        self.checkAnimation();
        self.getDerivationSequenceStep(false);
        self.getDerivationTreeStep(false);
        self.getTransitionStep(false);
        self.animateGrammar(false);
        self.checkSimulationStatus(false);
        $scope.langCore.langUpdateListener();
    };

    /**
     * Resets the simulator and all variables.
     */
    self.reset = function () {
        self.isInAnimation = false;
        self.isFirstStep = true;
        self.animationStarted = false;
        self.simulationDone = false;
        self.startReached = true;
        self.animated = {
            currentDerivationSequence: null,
            currentDerivationTreeGroup: null,
            currentDerivationTreeChar: null,
            currentTransition: null,
            currentProduction: null,
            currentTerminal: null
        };
    };

    /**
     * Prepare the simulation ( set startSettings)
     */
    self.prepareSimulation = function () {
        self.reset();
        self.isInAnimation = true;
    };

    self.checkSimulationStatus = function (next) {
        self.isFirstStep = false;
        self.simulationDone = false;

        if ($scope.langDerivationSequence.getAnimationStep(self.animated.currentDerivationSequence, next) === undefined) {

            if (next) {
                self.simulationDone = true;
                self.isInPlay = false;

            } else {
                self.startReached = true;
                self.isFirstStep = true;
            }
        }
    };

    /**
     * Updates all Tabs of the program and resets the simulation after changes of the input word.
     */
    self.updateInputWord = function () {
        $scope.langCore.langUpdateListener();
        self.reset();
    };

    /**
     * Checks, if the animtion of the language has started.
     */
    self.checkAnimation = function () {

        _.forEach(self.animated, function (value) {

            if (value !== null) {
                self.animationStarted = true;
            }
        });
    };

    /**
     * Gets the next derivationsequence and saves it in the animate object.
     * @param {[[Type]]} next [[Description]]
     */
    self.getDerivationSequenceStep = function (next) {
        var derivationSequence = null;

        if (self.isFirstStep && !self.animationStarted) {
            derivationSequence = $scope.langDerivationSequence[0].sequence;

        } else {

            if (self.startReached) {
                self.startReached = false;
            }
            derivationSequence = $scope.langDerivationSequence.getAnimationStep(self.animated.currentDerivationSequence, next).sequence;
        }
        self.animated.currentDerivationSequence = derivationSequence;
    };

    /**
     * Gets the next derivationtree group and saves it in the animate object.
     * @param {[[Type]]} next [[Description]]
     */
    self.getDerivationTreeStep = function (next) {
        var derivationTree = null;

        if (self.isFirstStep && !self.animationStarted) {
            derivationTree = $scope.langDerivationtree.draw[0].animationGroup;

        } else {
            derivationTree = $scope.langDerivationtree.draw.getAnimationGroup(self.animated.currentDerivationTreeGroup, next);
        }
        self.animated.currentDerivationTreeGroup = derivationTree;
        var nextNonTerminal = $scope.langDerivationtree.draw.getAnimationGroup(derivationTree, true);

        _.forEach($scope.langDerivationtree.draw, function (value) {

            if (nextNonTerminal === value.animationGroup) {

                if (value.char === angular.uppercase(value.char)) {
                    self.animated.currentDerivationTreeChar = value.char;
                }
            }
        });
    };

    /**
     * Gets the next transition group and saves it in the animate object.
     * @param {[[Type]]} next [[Description]]
     */
    self.getTransitionStep = function (next) {
        var transitionGroup = null;

        if (self.isFirstStep && !self.animationStarted) {
            transitionGroup = $scope.langTransitions[0].animationGroup;

        } else {
            transitionGroup = $scope.langTransitions.getTransitionGroup(self.animated.currentTransition, next);
        }
        self.animated.currentTransition = transitionGroup;
    };

    /**
     * Gets the next non terminal and terminal and saves it in the animate object.
     * @param {[[Type]]} next [[Description]]
     */
    self.animateGrammar = function (next) {
        var production = null;

        if (self.isFirstStep && !self.animationStarted) {
            self.productionIndex = 0;

        } else {

            if (next) {
                self.productionIndex++;

            } else {
                self.productionIndex--;
            }
        }
        production = $scope.langProductionRules.getByRuleId($scope.langWordChecker.foundCandidate.steps[self.productionIndex]);
        self.animated.currentTerminal = $scope.langGrammar.getTerminalStep();
        self.animated.currentProduction = production;
    };
};
