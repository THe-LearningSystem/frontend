(function () {
    'use strict';

    angular
        .module('users.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ["localStorageService", "jwtHelper", "$state"];

    function Authentication(localStorageService, jwtHelper, $state) {
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
                    auth.token = null;
                }

            },
            isTokenExpired: function () {
                return jwtHelper.isTokenExpired(auth.token);
            },
            setToken: function (token) {
                localStorageService.set("token", token);
                auth.token = token;
                auth.isAuthenticated = true;
            },
            removeToken: function () {
                auth.username = null;
                auth.rights = null;
                auth.token = null;
                auth.expirationDate = null;
                auth.isAuthenticated = false;
                localStorageService.remove("token");
                $state.transitionTo('home');
            },
            hasRight:function(right){
                return(auth.rights !== null &&_.includes(auth.rights,right));
            }
        };

        return auth;
    }
}());
