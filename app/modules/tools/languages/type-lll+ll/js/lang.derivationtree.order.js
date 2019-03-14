autoSim.LangDerivationtreeOrder = function (id, char, level, posX, posY, position, predecessor, ruleId) {
    var self = this;
    
    // Main information.
    self.id = id;
    self.char = char;
    
    // For creation of derivationtree.
    self.predecessor = predecessor;
    self.ruleId = ruleId;
    self.predecessorExists = false;
        
    // For drawing of the derivationtree.
    self.level = level;
    self.position = position;
    self.posX = posX;
    self.posY = posY;
};
