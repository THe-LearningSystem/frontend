(function () {
    'use strict';

    angular
        .module('admin.i18n')
        .controller('TranslationGroupModalCtrl', TranslationGroupModalCtrl);

    TranslationGroupModalCtrl.$inject = ['$uibModalInstance', 'i18nService', 'data'];

    function TranslationGroupModalCtrl($uibModalInstance, i18nService, data) {
        var vm = this;
        if (data !== undefined) {
            vm.moduleId = data.moduleId;
            if (data.group !== undefined) {
                vm._id = data.group._id;
                vm.name = data.group.name;
                vm.description = data.group.description;
            }
        }

        vm.create = function () {
            var data = {
                moduleId: vm.moduleId,
                payload: {
                    name: vm.name,
                    description: vm.description
                }
            };
            i18nService.createTranslationGroup(data);
            $uibModalInstance.close();
        };

        vm.update = function () {
            var data = {
                moduleId: vm.moduleId,
                groupId: vm._id,
                payload: {
                    _id: vm._id,
                    name: vm.name,
                    description: vm.description
                }
            };
            i18nService.updateTranslationGroup(data);
            $uibModalInstance.close();
        };

        vm.delete = function () {
            var data = {
                moduleId: vm.moduleId,
                groupId: vm._id
            };
            i18nService.deleteTranslationGroup(data);
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss({});
        };
    }
}());
