(function () {
    'use strict';

    angular
        .module('admin.acl')
        .controller('ACLCtrl', ACLCtrl);

    ACLCtrl.$inject = [ 'ACL',  '$uibModal'];

    function ACLCtrl(ACL, $uibModal) {
        var vm = this;
        ACL.getRoles().then(function (response) {
            vm.roles = response.data;
            ACL.getRights().then(function (response) {
                vm.rights = response.data;
                vm.hasRoleRight = [];
                vm.rights = _.sortBy(vm.rights,[function(o){
                    return o.name;
                }]);
                vm.roles = _.sortBy(vm.roles,[function(o){
                    return o.name;
                }]);
                _.forEach(vm.rights, function (right) {
                    var row = [];
                    row.push(right);
                    _.forEach(vm.roles, function (role) {
                        var bool = (_.find(role.rights, {name: right.name}) !== undefined);
                        row.push(
                            {
                                state: bool,
                                roleId: role._id,
                                rightId: right._id
                            }
                        );
                    });
                    vm.hasRoleRight.push(row);
                });
            });
        });

        vm.changeRoleRight = function (data) {
            var dataObject ={
                roleId: data.roleId,
                payload:{
                    rightId: data.rightId,
                    state: !data.state
                }
            };
            ACL.changeRoleRight(dataObject,function(){
                data.state = !data.state;
                console.log(data);
            });

        };

        vm.createRole = function () {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/admin/acl/views/role.modal.view.html',
                controller: 'RoleModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return undefined;
                    }
                }
            });
        };

        vm.editRole = function (data) {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/admin/acl/views/role.modal.view.html',
                controller: 'RoleModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
        };

        vm.createRight = function () {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/admin/acl/views/right.modal.view.html',
                controller: 'RightModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return undefined;
                    }
                }
            });
        };

        vm.editRight = function (data) {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/admin/acl/views/right.modal.view.html',
                controller: 'RightModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return data
                    }
                }
            });
        };
    }
}());

