function TestLangData($scope) {
    "use strict";
    var self = this;

    self.testLANG0 = function () {
        // At least 2 times 'a' and then as many of 'a' and then as many of 'b'.

        var rule00 = $scope.langProductionRules.create("S", "aA");
        var rule01 = $scope.langProductionRules.create("A", "aA");
        var rule02 = $scope.langProductionRules.create("A", "aB");
        var rule03 = $scope.langProductionRules.create("B", "bB");
        var rule04 = $scope.langProductionRules.create("B", "ε");

        $scope.languageData.inputWord = "aaab";
        $scope.langProductionRules.changeStart(rule00);
    };

    self.testLANG1 = function () {
        // At least 2 times 'a' and then as many of 'a' and then as many of 'b'.

        var rule10 = $scope.langProductionRules.create("S", "aA");
        var rule11 = $scope.langProductionRules.create("A", "aA");
        var rule12 = $scope.langProductionRules.create("A", "bA");
        var rule13 = $scope.langProductionRules.create("A", "cA");
        var rule14 = $scope.langProductionRules.create("A", "dA");
        var rule15 = $scope.langProductionRules.create("A", "aB");
        var rule16 = $scope.langProductionRules.create("B", "bB");
        var rule17 = $scope.langProductionRules.create("B", "ε");

        $scope.languageData.inputWord = "aabcda";
        $scope.langProductionRules.changeStart(rule10);
    };

    self.testLANG2 = function () {
        // Outsides a's and insides b's.

        var rule20 = $scope.langProductionRules.create("A", "aABaC");
        var rule21 = $scope.langProductionRules.create("A", "aBa");
        var rule22 = $scope.langProductionRules.create("B", "b");
        var rule23 = $scope.langProductionRules.create("C", "ε");

        $scope.languageData.inputWord = "aababa";
        $scope.langProductionRules.changeStart(rule20);
    };

    self.testLANG3 = function () {
        // 'a' and 'b' alternate.

        var rule30 = $scope.langProductionRules.create("A", "aA");
        var rule31 = $scope.langProductionRules.create("A", "bA");
        var rule34 = $scope.langProductionRules.create("A", "ε");

        $scope.languageData.inputWord = "abab";
        $scope.langProductionRules.changeStart(rule30);
    };

    self.testLANG4 = function () {
        // Outsides a's and insides b's.

        var rule40 = $scope.langProductionRules.create("A", "aAAaC");
        var rule41 = $scope.langProductionRules.create("A", "b");
        var rule42 = $scope.langProductionRules.create("C", "ε");

        $scope.languageData.inputWord = "abba";
        $scope.langProductionRules.changeStart(rule40);
    };
    
    self.testLANG5 = function () {
        // Outsides a's and insides b's.
        // Rule 2 is not correct implemented in the treeOrderArray.

        var rule50 = $scope.langProductionRules.create("A", "aBBaC");
        var rule51 = $scope.langProductionRules.create("B", "aBa"); // <--
        var rule52 = $scope.langProductionRules.create("B", "bb");
        var rule53 = $scope.langProductionRules.create("C", "ε");

        $scope.languageData.inputWord = "aabbabba";
        $scope.langProductionRules.changeStart(rule50);
    };
    
    self.testLANG6 = function () {
        // Only b's and at least 2.
        // Transition Drawing not working completely!

        var rule60 = $scope.langProductionRules.create("A", "AA");
        var rule61 = $scope.langProductionRules.create("A", "BBd");
        var rule62 = $scope.langProductionRules.create("A", "B");
        var rule63 = $scope.langProductionRules.create("B", "b");
        var rule64 = $scope.langProductionRules.create("B", "ε");

        $scope.languageData.inputWord = "bbdbb";
        $scope.langProductionRules.changeStart(rule60);
    };
    
    self.testLANG7 = function () {
        // Only a's and at least 2.
        // Transition Drawing not working completely!

        var rule70 = $scope.langProductionRules.create("A", "AA");
        var rule71 = $scope.langProductionRules.create("A", "b");
        var rule72 = $scope.langProductionRules.create("A", "ε");

        $scope.languageData.inputWord = "bbb";
        $scope.langProductionRules.changeStart(rule70);
    };
    
    self.testLANG8 = function () {
        // Only b's and at least 2.
        // Transition Drawing not working completely!

        var rule80 = $scope.langProductionRules.create("A", "AA");
        var rule81 = $scope.langProductionRules.create("A", "bAb");
        var rule82 = $scope.langProductionRules.create("A", "b");
        var rule83 = $scope.langProductionRules.create("A", "ε");

        $scope.languageData.inputWord = "bbbbbb";
        $scope.langProductionRules.changeStart(rule80);
    };
    
    self.testLANG9 = function () {
        // Only a's and at least 2.
        // Transition Drawing not working completely!

        var rule90 = $scope.langProductionRules.create("A", "aAA");
        var rule91 = $scope.langProductionRules.create("A", "a");
        var rule92 = $scope.langProductionRules.create("A", "ε");

        $scope.languageData.inputWord = "aaaaaa";
        $scope.langProductionRules.changeStart(rule90);
    };
    
    self.testLANG10 = function () {
        // Only a's and at least 2.
        // Transition Drawing not working completely!

        var rule100 = $scope.langProductionRules.create("A", "aaA");
        var rule101 = $scope.langProductionRules.create("A", "ε");

        $scope.languageData.inputWord = "aaaaaa";
        $scope.langProductionRules.changeStart(rule100);
    };
    
    self.testLANG11 = function () {
        // Only a's and at least 2.
        // Transition Drawing not working completely!

        var rule110 = $scope.langProductionRules.create("A", "aaA");
        var rule111 = $scope.langProductionRules.create("A", "a");
        var rule112 = $scope.langProductionRules.create("A", "BA");
        var rule113 = $scope.langProductionRules.create("B", "bbb");
        var rule114 = $scope.langProductionRules.create("A", "ε");

        $scope.languageData.inputWord = "bbbbbbaaaa";
        $scope.langProductionRules.changeStart(rule112);
    };
    
    self.testLANG12 = function () {
        // Only a's and at least 2.
        // Transition Drawing not working completely!

        var rule120 = $scope.langProductionRules.create("A", "aaAAAA");
        var rule121 = $scope.langProductionRules.create("A", "ε");

        $scope.languageData.inputWord = "aa";
        $scope.langProductionRules.changeStart(rule120);
    };
    
    self.testLANG13 = function () {
        // Only a's and at least 2.
        // Transition Drawing not working completely!

        var rule130 = $scope.langProductionRules.create("S", "aA");
        var rule131 = $scope.langProductionRules.create("A", "a");
        var rule132 = $scope.langProductionRules.create("A", "AA");
        var rule133 = $scope.langProductionRules.create("A", "ε");

        $scope.languageData.inputWord = "aaaa";
        $scope.langProductionRules.changeStart(rule130);
    };
}
