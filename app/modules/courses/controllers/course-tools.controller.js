(function () {
    'use strict';

    angular
        .module('courses')
        .controller('ToolsCtrl', ToolsCtrl);

    ToolsCtrl.$inject = ['$uibModal', '$scope', '$stateParams'];

    function ToolsCtrl($uibModal, $scope, $stateParams) {
        var vm = this;
        vm.courseUrl = $stateParams.courseUrl;
        vm.parentVm = $scope.$parent.vm;

        $scope.$parent.$watch('vm.course', function (data) {
            if (data) {
                vm.course = data;
            }
        });

        vm.createTool = function () {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/courses/views/tool.modal.view.html',
                controller: 'ToolModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {
                            course: vm.course
                        };
                    }
                }
            });
        };

        vm.updateTool = function (tool) {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/courses/views/tool.modal.view.html',
                controller: 'ToolModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {
                            course: vm.course,
                            tool: tool
                        };
                    }
                }
            });
        }
    }
}());
