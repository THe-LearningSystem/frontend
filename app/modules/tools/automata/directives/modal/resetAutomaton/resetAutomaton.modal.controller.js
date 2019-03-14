(function () {
    'use strict';

    angular
        .module('tcs-tools')
        .controller('ResetAutomatonModalCtrl', ResetAutomatonModalCtrl);

    ResetAutomatonModalCtrl.$inject = ['$uibModalInstance', 'data'];

    function ResetAutomatonModalCtrl($uibModalInstance, data) {
        var vm = this;

        vm.delete = function () {
            if (data.parentScope.automatonData.type === 'CA') {
                data.parentScope.simulator.resetAutomaton();
            } else {
                data.parentScope.core.resetAutomaton();
            }
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }
}());
