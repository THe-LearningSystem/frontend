/**
 * Created by Sergej on 12.10.2016.
 */

var BAGroup = function(text){
    this.expression = new BAExpression(text);
    //this.expression.rootNode.group = this;
    this.key = BAGroup.getNextGroupIndex(text);
    this.number = BAGroup.groupIndex - 1;
    this.expression.groupKey = this.key;

    this.isValid = function(){
        return this.expression.isValid();
    };
    this.getHtml = function(){
        return this.expression.getHtml();
    };
    this.getText = function(){
        return this.expression.text;
    };
};
BAGroup.groups = [];
BAGroup.groupIndex = 1;
BAGroup.getNextGroupIndex = function(text){
    for (var i = 0; i < BAGroup.groups.length; i++) {
        var group = BAGroup.groups[i];
        if (group.text == text) {
            return group.key;
        }
    }
    return 'G' + BAGroup.groupIndex++;
};
BAGroup.get = function(key){
    var vKey = key.replace(SYMBOL_NEG, '');
    if (vKey.length < 2) return null;
    for (var i = 0; i < BAGroup.groups.length; i++) {
        var group = BAGroup.groups[i];
        if (vKey == group.key) {
            return group;
        }
    }
    return null;
};
BAGroup.add = function(group) {
    BAGroup.groups.push(group);
};
BAGroup.useGroup = function(mainExpr, group){
    mainExpr.useGroup(group);

    for (var i = 0; i < BAGroup.groups.length; i++) {
        var g = BAGroup.groups[i];
        if (g.key == group.key) continue;
        g.expression.useGroup(group);
    }
};