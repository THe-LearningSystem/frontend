(function () {
    'use strict';

    angular
        .module('courses')
        .controller('ResetAutomatonModalCtrl', ResetAutomatonModalCtrl);

    ResetAutomatonModalCtrl.$inject = ['$uibModalInstance', 'data'];

    function ResetAutomatonModalCtrl($uibModalInstance, data) {
        var vm = this;

        vm.delete = function () {
            data.parentScope.core.resetAutomaton();
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }
}());
