/**
 * Constructor for a state object
 * @param id
 * @param name
 * @param x
 * @param y
 * @constructor
 */
autoSim.Place = function (id, name, tokens, capacity, x, y, place) {
    var self = this;
    self.id = id;
    self.name = name;
    self.tokens = tokens;
    self.x = x;
    self.y = y;
    self.place = place;
    self.capacity = capacity;
};