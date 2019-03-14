(function () {
    'use strict';

    function _initAutomaton($scope) {
        window.rootScope = $scope;
        $scope.saveApply = scopeSaveApply;
        $scope.debug = true;

        //Config Object
        $scope.automatonData = new autoSim.AutomatonData('PN');
        $scope.core = new autoSim.DFACore($scope);
        $scope.states = new autoSim.StatesPN($scope);
        $scope.states.menu = new autoSim.StateMenusPN($scope);
        $scope.transitions = new autoSim.TransitionsPN($scope);
        $scope.transitions.menu = new autoSim.TransitionMenusPN($scope);
        $scope.simulator = new autoSim.SimulatorPN($scope);
        $scope.statediagram = new autoSim.StateDiagramPN($scope);
        $scope.statediagram.grid = new autoSim.StateDiagramGrid($scope);
        $scope.statediagram.menu = new autoSim.StateDiagramMenu($scope);
        $scope.statediagram.zoom = new autoSim.StateDiagramZoom($scope);
        $scope.table = new autoSim.Table($scope);

        $scope.testAgent = new TestData($scope);
    }

     angular
        .module('tcs-tools')
        .controller('PNCtrl', PNCtrl);

    PNCtrl.$inject = ['$scope','$uibModal'];

    function PNCtrl($scope,$uibModal) {
        _initAutomaton($scope);
        $scope.$uibModal = $uibModal;
    }


}());
