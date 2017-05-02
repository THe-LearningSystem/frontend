(function () {
    'use strict';

    angular
        .module('core.services')
        .factory('crud', crud);

    crud.$inject = ['notify', '$http', '$state'];

    var _serverUrl = "http://localhost:3000/api";


    function crud(notify, $http, $state) {
        return {
            get: get, //GetAll or GetOne depends on the url
            post: post, //Create
            put: put, //Update
            delete: deleteItem //Delete
        };

        function get(url) {
            return $http.get(_serverUrl + url);
        }

        function post(url, payload, callback) {
            return $http.post(_serverUrl + url, payload)
                .then(function (response) {
                    success(response, callback)
                }).catch(function (response) {
                    error(response, callback);
                });
        }

        function put(url, payload, callback) {
            return $http.put(_serverUrl + url, payload)
                .then(function (response) {
                    success(response, callback)
                }).catch(function (response) {
                    error(response, callback);
                });
        }

        function deleteItem(url, callback) {
            return $http.delete(_serverUrl + url)
                .then(function (response) {
                    success(response, callback)
                }).catch(function (response) {
                    error(response, callback);
                });
        }

        function success(response, callback) {
                notify.success(response.data.msg);
            if (callback !== undefined) {
                callback(response);
            } else {
                $state.reload();
            }
        }

        function error(response, callback) {
            if (response.data !== null)
                notify.error(response.data.msg);
            if (callback !== undefined) {
                callback(response);
            } else {
                $state.reload();
            }
        }
    }
}());