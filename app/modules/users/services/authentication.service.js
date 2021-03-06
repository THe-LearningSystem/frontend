(function () {
    'use strict';

    angular
        .module('users.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ["localStorageService", "jwtHelper"];

    function Authentication(localStorageService, jwtHelper) {
        var auth = {
            user: null,
            username: null,
            rights: null,
            token: null,
            expirationDate: null,
            isAuthenticated: false,
            init: function () {
                if (auth.token === null) {
                    auth.token = localStorageService.get("token");
                }
                if (auth.token !== null && !auth.isTokenExpired()) {
                    var tokenPayload = jwtHelper.decodeToken(auth.token);
                    auth.user = tokenPayload.user;
                    auth.username = tokenPayload.username;
                    auth.rights = tokenPayload.rights;
                    auth.expirationDate = jwtHelper.getTokenExpirationDate(auth.token);
                    auth.isAuthenticated = true;
                } else {
                    auth.removeToken();
                }
                return auth;

            },
            isTokenExpired: function () {
                return jwtHelper.isTokenExpired(auth.token);
            },
            setToken: function (token) {
                localStorageService.set("token", token);
                auth.token = token;
                return auth.init();
            },
            removeToken: function () {
                auth.user = null;
                auth.username = null;
                auth.rights = null;
                auth.token = null;
                auth.expirationDate = null;
                auth.isAuthenticated = false;
                localStorageService.remove("token");
            },
            hasRight: function (rights) {
                var bool = true;
                if(auth.rights !== null){
                    _.forEach(rights, function(right){
                        if(! _.includes(auth.rights, right)){
                            bool = false;
                        }
                    });
                    return bool;
                }else{
                    return false;
                }
            }
        };
        return auth;
    }
}());
