(function () {
    'use strict';

    // Users service used for communicating with the users REST endpoint
    angular
        .module('admin.acl.services')
        .factory('ACL', ACL);

    ACL.$inject = ['crud'];

    function ACL(crud) {
        return {
            getRoles: getRoles,
            getRights: getRights,
            changeRoleRight: changeRoleRight,
            createRole: createRole,
            updateRole: updateRole,
            deleteRole: deleteRole,
            createRight: createRight,
            updateRight: updateRight,
            deleteRight: deleteRight,
            getUsers: getUsers,
            updateUser: updateUser

        };


        function getRoles() {
            return crud.get('/acl/roles');
        }

        function createRole(data) {
            return crud.post('/acl/roles', data.payload);
        }

        function updateRole(data) {
            return crud.put('/acl/roles/' + data.roleId + '/', data.payload);
        }

        function changeRoleRight(data,callback) {
            return crud.put('/acl/roles/' + data.roleId + '/', data.payload,callback);
        }

        function deleteRole(data) {
            return crud.delete('/acl/roles/' + data.roleId + '/');
        }

        function getRights() {
            return crud.get('/acl/rights');
        }

        function createRight(data) {
            return crud.post('/acl/rights', data.payload);
        }

        function updateRight(data) {
            return crud.put('/acl/rights/' + data.rightId + '/', data.payload);
        }

        function deleteRight(data) {
            return crud.delete('/acl/rights/' + data.rightId + '/');
        }

        function updateUser(data) {
            return crud.put('/users/' + data.rightId + '/', data.payload);
        }

        function getUsers() {
            return crud.get('/users/');
        }
    }
}());
