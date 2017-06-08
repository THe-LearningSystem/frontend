function cell(color, isAlive) {
    var self = this;

    if (isAlive) {
        self.isALive = isAlive
    } else {
        self.isAlive = false;
    }

    if (color) {
        self.color = color;
    } else {
        self.color = "#000";

    }

    self.getNeighbours = function () {
        return false;
    };

    self.getLivingNeighbours = function () {

    };

    self.change = function (isAlive, color) {
        self.isALive = isAlive;
        self.color = color;
    };
}