(function () {
    'use strict';

    // Users service used for communicating with the users REST endpoint
    angular
        .module('app')
        .factory('I18nManager', I18nManager);

    I18nManager.$inject = ['localStorageService', '$rootScope',];

    function I18nManager(localStorageService, $rootScope) {
        var i18n = {
            config: null,
            data: null,
            preferredLanguage: null,
            defaultLanguage: 'de',
            init: function () {
                i18n.preferredLanguage = localStorageService.get('i18n.preferredLanguage');
                if (i18n.preferredLanguage === null) {
                    console.log(i18n.defaultLanguage);

                    i18n.preferredLanguage = i18n.defaultLanguage;
                    $rootScope.preferredLanguage = i18n.defaultLanguage;
                }
                return i18n;
            },
            loadData: function () {
            },
            setData: function (data) {
                localStorageService.set("i18n.data", data);
                i18n.data = data;
            },
            loadConfig: function () {
            },
            setConfig: function (config) {
                localStorageService.set("i18n.config", config);
                i18n.config = config;
            },
            setPreferredLanguage: function (language) {
                localStorageService.set('i18n.preferredLanguage', language);
                i18n.preferredLanguage = localStorageService.get('i18n.preferredLanguage');
                $rootScope.preferredLanguage = language;
            }
        };
        return i18n;
    }
}());
