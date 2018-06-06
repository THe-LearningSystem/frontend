(function () {
    'use strict';

    angular
        .module('courses.tcs')
        .controller('LANGController', LANGController);

    LANGController.$inject = ['$scope','$state','Courses', '$stateParams','Authentication','$uibModal'];

    function LANGController($scope,$state,Courses, $stateParams,Authentication,$uibModal) {

        angular.lowercase = text => text.toLowerCase();
        angular.uppercase = text => text.toUpperCase();
        
        prepareScope($scope);

        //Adding the different "classes" to the scope.
        $scope.languageData = new autoSim.LanguageData();
        $scope.langCore = new autoSim.LangCore($scope);
        $scope.langProductionRules = new autoSim.LangProductionRules($scope);
        $scope.langProductionRules.change = new autoSim.LangProductionRulesChange($scope);
        $scope.langGrammar = new autoSim.LangGrammar($scope);
        $scope.langWordChecker = new autoSim.LangWordChecker($scope);
        $scope.langDerivationSequence = new autoSim.LangDerivationSequence($scope);
        $scope.langDerivationtree = new autoSim.LangDerivationTree($scope);
        $scope.langDerivationtree.grid = new autoSim.LangDerivationTreeGrid($scope);
        $scope.langDerivationtree.zoom = new autoSim.LangDerivationTreeZoom($scope);
        $scope.langDerivationtree.draw = new autoSim.LangDerivationtreeDraw($scope);
        $scope.langTransitions = new autoSim.LangTransitions($scope);
        $scope.langSimulator = new autoSim.LangSimulator($scope);

        //Creating the testData.
        $scope.testLangAgent = new TestLangData($scope);
        $scope.testLangAgent.testLANG13();

    }
}());

