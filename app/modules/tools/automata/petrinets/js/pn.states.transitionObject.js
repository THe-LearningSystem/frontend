/**
 * Constructor for a transition object
 * @param id
 * @param name
 * @param x
 * @param y
 * @constructor
 */
autoSim.TransitionPn = function (id, name, x, y, place) {
    var self = this;
    self.id = id;
    self.name = name;
    self.x = x;
    self.y = y;
    self.place = place;
};