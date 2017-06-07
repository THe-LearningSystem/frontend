/**
 * Created by Sergej on 12.10.2016.
 */
var BANode = function(params){
    /* Datenstruktur für einen Baumknoten */
    this.value = params ? params.value : null;
    this.child1 = params ? params.child1 : null;
    this.child2 = params ? params.child2 : null;
    this.parent = params ? params.parent : null;
    this.clipInfo = params ? params.clipInfo : false;
    this.parent = null;
    this.group = params ? params.group : null;

    /*@Todo: G1 zu G₁ */

    this.isClips = function(){
        return this.clipInfo != null;
    };
    this.isValid = function(){
        return (this.child2 && this.child1);
    };
    this.isRoot = function(){
        return this.parent == null;
    };
    this.findChild = function(value){
        if (this.value == value) { return this; }
        var child = this.child2 ? this.child2.findChild(value) : null;
        if (child != null) {
            return child;
        }
        return this.child1 ? this.child1.findChild(value) : null;
    };
    this.getHtml = function(){
        /* Baum wird in HTML Code rekursiv knotenweise aufgelöst */
        var value = this.value;
        if (this.isLeaf()) {
            value = '<span class="expr">' + value + '</span>';
        } else if (!this.isRoot() && this.isGroup() || this.isRoot() && this.isGroup() && !this.child1 && !this.child2) {
            value = '<span class="expr group">' + value + '</span>';
        } else {
            var childA = this.child1 && this.child1.value != "" ? this.child1.getHtml() : '';
            var childB = this.child2 && this.child2.value != "" ? this.child2.getHtml() : '';

            var Class = '';
            if (value == SYMBOL_NEG) {
                Class = 'neg';
            }
            else if (IS_OPERATOR(value)) {
                Class = 'op';
            } else {
                Class = 'expr';
            }
            value = childA + '<span class="'+ Class +'">'+value+'</span>' + childB;
        }
        if (this.isClips()) {
            value = '<span class="clips">(</span>' + this.clipInfo.rootNode.getHtml() + '<span class="clips">)</span>';
        }
        return value;
    };
    this.isGroup = function(){
        return this.group != null;
    };
    this.isLeaf = function(){
        return !this.isGroup() && (!this.child2 || this.child2 == null || !this.child1 || this.child1 == null);
    };
    this.getLetters = function(){
        var letters = [];

        if (this.value == "") return letters;
        if (this.isClips() && this.clipInfo.rootNode) {
            letters.merge(this.clipInfo.rootNode.getLetters());
        }
        else if (this.isGroup() && !(this.child1 || this.child2)){
            letters.merge(this.group.expression.rootNode.getLetters());
        }
        else if (!this.isLeaf()) {
            letters.merge(this.child1.getLetters());
            letters.merge(this.child2.getLetters());
        } else {
            letters.merge(this.value);
        }

        return letters;
    };
    /* Erwartet param:= {A: 0, B: 1, C: 0} und liefert das Ergebnis für diesen Knoten */
    this.getResult = function(param) {
        var result = 0;
        if (this.isGroup() && !this.child2 && !this.child1) {
            result = this.group.expression.rootNode.getResult(param);
        } else if (this.isClips()) {
            result = this.clipInfo.rootNode.getResult(param);
        } else {
            if (IS_OPERATOR(this.value)) {
                var childA = this.child1.getResult(param);
                var childB = this.child2.getResult(param);

                if (this.child1.value == "") {
                    result = childB;
                } else if (this.child2.value == "") {
                    result = childA;
                }
                switch (this.value) {
                    case SYMBOL_AND:
                        result = childA == 1 && childB == 1;
                        break;
                    case SYMBOL_OR:
                        result = childA == 1 || childB == 1;
                        break;
                    case SYMBOL_IMPL:
                        result = (1 - childA) == 1 || childB == 1;
                        break;
                    case SYMBOL_EQUAL:
                        result = childA == childB;
                        break;
                    case SYMBOL_NEG:
                        result = 1 - result;
                        break;
                }
            } else {
                for (var key in param) {
                    if (param.hasOwnProperty(key)) {
                        if (key == this.value) {
                            result = Number(param[key]);
                        }
                    }
                }
            }
        }
        return result ? 1 : 0;
    };
};
function DEBUG_NODE(node) {
    if (node == null) return;
    console.log("====DEBUG: " + node.value + "========");
    console.log(node);
    console.log("isLeaf: " + node.isLeaf());
    console.log("isGroup: " + node.isGroup());
    console.log("isClips: " + node.isClips());
    console.log("====END DEBUG=============");
}