(function () {
    'use strict';

    angular
        .module('admin.acl')
        .controller('ListUsersCtrl', ListUsersCtrl);

    ListUsersCtrl.$inject = ['ACL', 'Authentication', '$uibModal'];

    function ListUsersCtrl(ACL, Authentication, $uibModal) {
        var vm = this;

        vm.auth = Authentication;
        ACL.getUsers().then(function (response) {
            vm.users = response.data;
        });

        ACL.getRoles().then(function (response) {
            vm.roles = response.data;
        });

        vm.editUser = function (userData, roles) {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/admin/acl/views/userModal.html',
                controller: 'UserModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {userData: userData, roles: roles};
                    }
                }
            });
        }

    }
}());
