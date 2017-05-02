(function () {
    'use strict';

    angular.module('admin.acl').controller('RightModalCtrl', RightModalCtrl);

    RightModalCtrl.$inject = ['$uibModalInstance', 'ACL', 'data'];

    function RightModalCtrl($uibModalInstance, ACL, data) {
        var vm = this;
        if (data !== undefined) {
            vm._id = data._id;
            vm.name = data.name;
            vm.description = data.description;
        } else {
            vm._id = undefined;
            vm.name = "";
            vm.description = "";
        }
        vm.create = function () {
            var data = {
                payload: {
                    name: vm.name,
                    description: vm.description
                }
            };
            ACL.createRight(data);
        };

        vm.update = function () {
            var data = {
                rightId: vm._id,
                payload: {
                    _id: vm._id,
                    name: vm.name,
                    description: vm.description
                }
            };
            ACL.updateRight(data);
            $uibModalInstance.close();
        };

        vm.delete = function () {
            var data = {
                rightId: vm._id
            };
            ACL.deleteRight(data);
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }

}());