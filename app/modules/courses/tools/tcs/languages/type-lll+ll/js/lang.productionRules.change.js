autoSim.LangProductionRulesChange = function ($scope) {
    var self = this;

    self.beginInput = false;
    self.showStartRuleDropdown = false;
    
    // Input markers.
    self.inputLeft = false;
    self.inputRight = false;
    
    // Change markers.
    self.checkRuleLeftNotEmpty = true;
    self.checkRuleRightNotEmpty = true;
    self.checkRuleLoop = true;
    self.checkRuleLeftIsNoTerminal = true;
    self.checkRuleCharacters = true;
    
    self.errors = [];

    /**
     * Updates the rule from the available rules.
     * For checking of changes in existing rules.
     * @param {object} prod [[Description]]
     */
    self.updateRule = function (prod, pos) {
                    
        if (self.beginInput) {
            self.checkRuleLeftNotEmptyFunc(prod, pos, false);
            self.checkRuleRightNotEmptyFunc(prod, pos, false);
            self.checkRuleLoopFunc(prod, pos, false);
            self.checkRuleLeftIsNoNonTerminalFunc(prod, pos, false);
            self.checkRuleCharactersFunc(prod, pos, false);
        
        } else {
            self.beginInput = true;
            self.checkRuleLeftNotEmptyFunc(prod, pos, false);
            self.checkRuleRightNotEmptyFunc(prod, pos, false);
            self.checkRuleLoopFunc(prod, pos, false);
            self.checkRuleLeftIsNoNonTerminalFunc(prod, pos, false);
            self.checkRuleCharactersFunc(prod, pos, false);
        }
        $scope.langProductionRules.checkLanguageType();
        $scope.langSimulator.updateInputWord();
    };
    
    /**
     * Checks the input values for errors.
     * @param   {[[Type]]} left  [[Description]]
     * @param   {[[Type]]} right [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkInputRule = function (left, right) {
        var result = false;

        if (left !== undefined) {
            
            if (left === "") {
                self.inputLeft = true;
                self.checkRuleLeftNotEmpty = false;
                result = true;

             } else if (!/[A-Z]/.test(left) || left !== angular.uppercase(left)) {
                self.inputLeft = true;
                self.checkRuleLeftIsNoTerminal = false;
                result = true;

             } else {
                self.inputLeft = false;
                self.checkRuleLeftNotEmpty = true;
                self.checkRuleLeftIsNoTerminal = true;
                result = false;
             }
        
        } else {
            result = true;
        }
        
        if (right !== undefined) {
            
            if (right === "") {
                self.inputRight = true;
                self.checkRuleLeftNotEmpty = false;
                result = true;

            } else if (left === right) {
                self.inputRight = true;
                self.checkRuleLoop = false;
                result = true;

            } else if (!/^[a-zA-Z]+$/.test(right) && right !== 'ε') {
                self.inputRight = true;
                self.checkRuleCharacters = true;
                result = true;

            } else {
                self.inputRight = false;
                self.checkRuleLeftNotEmpty = true;
                self.checkRuleLoop = true;
                self.checkRuleCharacters = true;
                result = false;
            }
        
        } else {
            result = true;
        }

        return result;
    };
    
    /**
     * Checks, if the left part of a rule, is not empty.
     * @param {object}   prod [[Description]]
     * @param {[[Type]]} pos  [[Description]]
     */
    self.checkRuleLeftNotEmptyFunc = function (prod, pos, input) {
        
        if (pos === 'left' && prod.left === "") {
            self.checkRuleLeftNotEmpty = false;
            self.manageErrorData(prod.id, pos, true, 'leftEmpty');
            
        } else {
            self.checkRuleLeftNotEmpty = true;
            self.manageErrorData(prod.id, pos, false, 'leftEmpty');
        }
    };
    
    /**
     * Checks, if the right part of a rule is not empty.
     * @param {object}   prod [[Description]]
     * @param {[[Type]]} pos  [[Description]]
     */
    self.checkRuleRightNotEmptyFunc = function (prod, pos, input) {
        
        if (pos === 'right' && prod.right === "") {
            self.checkRuleRightNotEmpty = false;
            self.manageErrorData(prod.id, pos, true, 'rightEmpty');
        
        } else {
            self.checkRuleRightNotEmpty = true;
            self.manageErrorData(prod.id, pos, false, 'rightEmpty');
        }
    };

    /**
     * Checks, if the rule has no loop.
     * @param {object}   prod [[Description]]
     * @param {[[Type]]} pos  [[Description]]
     */
    self.checkRuleLoopFunc = function (prod, pos, input) {
        
        if (prod.left === prod.right) {
            self.checkRuleLoop = false;
            self.manageErrorData(prod.id, 'right', true, 'ruleLoop');
        
        } else {
            self.checkRuleLoop = true;
            self.manageErrorData(prod.id, 'right', false, 'ruleLoop');
        }
    };

    /**
     * Checks, if the left part of a rule is not a non terminal.
     * @param {object}   prod [[Description]]
     * @param {[[Type]]} pos  [[Description]]
     */
    self.checkRuleLeftIsNoNonTerminalFunc = function (prod, pos, input) {
        
        if ((!/[A-Z]/.test(prod.left) && pos === 'left') || prod.left !== angular.uppercase(prod.left)) {
            self.checkRuleLeftIsNoTerminal = false;
            self.manageErrorData(prod.id, pos, true, 'leftNoNonTerminal');
            
        } else {
            self.checkRuleLeftIsNoTerminal = true;
            self.manageErrorData(prod.id, pos, false, 'leftNoNonTerminal');
        }
    };
    
    /**
     * Checks, if the right part of a rule has only letters.
     * @param {object}   prod [[Description]]
     * @param {[[Type]]} pos  [[Description]]
     */
    self.checkRuleCharactersFunc = function (prod, pos, input) {
        
        if (pos === 'right' && !/^[a-zA-Z]+$/.test(prod.right) && prod.right !== 'ε') {
            self.checkRuleCharacters = false;
            self.manageErrorData(prod.id, pos, true, 'charactersAllowed');
            
        } else {
            self.checkRuleCharacters = true;
            self.manageErrorData(prod.id, pos, false, 'charactersAllowed');
        }
    };
    
    /**
     * Adds the epsilon to the right side of a production rule.
     * @param {[[Type]]} id   [[Description]]
     * @param {[[Type]]} edit [[Description]]
     */
    self.addEpsilonToRightSide = function (id, edit) {

        if (edit) {
            $scope.langProductionRules.getByRuleId(id).right = "ε";
            self.updateRule($scope.langProductionRules.getByRuleId(id), 'right');

        } else {
            $scope.langProductionRules.menuRight = "ε";
        }

        /* Only for inserting the epsilon to a specific position.
        var startPosition = myElement.selectionStart;
        var endPosition = myElement.selectionEnd;

        // Check if you've selected text
        if (startPosition == endPosition) {
            alert("The position of the cursor is (" + startPosition + "/" + myElement.value.length + ")");
        } else {
            alert("Selected text from (" + startPosition + " to " + endPosition + " of " + myElement.value.length + ")");
        }
        */
    };

    /**
     * Manages the error array.
     * @param {[[Type]]} id   [[Description]]
     * @param {[[Type]]} left [[Description]]
     * @param {[[Type]]} add  [[Description]]
     */
    self.manageErrorData = function (id, pos, add, type) {
        var newError = {
            'id': id,
            'position': pos,
            'type': type
        };

        if (add) {

            if (_.find(self.errors, newError) === undefined) {
                self.errors.push(newError);
            }

        } else {
            var toCheck = self.checkError(id, pos, type);
            
            if (toCheck !== -1) {
                self.errors.splice(_.indexOf(self.errors, toCheck), 1);
            }
        }
    };

    /**
     * Checks the transmitted id nd position for existance in the error array.
     * @param   {[[Type]]} id   [[Description]]
     * @param   {[[Type]]} left [[Description]]
     * @returns {[[Type]]} [[Description]]
     */
    self.checkError = function (id, pos, type) {
        var check = _.find(self.errors, {
            'id': id,
            'position': pos,
            'type': type
        });

        // --- For marking the rule editing in errors.
        if (type === undefined) {
            
            for (var i = 0; i < self.errors.length; i++) {
            
                if (self.errors[i].id === id && self.errors[i].position === pos) {
                    
                    return self.errors[i];
                }
            }
            
            return -1;
        }
        // ---
        
        if (check)
            return check;
        else
            return -1;
    };

    /**
     * Checks to show the start rule dropdown.
     */
    self.checkStartRuleDropdown = function () {

        if ($scope.langProductionRules.length > 0) {
            self.showStartRuleDropdown = true;

        } else {
            self.showStartRuleDropdown = false;
        }
    };
    
    /**
     * Checks, if there are any errors in the existing rules.
     * @returns {boolean} [[Description]]
     */
    self.errorsExist = function () {
        
        if (self.errors.length > 0)
            return true;
        else
            return false;
    };
};
