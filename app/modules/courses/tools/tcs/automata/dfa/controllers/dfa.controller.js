(function () {
    'use strict';

    angular
        .module('courses')
        .controller('DFACtrl', DFACtrl);

    DFACtrl.$inject = ['$scope','$state','Courses', '$stateParams','Authentication'];

    function DFACtrl($scope,$state,Courses, $stateParams,Authentication) {
        console.log("created DFA");
        window.rootScope = $scope;
        $scope.saveApply = scopeSaveApply;
        $scope.debug = true;

        //Config Object
        $scope.automatonData = new autoSim.AutomatonData('DFA');
        $scope.core = new autoSim.DFACore($scope);
        $scope.states = new autoSim.States($scope);
        $scope.states.menu = new autoSim.StateMenus($scope);
        $scope.transitions = new autoSim.Transitions($scope);
        $scope.transitions.menu = new autoSim.TransitionMenus($scope);
        $scope.simulator = new autoSim.Simulator($scope);
        $scope.statediagram = new autoSim.StateDiagram($scope);
        $scope.statediagram.grid = new autoSim.StateDiagramGrid($scope);
        $scope.statediagram.menu = new autoSim.StateDiagramMenu($scope);
        $scope.statediagram.zoom = new autoSim.StateDiagramZoom($scope);
        $scope.table = new autoSim.Table($scope);

        $scope.testAgent = new TestData($scope);


        $scope.testAgent.testDFA();
    }
}());
