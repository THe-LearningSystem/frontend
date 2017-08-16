(function () {
    'use strict';

    angular
        .module('courses.tcs')
        .controller('DFACtrl', DFACtrl);

    DFACtrl.$inject = ['$scope','$state','Courses', '$stateParams','Authentication'];

    function DFACtrl($scope,$state,Courses, $stateParams,Authentication) {
        window.rootScope = $scope;
        $scope.saveApply = scopeSaveApply;
        $scope.debug = true;
        console.log($scope);

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


        // $scope.testAgent.testDFA();


        if(false){
            $scope.save = function(){
                var exportData = {};
                exportData.automatonData = _.cloneDeep($scope.automatonData);
                exportData.states = $scope.states.export();
                exportData.transitions = $scope.transitions.export();
                exportData.type = $scope.automatonData.type.toLowerCase();
                console.log(exportData);
                data.parentController.data.data.automaton = exportData;
                $uibModalInstance.close();
            };
            console.log(data.automaton);
            if(!_.isEmpty(data.automaton)){
                var tmpObject = _.cloneDeep(data.automaton);
                if (tmpObject.automatonData.type === $scope.automatonData.type) {
                    $scope.automatonData = tmpObject.automatonData;
                    $scope.states.import(tmpObject.states);
                    $scope.transitions.import(tmpObject.transitions);

                    //update all listeners
                    $scope.core.updateListener();
                } else {
                    console.log("the automaton has not the same type. AutomatonType:" + $scope.type + ", uploaded automatonType:" + tmpObject.type);
                }
            }
        }
    }
}());
