(function () {
    'use strict';

    function _initAutomaton($scope) {
        window.rootScope = $scope;
        $scope.saveApply = scopeSaveApply;
        $scope.debug = true;
        //Config Object
        $scope.automatonData = new autoSim.AutomatonData('NFA', true);
        $scope.core = new autoSim.DFACore($scope);
        $scope.states = new autoSim.States($scope);
        $scope.states.menu = new autoSim.StateMenus($scope);
        $scope.transitions = new autoSim.TransitionsNFA($scope);
        $scope.transitions.menu = new autoSim.TransitionMenus($scope);
        $scope.simulator = new autoSim.Simulator($scope);
        $scope.statediagram = new autoSim.StateDiagram($scope);
        $scope.statediagram.grid = new autoSim.StateDiagramGrid($scope);
        $scope.statediagram.menu = new autoSim.StateDiagramMenu($scope);
        $scope.statediagram.zoom = new autoSim.StateDiagramZoom($scope);
        $scope.table = new autoSim.Table($scope);


        $scope.testAgent = new TestData($scope);
    }

    angular
        .module('tcs-tools')
        .controller('NFACtrl', NFACtrl);

    NFACtrl.$inject = ['$scope', '$uibModal'];

    function NFACtrl($scope, $uibModal) {
        _initAutomaton($scope);
        $scope.$uibModal = $uibModal;
        $scope.testAgent.testDFA();
    }

}());
