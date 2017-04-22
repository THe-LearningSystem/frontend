(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = [ 'Authentication'];

  function HeaderController( Authentication) {
    var vm = this;

    vm.authentication = Authentication;

  }
}());
