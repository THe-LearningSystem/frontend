(function () {
    'use strict';

    angular
        .module('admin.i18n')
        .controller('TranslationModalCtrl', TranslationModalCtrl);

    TranslationModalCtrl.$inject = ['$uibModalInstance', 'i18nService', 'data'];

    function TranslationModalCtrl($uibModalInstance, i18nService, data) {
        var vm = this;
        if (data !== undefined) {
            vm.moduleId = data.moduleId;
            vm.groupId = data.groupId;
            if (data.translation !== undefined) {
                vm._id = data.translation._id;
                vm.name = data.translation.name;
                vm.values = data.translation.values;
            }
        }

        i18nService.getConfig().then(function (response) {
            vm.languageConfig = response.data;
        });

        vm.create = function () {
            var data = {
                moduleId: vm.moduleId,
                groupId: vm.groupId,
                payload: {
                    name: vm.name,
                    values: vm.values
                }
            };
            i18nService.createTranslation(data);
            $uibModalInstance.close();
        };

        vm.update = function () {
            var data = {
                moduleId: vm.moduleId,
                groupId: vm.groupId,
                payload: {
                    _id: vm._id,
                    name: vm.name,
                    values: vm.values
                }
            };
            i18nService.updateTranslation(data);
            $uibModalInstance.close();
        };

        vm.delete = function () {
            var data = {
                moduleId: vm.moduleId,
                groupId: vm.groupId,
                payload: {
                    _id: vm._id,
                    name: vm.name,
                    values: vm.values
                }
            };
            i18nService.deleteTranslation(data);
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss({});
        };
    }
}());
