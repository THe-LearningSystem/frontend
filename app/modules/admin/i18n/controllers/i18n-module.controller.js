(function () {
    'use strict';

    //http://stackoverflow.com/questions/5223/length-of-a-javascript-object
    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
    angular
        .module('admin.i18n')
        .controller('I18nModuleCtrl', I18nModuleCtrl);

    I18nModuleCtrl.$inject = ['$stateParams', 'i18nService', '$uibModal'];

    function I18nModuleCtrl($stateParams, i18nService, $uibModal) {
        var vm = this;
        i18nService.getConfig().then(function (response) {
            vm.languageConfig = response.data;
            i18nService.get($stateParams.moduleId).then(function (response) {
                vm.module = response.data;
                _.forEach(vm.module.groups, function (group) {
                    group.translationsCount = group.translations.length;
                    group.translationsCountDeep = 0;
                    _.forEach(group.translations, function (translation) {
                        group.translationsCountDeep += Object.size(translation.values);
                    });
                    if (group.translationsCountDeep !== 0)
                        group.translationsRatio = Math.round(((group.translationsCountDeep / (group.translationsCount * vm.languageConfig.languages.length) ) * 100));
                    else
                        group.translationsRatio = 100;
                });
            });
        });


        vm.createTranslationGroup = function () {
            $uibModal.open({
                templateUrl: '/modules/admin/i18n/views/translation-group.modal.view.html',
                controller: 'TranslationGroupModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {
                            moduleId: vm.module._id
                        };
                    }
                }
            });
        };
        vm.updateTranslationGroup = function (moduleId, group) {
            $uibModal.open({
                templateUrl: '/modules/admin/i18n/views/translation-group.modal.view.html',
                controller: 'TranslationGroupModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {
                            moduleId: vm.module._id,
                            group: group
                        }
                    }
                }
            });
        };
    }
}());

