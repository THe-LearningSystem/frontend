(function () {
    'use strict';

    angular
        .module('admin.acl')
        .controller('UserModalCtrl', UserModalCtrl);

    UserModalCtrl.$inject = ['$uibModalInstance', 'ACL', 'data'];

    function UserModalCtrl($uibModalInstance, ACL, data) {
        var vm = this;
        if (data !== undefined) {
            console.log(data);
            vm.userData = data.userData;
            vm.roles = data.roles;
            vm.selected = [];
            //Remove the guest role, because this isnt assignable
            _.remove(vm.roles, function (role) {
                return role.name === "guest";
            });
            //remove the selected roles from the
            _.forEach(vm.userData.roles, function (userRole) {
                _.forEach(vm.roles, function (role) {
                    if (role !== undefined && userRole._id === role._id) {
                        vm.selected.push(role);
                    }
                });
            });
        }

        // vm.create = function () {
        //     $uibModalInstance.close();
        // };

        vm.update = function () {

            vm.userData.roles = [];
            _.forEach(vm.selected, function (role) {
                vm.userData.roles.push(role._id);
            });
            var data ={
                userId:vm.userData._id,
                payload:vm.userData
            };
            ACL.updateUser(data);
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
