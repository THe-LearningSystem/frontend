(function () {
    'use strict';

    angular
        .module('admin.acl')
        .controller('SectionModalCtrl', SectionModalCtrl);

    SectionModalCtrl.$inject = ['$uibModalInstance', 'data'];

    function SectionModalCtrl($uibModalInstance, data) {
        var vm = this;
        if (data !== undefined) {
            console.log(data);
        }

        vm.create = function () {

            $uibModalInstance.close();
        };

        vm.update = function () {
            $uibModalInstance.close();
        };

        vm.delete = function () {
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }
}());
