(function () {
    'use strict';

    angular
        .module('users.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ["localStorageService", "jwtHelper"];

    function Authentication(localStorageService, jwtHelper) {
        var auth = {
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
                auth.init();
            },
            removeToken: function () {
                auth.username = null;
                auth.rights = null;
                auth.token = null;
                auth.expirationDate = null;
                auth.isAuthenticated = false;
                localStorageService.remove("token");
            },
            hasRight:function(right){
                return(auth.rights !== null &&_.includes(auth.rights,right));
            }
        };

        return auth;
    }
}());
