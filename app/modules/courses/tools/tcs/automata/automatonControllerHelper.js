function prepareLesson(data, parentScope, $scope) {
    $scope.parentScope = parentScope;
    $scope.lessonData = data;
    console.log($scope.lessonData);
    console.log(data);
    if (!_.isEmpty(data)) {
        var tmpObject = _.cloneDeep(data.data.automaton);
        if (data.data.questionType ===1) {
            $scope.automatonData.acceptedInputRaw = tmpObject.automatonData.hiddenAcceptedInputRaw;
            $scope.automatonData.rejectedInputRaw = tmpObject.automatonData.hiddenRejectedInputRaw;

            $scope.saveApply();
        } else if (data.data.questionType === 2) {
            $scope.saveApply();
        }
    }
}