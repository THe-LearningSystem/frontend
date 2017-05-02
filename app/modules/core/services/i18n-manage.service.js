(function () {
    'use strict';

    // Users service used for communicating with the users REST endpoint
    angular
        .module('core')
        .factory('i18nManagerService', i18nManagerService);

    i18nManagerService.$inject = ['localStorageService', 'i18nService'];

    function i18nManagerService(localStorageService, i18nService) {
        var i18n = {
            config: null,
            data: null,
            currentLanguage:null,
            init: function () {
                // i18n.data = localStorageService.get("i18n.data");
                if (i18n.data === null) {
                    i18nService.getAllSimplified().then(function (response) {
                        localStorageService.set("i18n.data", response.data);
                        i18n.data = response.data;
                    });
                }

                // i18n.config = localStorageService.get("i18n.config");
                // i18n.currentLanguage = i18n.config.default;
                if (i18n.config === null) {
                    i18nService.getConfig().then(function (response) {
                        localStorageService.set("i18n.config", response.data);
                        i18n.config = response.data;
                        i18n.currentLanguage = i18n.config.default;
                        console.log(i18n);
                    })
                }
            }
        };
        return i18n;
    }
}());
