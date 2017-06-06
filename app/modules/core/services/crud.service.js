(function () {
    'use strict';

    angular
        .module('core.services')
        .factory('crud', crud);

    crud.$inject = ['CustomNotify', '$http', '$state'];

    var _serverUrl = "http://localhost:3000/api";


    function crud(CustomNotify, $http, $state) {
        return {
            get: get, //GetAll or GetOne depends on the url
            post: post, //Create
            put: put, //Update
            delete: deleteItem //Delete
        };

        function get(url) {
            return $http.get(_serverUrl + url);
        }

        function post(url, payload, callback, notify) {
            return $http.post(_serverUrl + url, payload)
                .then(function (response) {
                    success(response, callback, notify)
                }).catch(function (response) {
                    error(response, callback, notify);
                });
        }

        function put(url, payload, callback, notify) {
            return $http.put(_serverUrl + url, payload)
                .then(function (response) {
                    success(response, callback, notify)
                }).catch(function (response) {
                    error(response, callback, notify);
                });
        }

        function deleteItem(url, callback, notify) {
            return $http.delete(_serverUrl + url)
                .then(function (response) {
                    success(response, callback, notify)
                }).catch(function (response) {
                    error(response, callback, notify);
                });
        }

        function success(response, callback, notify) {
            if (response.data.msg !== null &&(notify || notify === undefined))
                CustomNotify.success(response.data.msg);
            if (callback !== undefined) {
                callback(response);
            } else {
                $state.reload();
            }
        }

        function error(response, callback, notify) {
                      console.log(response);
            if (response.data !== null && response.data.msg !== null && (notify || notify === undefined))
                CustomNotify.error(response.data.msg);
            if (callback !== undefined) {
                callback(response);
            } else {
                $state.reload();
            }
        }
    }
}());