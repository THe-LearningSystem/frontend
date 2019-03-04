autoSim.LangCheckInformationObject = function (string, idArray, pos) {
    var self = this;

    self.string = string;
    self.steps = idArray;
    self.position = pos;

    self.appliedRules = [];
    self.treeOrderArray = [];
    self.positionValues = [];

    /**
     * Creates an new Object, which stores the apllied rules.
     * @param {[[Type]]} index  [[Description]]
     * @param {[[Type]]} ruleId [[Description]]
     */
    self.addAppliedRule = function (index, ruleId) {
        var newObject = {
            index: index,
            ruleId: ruleId
        };
        self.appliedRules.push(newObject);
    };

    self.applyPositionIds = function () {
        var newA = [];

        _.forEach(self.position, function (array) {

            _.forEach(array, function (value) {

                if (!_.includes(newA, value)) {
                    newA.push(value);
                }
            });
        });
        self.positionValues = _.sortBy(newA, []);
    };
};
