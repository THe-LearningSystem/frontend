(function () {
    'use strict';

    angular
        .module('courses')
        .controller('DeleteStateModalCtrl', DeleteStateModalCtrl);

    DeleteStateModalCtrl.$inject = ['$scope', '$state', '$uibModalInstance', 'Courses', 'I18nManager', 'data'];

    function DeleteStateModalCtrl($scope, $state, $uibModalInstance, Courses, I18nManager, data) {
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
