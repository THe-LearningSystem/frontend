(function () {
    'use strict';

    angular
        .module('admin.i18n')
        .controller('I18nCtrl', I18nCtrl);

    I18nCtrl.$inject = ['i18nService', '$uibModal'];

    function I18nCtrl(i18nService, $uibModal) {
        var vm = this;
        i18nService.getConfig().then(function (response) {
            vm.languageConfig = response.data;
            i18nService.getAll().then(function (response) {
                vm.translationsModules = response.data;
                _.forEach(vm.translationsModules, function (translationModule) {
                    translationModule.translationsCount = 0;
                    translationModule.translationsCountDeep = 0;
                    _.forEach(translationModule.groups, function (group) {
                        translationModule.translationsCount += group.translations.length;
                        _.forEach(group.translations, function (translation) {
                            translationModule.translationsCountDeep += Object.size(translation.values);
                        });
                    });
                    if (translationModule.translationsCountDeep !== 0)
                        translationModule.translationsRatio = Math.round(((translationModule.translationsCountDeep /
                        (translationModule.translationsCount * vm.languageConfig.languages.length) ) * 100));
                    else
                        translationModule.translationsRatio = 100;
                });
            });
        });

        vm.createTranslationModule = function () {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/admin/i18n/views/translation-module.modal.view.html',
                controller: 'TranslationModuleModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return undefined;
                    }
                }
            });
        };
        vm.updateTranslationModule = function (module) {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/admin/i18n/views/translation-module.modal.view.html',
                controller: 'TranslationModuleModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return module
                    }
                }
            })
            ;
        };
    }
}());

