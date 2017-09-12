/**
 * DFA constructor, creates the DFA with all needed subComponents
 * @param $scope
 * @constructor
 */
autoSim.DFACore = function ($scope) {
    "use strict";
    var self = this;

    //Array of all update Listeners
    self.updateListeners = [];

    self.inNameEdit = false;

    /**
     * Removes the current automata and the inputWord
     */
    self.resetAutomaton = function () {

        self.closeMenus();
        $scope.simulator.reset();
        $scope.states.clear();
        $scope.transitions.clear();
        $scope.automatonData = new autoSim.AutomatonData($scope.automatonData.type);
        $scope.statediagram.zoom.scaleAndTranslateToDefault();
        self.updateListener();
        $scope.automatonData.unSavedChanges = false;
        $scope.saveApply();
    };

    self.resetAutomatonRequest = function(){
        $scope.$uibModal.open({
            ariaLabelledBy: 'modal-title',
            templateUrl: '/modules/courses/tools/tcs/automata/directives/modal/resetAutomaton/resetAutomaton.modal.view.html',
            controller: 'ResetAutomatonModalCtrl',
            controllerAs: 'vm',
            resolve: {
                data: function () {
                    return {
                        parentScope:$scope
                    };
                }
            }
        });
    };

    self.openInfoModal = function(title,description){
        $scope.$uibModal.open({
            ariaLabelledBy: 'modal-title',
            templateUrl: '/modules/courses/tools/tcs/automata/directives/modal/info/info.modal.view.html',
            controller: 'InfoModalCtrl',
            controllerAs: 'vm',
            resolve: {
                data: function () {
                    return {
                        title:title,
                        description:description,
                        parentScope:$scope
                    };
                }
            }
        });
    };

    /**
     * This function calls the method updateFunction of every element in $scope.core.updateListeners
     */
    self.updateListener = function () {
        _.forEach($scope.core.updateListeners, function (value) {
            value.updateFunction();
        });
        $scope.automatonData.unSavedChanges = true;
        //instant update, but more digest cycles
        $scope.saveApply();
    };

    self.closeMenus = function () {
        $scope.statediagram.menu.close();
        $scope.states.menu.close();
        $scope.transitions.menu.close();
        $scope.saveApply();
    };
};
