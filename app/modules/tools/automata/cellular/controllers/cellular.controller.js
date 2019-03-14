(function () {
    'use strict';

    /**
     * Initialization of the cellular automaton
     * @param $scope: Instance through which data can be exchanged
     *
     */
    function _initAutomaton($scope) {
        window.rootScope = $scope;
        // $scope.saveApply = scopeSaveApply;
        $scope.debug = true;

        // Config Object
        $scope.automatonData = new autoSim.AutomatonData('CA');
        $scope.simulator = new autoSim.SimulatorCA($scope);
        $scope.cellSpace = new autoSim.CellSpace($scope);
        $scope.cellSpaceZoom = new autoSim.CellSpaceZoom($scope);
        $scope.stateTransitionRules = new autoSim.StateTransitionRules($scope);

        $scope.testAgent = new TestData($scope);
    }

     angular
        .module('tcs-tools')
        .controller('CellularCtrl', CellularCtrl);

    CellularCtrl.$inject = ['$scope', '$uibModal'];

    function CellularCtrl($scope, $uibModal) {
        var vm = this;

        _initAutomaton($scope);
        $scope.CaCtrl = vm;
        $scope.uibModal = $uibModal;
        $scope.simulator.init();
    }
}());