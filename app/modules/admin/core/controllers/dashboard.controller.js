(function () {
    'use strict';

    angular
        .module('admin.core')
        .controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['i18nService'];

    function DashboardCtrl(i18nService) {
        var vm = this;
        vm.i18n = {};
        i18nService.getConfig().then(function (response) {
            vm.i18n.languageConfig = response.data;
            vm.i18n.translationsCount = 0;
            vm.i18n.translationsCountDeep = 0;
            i18nService.getAll().then(function (response) {
                vm.i18n.translationsModules = response.data;
                _.forEach(vm.i18n.translationsModules, function (translationModule) {
                    _.forEach(translationModule.groups, function (group) {
                        vm.i18n.translationsCount += group.translations.length;
                        _.forEach(group.translations, function (translation) {
                            vm.i18n.translationsCountDeep += Object.size(translation.values);
                        });
                    });
                });
                if (vm.i18n.translationsCountDeep !== 0)
                    vm.i18n.translationsRatio = Math.round(((  vm.i18n.translationsCountDeep /
                    (  vm.i18n.translationsCount * vm.i18n.languageConfig.languages.length) ) * 100));
                else
                    vm.i18n.translationsRatio = 100;
                console.log(vm.i18n);
            });
        });
    }
}());

