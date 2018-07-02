//2TESTDATA
function TestData($scope) {
    "use strict";
    var self = this;

    self.testDFA = function () {
        var state1 = $scope.states.createWithPresets(100, 100);
        var state2 = $scope.states.createWithPresets(100, 300);
        var state3 = $scope.states.createWithPresets(300, 300);
        var state4 = $scope.states.createWithPresets(300, 100);
        $scope.states.final.create(state3);
        $scope.states.final.create(state4);

        $scope.transitions.create(state1, state2, "a");
        $scope.transitions.create(state1, state2, "b");
        $scope.transitions.create(state1, state2, "c");
        $scope.transitions.create(state2, state3, "b");
        $scope.transitions.create(state3, state4, "c");
        $scope.transitions.create(state4, state1, "l");
        $scope.transitions.create(state1, state3, "l");

        $scope.automatonData.inputWord = "abc";
        $scope.automatonData.acceptedInputRaw = "abc\nab\nl\nbb";

    };

    /**
     * test automaton for the turing machine
     */
    self.testTM1 = function () {
        $scope.core.resetAutomaton();
        $scope.automatonData.inputWord = "abc";

        var state1 = $scope.states.createWithPresets(200, 200);
        var state2 = $scope.states.createWithPresets(400, 200);
        var state3 = $scope.states.createWithPresets(600, 200);
        var state4 = $scope.states.createWithPresets(800, 200);
        // var state5 = $scope.states.createWithPresets(700, 100);

        $scope.states.final.create(state4);

        $scope.transitions.create(state1, state2, "a", "c", "→");
        $scope.transitions.create(state2, state3, "b", "c", "→");
        $scope.transitions.create(state3, state4, "c", "d", "→");
        // $scope.transitions.create(state4, state5, "d", "e", "←");
    };

    /**
     * test automaton for turing machine which subtracts two unary numbers which are separated by a '0'
     */
    self.testTM2 = function () {
        $scope.core.resetAutomaton();
        var state0 = $scope.states.createWithPresets(400, 100);
        var state1 = $scope.states.createWithPresets(400, 300);
        var state2 = $scope.states.createWithPresets(200, 300);
        var state3 = $scope.states.createWithPresets(700, 100);
        var state4 = $scope.states.createWithPresets(700, 300);

        $scope.states.final.create(state4);

        $scope.transitions.create(state0, state1, "0", "0", "→");
        $scope.transitions.create(state0, state0, "1", "1", "→");
        $scope.transitions.create(state1, state1, "0", "0", "→");
        $scope.transitions.create(state1, state2, "1", "0", "←");
        $scope.transitions.create(state1, state3, "☐", "☐", "←");
        $scope.transitions.create(state2, state2, "0", "0", "←");
        $scope.transitions.create(state2, state1, "1", "0", "→");
        $scope.transitions.create(state3, state3, "0", "☐", "←");
        $scope.transitions.create(state3, state3, "1", "1", "←");
        $scope.transitions.create(state3, state4, "☐", "☐", "→");

        $scope.statediagram.zoom.zoomTo(70);
    };

    /**
     * test automaton for turing machine increase a binary number by '1'
     */
    self.testTM3 = function () {
        $scope.core.resetAutomaton();
        $scope.automatonData.inputWord = "";


        //TestData3 (binäre Ganzahl um 1 erhöhen)
        var state0 = $scope.states.createWithPresets(300,100);
        var state1 = $scope.states.createWithPresets(300,300);
        var state2 = $scope.states.createWithPresets(700,100);
        var state3 = $scope.states.createWithPresets(700,300);

        $scope.states.final.create(state3);

        $scope.transitions.create(state0, state0, "0", "0", "→");
        $scope.transitions.create(state0, state0, "1", "1", "→");
        $scope.transitions.create(state0, state1, "☐", "☐", "←");

        $scope.transitions.create(state1, state2, "0", "1", "←");
        $scope.transitions.create(state1, state1, "1", "0", "←");
        $scope.transitions.create(state1, state2, "☐", "1", "←");

        $scope.transitions.create(state2, state2, "0", "0", "←");
        $scope.transitions.create(state2, state2, "1", "1", "←");
        $scope.transitions.create(state2, state3, "☐", "☐", "→");

        $scope.statediagram.zoom.zoomTo(70);
    };

    /**
     * test automaton for turing machine increase a binary number by '1'. This automaton have to start from right
     */
    self.testTM4 = function () {
        $scope.core.resetAutomaton();
        $scope.automatonData.inputWord = "";

        //TestData4 (erhöht eine Dualzahl um 1; muss von rechts starten)
        var state0 = $scope.states.createWithPresets(300, 100);
        var state1 = $scope.states.createWithPresets(300, 300);
        var state2 = $scope.states.createWithPresets(700, 200);

        $scope.states.final.create(state2);

        $scope.transitions.create(state0, state1, "0", "1", "←");
        $scope.transitions.create(state0, state0, "1", "0", "←");
        $scope.transitions.create(state0, state1, "0", "1", "←");
        $scope.transitions.create(state0, state2, "☐", "1", "↺");
        $scope.transitions.create(state1, state1, "0", "0", "←");
        $scope.transitions.create(state1, state1, "1", "1", "←");
        $scope.transitions.create(state1, state2, "☐", "☐", "→");
        // $scope.automatonData.acceptedInputRaw = "11";

        $scope.statediagram.zoom.zoomTo(70);

    };

    /**
     * test automaton for turing machine for testing the boundaries
     */
    self.testTM5 = function(){
        $scope.core.resetAutomaton();
        $scope.automatonData.inputWord = "";

        //Automat um Grenzen zu testen
        var state0 = $scope.states.createWithPresets(500,200);

        $scope.transitions.create(state0, state0, "☐", "☐", "→");
    };


    self.testNFA = function () {
        var state1 = $scope.states.createWithPresets(100, 100);
        var state2 = $scope.states.createWithPresets(100, 300);
        var state3 = $scope.states.createWithPresets(300, 300);
        var state4 = $scope.states.createWithPresets(300, 100);
        $scope.states.final.create(state3);
        $scope.states.final.create(state4);

        $scope.transitions.create(state1, state2, "a");
        $scope.transitions.create(state1, state3, "a");
        $scope.transitions.create(state1, state2, "b");
        $scope.transitions.create(state1, state2, "c");
        $scope.transitions.create(state2, state3, "b");
        $scope.transitions.create(state3, state4, "c");
        $scope.transitions.create(state4, state1, "l");
        $scope.transitions.create(state1, state3, "l");

        $scope.automatonData.inputWord = "abc";
        $scope.automatonData.acceptedInputRaw = "abc\nab";
    };

    self.testPDA = function () {
        $scope.automatonData.inputWord = "ab";
        var state1 = $scope.states.createWithPresets(200, 200);
        var state2 = $scope.states.createWithPresets(500, 200);

        $scope.transitions.create(state1, state1, "a", "⊥", "A");
        $scope.transitions.create(state1, state1, "a", "A", "AA");
        $scope.transitions.create(state1, state2, "b", "A", "ε");
        $scope.transitions.create(state2, state2, "b", "A", "ε");
        $scope.automatonData.acceptedInputRaw = "ab\naabb";
        $scope.automatonData.rejectedInputRaw = "abx\na";

    };
    self.testNPDA = function () {
        $scope.automatonData.inputWord = "ab";
        var state1 = $scope.states.createWithPresets(200, 200);
        var state2 = $scope.states.createWithPresets(500, 200);
        var state3 = $scope.states.createWithPresets(200, 500);

        $scope.transitions.create(state1, state1, "a", "⊥", "A");
        $scope.transitions.create(state1, state1, "a", "A", "AA");
        $scope.transitions.create(state1, state2, "b", "A", "ε");
        $scope.transitions.create(state2, state2, "b", "A", "ε");
        $scope.transitions.create(state1, state3, "b", "A", "ε");
        $scope.transitions.create(state3, state3, "b", "A", "ε");
        $scope.automatonData.acceptedInputRaw = "ab\naabb";
        $scope.automatonData.rejectedInputRaw = "abx\na";

    };

    self.testPDA2 = function () {
        $scope.automatonData.inputWord = "ab";
        var state1 = $scope.states.createWithPresets(200, 200);
        var state2 = $scope.states.createWithPresets(500, 200);

        $scope.transitions.create(state1, state1, "a", "⊥", "A");
        $scope.transitions.create(state1, state2, "b", "A", "ε");
    };

    self.sierpinskiTriangle = function () {
        $scope.cellSpace.twoD = false;
        $scope.simulator.init();

        $scope.CaCtrl.selectedColor = '#0066CC';

        $scope.stateTransitionRules.createRuleObject();
        $scope.stateTransitionRules.createRuleObject();
        $scope.stateTransitionRules.createRuleObject();
        $scope.stateTransitionRules.createRuleObject();
        $scope.stateTransitionRules.createRuleObject();
        $scope.stateTransitionRules.createRuleObject();
        $scope.stateTransitionRules.createRuleObject();
        $scope.stateTransitionRules.createRuleObject();

        $scope.stateTransitionRules.drawRule(0);
        $scope.stateTransitionRules.drawRule(1);
        $scope.stateTransitionRules.drawRule(2);
        $scope.stateTransitionRules.drawRule(3);
        $scope.stateTransitionRules.drawRule(4);
        $scope.stateTransitionRules.drawRule(5);
        $scope.stateTransitionRules.drawRule(6);
        $scope.stateTransitionRules.drawRule(7);

        //rule 2
        $scope.stateTransitionRules.array[1].newState = '#0066CC';
        $scope.stateTransitionRules.array[1].neighbourhood[0][0].color = '#0066CC';

        //rule 3
        $scope.stateTransitionRules.array[2].newState = '#0066CC';
        $scope.stateTransitionRules.array[2].neighbourhood[1][0].color = '#0066CC';

        //rule 4
        $scope.stateTransitionRules.array[3].newState = '#0066CC';
        $scope.stateTransitionRules.array[3].neighbourhood[2][0].color = '#0066CC';

        //rule 5
        $scope.stateTransitionRules.array[4].newState = '#0066CC';
        $scope.stateTransitionRules.array[4].neighbourhood[0][0].color = '#0066CC';
        $scope.stateTransitionRules.array[4].neighbourhood[1][0].color = '#0066CC';

        //rule 6
        $scope.stateTransitionRules.array[5].newState = '#0066CC';
        $scope.stateTransitionRules.array[5].neighbourhood[0][0].color = '#0066CC';
        $scope.stateTransitionRules.array[5].neighbourhood[2][0].color = '#0066CC';

        //rule 7
        $scope.stateTransitionRules.array[6].newState = '#0066CC';
        $scope.stateTransitionRules.array[6].neighbourhood[1][0].color = '#0066CC';
        $scope.stateTransitionRules.array[6].neighbourhood[2][0].color = '#0066CC';

        //rule 8
        $scope.stateTransitionRules.array[7].neighbourhood[0][0].color = '#0066CC';
        $scope.stateTransitionRules.array[7].neighbourhood[1][0].color = '#0066CC';
        $scope.stateTransitionRules.array[7].neighbourhood[2][0].color = '#0066CC';

        console.log($scope.cellSpace.cellData);
        $scope.cellSpace.cellData[Math.round($scope.cellSpace.sizeX/2-1)][0].color = '#0066CC';
        $scope.cellSpace.draw1DCanvas();
    };
    
    self.testPN = function () {
        console.log("TestsPN");
    };
}
