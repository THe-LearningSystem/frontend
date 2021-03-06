autoSim.lessonTester = function ($scope, $rootScope, Courses, CustomNotify, Authentication) {
    "use strict";
    var self = this;

    self.testedLesson = false;
    self.failedLesson = false;

    self.checkLessonAndGoToNextLesson = function () {
        self.testedLesson = true;
        if ($scope.lessonData.data.questionType === 1 || $scope.lessonData.data.questionType === 2) {
            self.bulkTest();
        }
    };

    self.bulkTest = function () {
        var automaton = $scope.lessonData.data.automaton;
        self.acceptedInput = [];
        var acceptedInputString = automaton.automatonData.hiddenAcceptedInputRaw;
        if (acceptedInputString) {
            var acceptedInputArray = acceptedInputString.split("\n");
            var isValid = true;
            _.forEach(acceptedInputArray, function (acceptedWord) {
                if (acceptedWord !== "") {
                    var tmpObj = $scope.simulator.getSequences(acceptedWord);
                    if (!tmpObj.possible) {
                        isValid = false;
                    }
                    tmpObj.word = acceptedWord;
                    self.acceptedInput.push(tmpObj);
                }
            });
        }


        self.rejectedInput = [];
        var rejectedInputString = automaton.automatonData.hiddenRejectedInputRaw;
        if (rejectedInputString) {
            var rejectedInputArray = rejectedInputString.split("\n");
            _.forEach(rejectedInputArray, function (rejectedWord) {
                if (rejectedWord !== "") {
                    var tmpObj = $scope.simulator.getSequences(rejectedWord);
                    if (tmpObj.possible) {
                        isValid = false;
                    }
                    tmpObj.word = rejectedWord;
                    self.rejectedInput.push(tmpObj);
                }
            });
        }

        self.failedLesson = !isValid;
        if (isValid) {
            self.goToNextLesson();
        }
        return isValid;
    };

    self.goToNextLesson = function () {
        var data = {
            courseId: $scope.parentScope.course._id,
            userId: Authentication.user._id,
            lessonId: $scope.parentScope.lessonId,
            payload: {
                _id: $scope.parentScope.lessonId,
                passed: !self.failedLesson
            }
        };
        Courses.addPassedLessonToUser(data, function () {
            if (!self.failedLesson)
                CustomNotify.success($rootScope.getTranslation('core.courses.passedLesson'));
            else
                CustomNotify.warning($rootScope.getTranslation('core.courses.notPassedLesson'));
        }, false);
        setTimeout($scope.parentScope.goToNextLesson, 800);
    };


};



