autoSim.LangDerivationSequence = function ($scope) {
    var self = this;

    self.derivationSequenceId = 0;
    
    $scope.langCore.langUpdateListeners.push(self);

    /**
     * Searches the transferred derivationSequence, and returns the follower of it.
     * @param   {[[Type]]} object [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getAnimationStep = function (sequence, next) {
        var value = 1;

        if (!next) {
            value = -1;
        }

        for (var i = 0; i < self.length; i++) {

            if (self[i].sequence === sequence) {

                return self[i + value];
            }
        }
    };
    
    /**
     * Searches trough the derivation sequences and returns the follower of the transmitted sequence.
     * @param   {[[Type]]} sequence [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.getNextDerivationSequence = function (sequence) {
        var result = -1;
        
        for (var i = 0; i <= self.length; i++) {
            
            if (sequence == self[i]) {
                result = self[i+1];
            }
        }
        
        return result;
    };

    /**
     * Needs adjustment to the index store method.
     * Creates the sequences of the derivation sequence.
     */
    self.createSequence = function () {

        if ($scope.langWordChecker.inputAccepted || $scope.langProductionRules.change.errors === 0) {
            var newFirstDerivationSequence = new autoSim.LangDerivationSequenceObject(self.derivationSequenceId++, $scope.langProductionRules.getStartRule().right);
            self.push(newFirstDerivationSequence);

            _.forEach($scope.langWordChecker.foundCandidate.appliedRules, function (object) {
                var currentRule = $scope.langProductionRules.getByRuleId(object.ruleId);
                var lastString = self[self.length - 1].sequence;
                var string = _.replace(lastString, currentRule.left, currentRule.right);
                var newDerivationSequence = new autoSim.LangDerivationSequenceObject(self.derivationSequenceId++, string);
                self.push(newDerivationSequence);
            });
        }
    };

    // Called by the listener in the core.
    self.updateFunction = function () {
        while (self.pop() !== undefined) {}

        self.createSequence();
    };
};
autoSim.LangDerivationSequence.prototype = Array.prototype;
