(function () {
    'use strict';

    function _initAutomaton($scope) {
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
    }

    angular
        .module('courses.tcs')
        .controller('DFACtrl', DFACtrl);

    DFACtrl.$inject = ['$scope','$uibModal'];

    function DFACtrl($scope,$uibModal) {
        _initAutomaton($scope);
        $scope.$uibModal = $uibModal;
        $scope.testAgent.testDFA();
    }

    angular
        .module('courses.tcs')
        .controller('DFAModalCtrl', DFAModalCtrl);

    DFAModalCtrl.$inject = ['$scope', '$state', 'Courses', '$stateParams', 'Authentication', '$uibModal', 'data', '$uibModalInstance'];

    function DFAModalCtrl($scope, $state, Courses, $stateParams, Authentication, $uibModal, data, $uibModalInstance) {
        _initAutomaton($scope);

        $scope.$uibModal = $uibModal;


        if (data !== undefined) {
            $scope.save = function () {
                var exportData = {};
                exportData.automatonData = _.cloneDeep($scope.automatonData);
                exportData.states = $scope.states.export();
                exportData.transitions = $scope.transitions.export();
                exportData.type = $scope.automatonData.type.toLowerCase();
                data.parentController.data.data.automaton = exportData;
                $uibModalInstance.close();
            };
            if (!_.isEmpty(data.automaton)) {
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

    angular
        .module('courses.tcs')
        .controller('DFALessonCtrl', DFALessonCtrl);

    DFALessonCtrl.$inject = ['$rootScope','$scope','Courses','CustomNotify','Authentication'];

    function DFALessonCtrl($rootScope,$scope, Courses,CustomNotify,Authentication) {
        _initAutomaton($scope);
        $scope.isLesson = true;
        $scope.lessonTester = new autoSim.lessonTester($scope,$rootScope, Courses,CustomNotify,Authentication);

        $scope.init = function (data, parentScope) {
            console.log($scope);
            console.log(data);
            $scope.parentScope = parentScope;
            $scope.lessonData = data;
            if (!_.isEmpty(data)) {
                var tmpObject = _.cloneDeep(data.data.automaton);
                if (tmpObject.automatonData.type === $scope.automatonData.type) {
                    $scope.automatonData = tmpObject.automatonData;
                    $scope.states.import(tmpObject.states);
                    $scope.transitions.import(tmpObject.transitions);
                }
            }
        };
    }
}());
