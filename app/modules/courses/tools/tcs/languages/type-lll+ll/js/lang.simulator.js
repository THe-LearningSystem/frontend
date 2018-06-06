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
                if (!self.simulationDone) {
                    setTimeout(self.play, self.stepTimeOut);
                    
                } else if (self.loopSimulation) {
                    self.isInAnimation = false;
                    self.isInPlay = true;
                    setTimeout(self.play, self.loopTimeOut);
                }
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
        self.animateGrammar(true);
        self.checkSimulationStatus(true);
        self.updateListenersOfSimulation();
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
        self.animateGrammar(false);
        self.checkSimulationStatus(false);
        self.updateListenersOfSimulation();
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
            currentProduction: null,
            currentTerminal: null,
            currentIsStart: null
        };
    };

    /**
     * Prepare the simulation ( set startSettings)
     */
    self.prepareSimulation = function () {
        self.reset();
        self.isInAnimation = true;
    };

    /**
     * Checks, if the simulator has reached the end or the start.
     * @param {[[Type]]} next [[Description]]
     */
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
    
    self.updateListenersOfSimulation = function () {
        $scope.langDerivationSequence.updateFunction();
        $scope.langGrammar.updateFunction();
        $scope.langDerivationtree.draw.updateFunction();
        $scope.langTransitions.updateFunction();
        $scope.saveApply();
    };

    /**
     * Updates all Tabs of the program and resets the simulation after changes of the input word.
     */
    self.updateInputWord = function () {
        $scope.langWordChecker.running = true;
        setTimeout($scope.langCore.langUpdateListener, 10);
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
        self.animated.currentDerivationTreeGroup = $scope.langDerivationtree.draw.getNextAnimationRule(self.animated.currentDerivationTreeGroup, next);
    };

    /**
     * Gets the next non terminal and terminal and saves it in the animate object.
     * @param {[[Type]]} next [[Description]]
     */
    self.animateGrammar = function (next) {
        var production;
        var id;

        if (self.isFirstStep && !self.animationStarted) {
            production = $scope.langProductionRules.getStartRule();
            self.productionIndex = -1;

        } else {
            
            if (!next) {

                if (self.productionIndex === 0) {
                    production = $scope.langProductionRules.getStartRule();
                    self.productionIndex = -1;
                
                } else {
                    id = $scope.langWordChecker.foundCandidate.appliedRules[--self.productionIndex];
                    production = $scope.langProductionRules.getByRuleId(id.ruleId);
                }
                
            } else {
                id = $scope.langWordChecker.foundCandidate.appliedRules[++self.productionIndex];
                production = $scope.langProductionRules.getByRuleId(id.ruleId);
                
            }
        }
        self.animated.currentTerminal = $scope.langGrammar.getTerminalStep();
        self.animated.currentProduction = production;
    };
};
