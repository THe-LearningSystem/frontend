(function () {
    'use strict';

    angular
        .module('tcs-tools')
        .controller('DeleteStateModalCtrl', DeleteStateModalCtrl);

    DeleteStateModalCtrl.$inject = ['$scope', '$state', '$uibModalInstance', 'I18nManager', 'data'];

    function DeleteStateModalCtrl($scope, $state, $uibModalInstance, I18nManager, data) {
        var vm = this;

        vm.delete = function () {
            console.log(data);
          data.parentScope.states.forcedRemove(data.state);
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }
}());
