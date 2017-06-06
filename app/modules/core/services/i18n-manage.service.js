(function () {
    'use strict';

    // Users service used for communicating with the users REST endpoint
    angular
        .module('core')
        .factory('I18nManager', I18nManager);

    I18nManager.$inject = ['localStorageService', 'i18nService'];

    function I18nManager(localStorageService, i18nService) {
        var i18n = {
            config: null,
            data: null,
            preferredLanguage: null,
            defaultLanguage: 'de',
            init: function () {
                // // i18n.data = localStorageService.get("i18n.data");
                // if (i18n.data === null) {
                //     i18nService.getAllSimplified().then(function (response) {
                //         localStorageService.set("i18n.data", response.data);
                //         i18n.data = response.data;
                //     });
                // }
                //
                // // i18n.config = localStorageService.get("i18n.config");
                // // i18n.preferredLanguage = i18n.config.default;
                // if (i18n.config === null) {
                //     i18nService.getConfig().then(function (response) {
                //         localStorageService.set("i18n.config", response.data);
                //         i18n.config = response.data;
                //     })
                // }
                i18n.preferredLanguage = localStorageService.get('i18n.preferredLanguage');
                if(i18n.preferredLanguage === null){
                    i18n.preferredLanguage = i18n.defaultLanguage;
                }
                return i18n;

            },
            loadData: function () {
                return i18nService.getAllSimplified()
                    .then(function (response) {
                        localStorageService.set("i18n.data", response.data);
                        i18n.data = response.data;
                        return i18n.data;
                    })
            },
            setData: function (data) {
                localStorageService.set("i18n.data", data);
                i18n.data = data;
            },
            loadConfig: function () {
                return i18nService.getConfig()
                    .then(function (response) {
                        localStorageService.set("i18n.config", response.data);
                        i18n.config = response.data;
                        return i18n.config;
                    })
            },
            setConfig: function (config) {
                localStorageService.set("i18n.config", config);
                i18n.config = config;
                // if (localStorageService.get('i18n.preferredLanguage') !== null) {
                //     i18n.preferredLanguage = i18n.config.default;
                // }
            },
            setPreferredLanguage: function (language) {
                localStorageService.set('i18n.preferredLanguage', language);
                i18n.preferredLanguage = localStorageService.get('i18n.preferredLanguage');
                // if(i18n.preferredLanguage === null){
                //     i18n.preferredLanguage = i18n.defaultLanguage;
                // }
            }
        };
        return i18n;
    }
}());
