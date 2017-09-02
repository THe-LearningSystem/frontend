autoSim.lessonTester = function ($scope, $rootScope, Courses, CustomNotify, Authentication) {
    "use strict";
    var self = this;

    self.testedLesson = false;
    self.failedLesson = false;

    self.checkLessonAndGoToNextLesson = function () {
        self.testedLesson = true;
        if ($scope.lessonData.data.questionType === 1) {
            self.checkType1();
        }
    };

    self.checkType1 = function () {

        var automaton = $scope.lessonData.data.automaton;
        self.acceptedInput = [];
        var acceptedInputString = automaton.automatonData.acceptedInputRaw;
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

        // $scope.rejectedInput = [];
        // var rejectedInputString = $scope.automatonData.rejectedInputRaw;
        // var rejectedInputArray = rejectedInputString.split("\n");
        //
        // _.forEach(rejectedInputArray, function (rejectedWord) {
        //     if (rejectedWord !== "") {
        //         var tmpObj = $scope.simulator.getSequences(rejectedWord);
        //         tmpObj.word = rejectedWord;
        //         $scope.rejectedInput.push(tmpObj);
        //     }
        // // })

        self.failedLesson = !isValid;
        if(isValid){
            self.goToNextLesson();
        }
        return isValid;
    };


    self.goToNextLesson = function () {
        console.log(self.failedLesson);
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
            if(!self.failedLesson)
            CustomNotify.success($rootScope.getTranslation('core.courses.passedLesson'));
            else
            CustomNotify.warning($rootScope.getTranslation('core.courses.notPassedLesson'));

        },false);
        $scope.parentScope.goToNextLesson();
    };


};



