angular.module('courses.tcs').directive("bulkTest", function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    link: function(scope, elm, attrs) {

      scope.parent = scope.$parent;
      scope.$parent.core.updateListeners.push(scope);
      scope.acceptedInput = [];
      scope.rejectedInput = [];

      /**
       * executes the bulkTest
       */
      scope.bulkTest = function() {
        if (scope.parent.automatonData.type === "TM") {
          scope.testAcceptedInputsTM();
        } else {
          scope.testAcceptedInputs();
        }
        scope.testRejectedInputs();
      };

      /**
       * prepares the acceptedInput
       */
      scope.testAcceptedInputs = function() {
        scope.acceptedInput = [];
        var acceptedInputString = scope.parent.automatonData.acceptedInputRaw;
        var acceptedInputArray = acceptedInputString.split("\n");

        _.forEach(acceptedInputArray, function(acceptedWord) {
          if (acceptedWord !== "") {
            var tmpObj = scope.$parent.simulator.getSequences(acceptedWord);
            tmpObj.word = acceptedWord;
            scope.acceptedInput.push(tmpObj);
          }
        })
      };

      /**
       * Function for testing inputWords for a turing machine
       * @return {[type]} [description]
       */
      scope.testAcceptedInputsTM = function() {
        scope.acceptedInput = [];
        var acceptedInputString = scope.parent.automatonData.acceptedInputRaw;
        var acceptedInputArray = acceptedInputString.split("\n");

        _.forEach(acceptedInputArray, function(acceptedWord) {
          if (acceptedWord !== "") {
            var tmpObj = scope.$parent.simulator.getSequences(acceptedWord);
            // console.log(tmpObj);
            tmpObj.word = acceptedWord;
            scope.acceptedInput.push(tmpObj);
          }
        })
      };

      /**
       * prepares the rejectedInput
       */
      scope.testRejectedInputs = function() {
        scope.rejectedInput = [];
        var rejectedInputString = scope.parent.automatonData.rejectedInputRaw;
        var rejectedInputArray = rejectedInputString.split("\n");

        _.forEach(rejectedInputArray, function(rejectedWord) {
          if (rejectedWord !== "") {
            var tmpObj = scope.$parent.simulator.getSequences(rejectedWord);
            tmpObj.word = rejectedWord;
            scope.rejectedInput.push(tmpObj);
          }
        })
      };

      /**
       * updateFunction for the Listener
       */
      scope.updateFunction = function() {
        scope.bulkTest();
      };

      if (scope.parent.automatonData.acceptedInputRaw !== "" || scope.parent.automatonData.rejectedInputRaw != "")
        scope.bulkTest();


      scope.$watch('automatonData.acceptedInputRaw', function() {
        scope.bulkTest();
      });
      scope.$watch('automatonData.rejectedInputRaw', function() {
        scope.bulkTest();
      });

    },
    templateUrl: 'modules/courses/tools/tcs//automata/directives/bulkTest/bulk-test.html'
  };
});
