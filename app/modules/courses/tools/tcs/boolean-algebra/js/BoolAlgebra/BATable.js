/**
 * Created by Sergej on 12.10.2016.
 */
var BATable = function(rootNode){
    var $this = this;
    this.letters = [];
    this.groups = BAGroup.groups;

    this.bits = [];

    this.isLoading = false;

    var searchLetter = function(node){
        if (!node || node.value == "") return false;
        if (node.isClips()) {
            searchLetter(node.clipInfo.rootNode);
        }
        else if (node.isGroup() && !(node.child1 || node.child2)){
            searchLetter(node.group.expression.rootNode);
        }
        else if (!node.isLeaf()) {
            searchLetter(node.child1);
            searchLetter(node.child2);
        } else {
            if ($this.letters.indexOf(node.value) < 0) {
                $this.letters.push(node.value);
            }

        }
    };

    this.build = function(node){
        this.isLoading = true;
        this.letters.clear();
        if (node){
            this.letters = node.getLetters();
        }
        tableIsDirty = true;
        this.isLoading = false;
    };
    this.build(rootNode);

    var tableIsDirty = true;
    this.updateView = function(){
        if (!tableIsDirty) return;
        this.isLoading = true;
        this.bits.clear();

        var lettersCount = this.letters.length;
        var max = Math.pow(2, lettersCount);

        for (var l = 0; l < max; l++) {
            var bitLine = { letters: [], groups: [], clips: [] };

            var lTemp = l;
            var valueObject = {};
            for (var i = lettersCount - 1; i >= 0; i--) {
                var letter = this.letters[lettersCount - 1 - i];
                var v = 0;
                var vTemp = Math.pow(2,i);

                if (lTemp >= vTemp) {
                    lTemp -= vTemp;
                    v = 1;
                }
                bitLine.letters.push({value: v});
                valueObject[letter] = v;
            }

            bitLine.param = valueObject;
            bitLine.result = {};

            this.bits.push(bitLine);
        }
        tableIsDirty = false;
        this.isLoading = false;
    };
};