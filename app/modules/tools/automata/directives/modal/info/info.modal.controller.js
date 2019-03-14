(function () {
    'use strict';

    angular
        .module('tcs-tools')
        .controller('InfoModalCtrl', InfoModalCtrl);

    InfoModalCtrl.$inject = ['$scope', '$state', '$uibModalInstance', 'I18nManager', 'data'];

    function InfoModalCtrl($scope, $state, $uibModalInstance, I18nManager, data) {
        var vm = this;
        vm.data = data;
        vm.cancel = function () {
            $uibModalInstance.dismiss("");

            if (data.parentScope.automatonData.type === 'TM') {
              data.parentScope.simulator.reset();
              // data.parentScope.simulator.playOrPause();
            }
        };
    }
}());
