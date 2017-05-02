(function () {
    'use strict';

    angular.module('admin.acl').controller('RoleModalCtrl', RoleModalCtrl);

    RoleModalCtrl.$inject = ['$uibModalInstance', 'ACL', 'data'];

    function RoleModalCtrl($uibModalInstance, ACL, data) {
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
            ACL.createRole(data);
            $uibModalInstance.close();
        };

        vm.update = function () {
            var data = {
                roleId: vm._id,
                payload: {
                    _id: vm._id,
                    name: vm.name,
                    description: vm.description
                }
            };
            ACL.updateRole(data);
            $uibModalInstance.close();
        };

        vm.delete = function () {
            var data = {
                roleId: vm._id
            };
            ACL.deleteRole(data);
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }
}());