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
            },
            loadData:function(){
                return i18nService.getAllSimplified()
                    .then(function(response){
                        i18n.data = response.data;
                       return i18n;
                    })
            },
            loadConfig:function(){
                return i18nService.getConfig()
                    .then(function(response){
                        i18n.config = response.data;
                        return i18n;
                    })
            }
        };
        return i18n;
    }
}());
