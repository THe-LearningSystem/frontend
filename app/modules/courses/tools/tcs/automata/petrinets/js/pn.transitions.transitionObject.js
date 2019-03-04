/**
 * Constructor for the transitionGroup
 * @param fromState
 * @param toState
 * @constructor
 */
autoSim.TransitionGroupPN = function (fromState, toState) {
    var self = this;
    
    autoSim.TransitionGroup.apply(this, arguments);

    /**
     * Creates a new Transition for override
     * @param id
     * @param inputSymbol
     */
    self.create = function (id, tokens) {
        return self[self.push(new autoSim.TransitionObjectPN(id, self.fromState, self.toState, tokens)) - 1];
    };
};
autoSim.TransitionGroupPN.prototype = Array.prototype;

/**
 * The transition object
 * @param id
 * @param fromState
 * @param toState
 * @param inputSymbol
 * @constructor
 */
autoSim.TransitionObjectPN = function (id, fromState, toState, tokens) {
    var self = this;
    self.id = id;
    self.fromState = fromState;
    self.toState = toState;
    self.tokens = tokens;
};