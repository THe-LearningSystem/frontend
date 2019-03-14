/**
 * Created by Sergej on 12.10.2016.
 */
var BAExpression = function(text) {
    var $this = this;
    this.rootNode = null;
    this.text = '';

    this.errors = [];

    this.clips = [];

    /* Priorität zum Auflösen des Baums */
    var priorSplit = [
        SYMBOL_EQUAL,
        SYMBOL_IMPL,
        SYMBOL_OR,
        SYMBOL_AND,
        SYMBOL_NEG
    ];
    var pushError = function(data){
        $this.errors.push(data);
    };
    var clearErrors = function(){
        $this.errors.length = 0;
    };
    var getClipByRaw = function(raw) {
        for (var i = 0; i < $this.clips.length; i++) {
            var c = $this.clips[i];
            if (raw == c.raw) {
                return c;
            }
        }
        return null;
    };
    /* Hole Klammern aus dem Ausdruck */
    var getClips = function(text) {
        var re = BAExpression.regex.clips;

        var found = 0, count = 0;
        while ( (match = re.exec(text)) !== null) {
            if (count++ >= 99999) {
                return false;
            }

            var m = match[0];
            var clip = getClipByRaw(m);
            found++;
            if (clip == null) {
                var mInside = m.substr(1, m.length - 2);
                var key = '[' + $this.clips.length + ']';

                clip = {
                    key: key,
                    text: mInside,
                    raw: m,
                    start: match.index,
                    end: re.lastIndex - 1
                };
                $this.clips.push(clip);
            }
        }

        var output = text;

        if (found > 0) {
            for (var i = 0; i < $this.clips.length; i++) {
                clip = $this.clips[i];
                output = output.replaceAll(clip.raw, clip.key);
            }
            var clipInfo = getClips(output);
            output = clipInfo.output;
        }

        return {input: text, output: output};
    };
    var tableBuffer = null;
    this.generateTable = function(){
        if (tableIsDirty) {
            tableBuffer = new BATable(this.rootNode);
            tableIsDirty = false;
        }
        return tableBuffer;
    };
    /* Teile nach Operator auf */
    var splitByOperator = function(text){
        for (var i = 0; i < priorSplit.length; i++) {
            var pS = priorSplit[i];

            var index = text.indexOf(pS);
            if (index > -1) {
                var sideA = text.substring(0,index);
                var sideB = text.substring(index+1,text.length);

                return {a: sideA, b: sideB, value: pS};
            }
        }
        return {a: null, b: null, value: text};
    };
    var getClipInfo = function(key) {
        if (key.length < 3) return null;
        for (var i = 0; i < $this.clips.length; i++) {
            var clip = $this.clips[i];
            if (clip.key == key) {
                return clip;
            }
        }
        return null;
    };
    this.onTextChanged = function(){
    };
    this.buildTree = function(text) {
        if (text == null) return null;
        var splitInfo = splitByOperator(text);

        /* Baue rekursiv den Binären Baum auf.
        Bei der Splitinfo liegen die Teilbauminformationen
        wonach rekursiv weiter geteilt wird, bis es nicht mehr geht */
        var node = new BANode({
            value: splitInfo.value,
            child1: this.buildTree(splitInfo.a),
            child2: this.buildTree(splitInfo.b)
        });

        if (node.isLeaf() && node.value != "") {
            var group = BAGroup.get(text);
            var clip = getClipInfo(text);
            if (clip) {
                clip.rootNode = this.buildTree(clip.text);
            }
            node.group = group;
            node.clipInfo = clip;
        }

        if (node.child1) {
            node.child1.parent = node;
        }
        if (node.child2) {
            node.child2.parent = node;
        }
        return node;
    };
    this.findChild = function(value) {
        return this.rootNode.findChild(value);
    };
    var matchError = function(text) {
        /* Erstes Zeichen ein Operator? Ausgenommen von Neg. */
        var tmpChar = text.charAt(0);
        if (tmpChar != SYMBOL_NEG && IS_OPERATOR(tmpChar)) {
            pushError({index: 0, value: tmpChar, text: "Syntaxerror: " + tmpChar + " at 0"});
        }
        /* letztes Zeichen ein Operator? */
        var idX = text.length - 1;
        tmpChar = text.charAt(idX);
        if (IS_OPERATOR(tmpChar)) {
            pushError({index: idX, value: tmpChar, text: "Syntaxerror: " + tmpChar + " at " + idX});
        }
        /* Regex Syntax Prüfung */
        var re = BAExpression.regex.error, match;
        while ((match = re.exec(text)) !== null) {
            var val = match[0];
            pushError({index: match.index, value: val, text: "Syntaxerror: " + val + " at " + match.index});
        }

        /* Klammer auf/zu Prüfung */
        var clipStack = [];
        for (var i = 0; i < text.length; i++) {
            var C = text.charAt(i);
            if (C != '(' && C != ')') continue;
            if (clipStack.length == 0) {
                clipStack.push({char: C, index: i});
                if (C == ')') break;
            } else {
                var L = clipStack[0];
                if (C == L.char) {
                    clipStack.push({char: C, index: i});
                } else {
                    clipStack.splice(0, 1);
                }
            }
        }
        if (clipStack.length > 0) {
            var c = clipStack[0];
            pushError({index: c.index, value: c.char, text: "Syntaxerror " });
        }
    };
    var hasErrors = function(text){
        clearErrors();
        matchError(text);
        return $this.errors.length > 0;
    };
    var tableIsDirty = true;
    this.parse = function(text) {
        text = text.trim().replaceAll(' ','').toUpperCase();
        this.text = text;

        if (hasErrors(text)) return;

        $this.clips.length = 0;
        var clipInfo = getClips(text);

        this.rootNode = this.buildTree(clipInfo.output);
        tableIsDirty = true;
        if (this.domain && this.domain.refreshKV) {
            this.domain.refreshKV(this);
        }
        this.onTextChanged(this.text);
    };
    if (text) {
        this.parse(text);
    }
    this.isValid = function(){
        return ($this.errors.length == 0);
    };
    this.getText = function(){
        return this.text;
    };
    this.getHtmlWithError = function(){
        var error = $this.errors[0];
        var bText = this.text.substr(0, error.index);
        var text = this.text.charAt(error.index);
        var aText = this.text.substr(error.index + 1);
        return (bText != '' ? '<span>'+bText+'</span>' : '') + (text != '' ? '<span class="error" title="'+error.text+'">'+text+'</span>' : '') + (aText != '' ? '<span>'+aText+'</span>' : '' );
    };
    this.getHtml = function(){
        return this.isValid() ? (this.rootNode ? this.rootNode.getHtml() : '') : this.getHtmlWithError();
    };
    this.groupFilter = function(group) {
        return this.text.replaceAll(group.getText(), group.key);
    };
    this.getResult = function(param){
        return this.rootNode.getResult(param);
    };
    this.useGroup = function(group) {
        var text = this.groupFilter(group);
        if (text != this.text) {
            this.parse(text);
            this.updateInput();
            return true;
        }
        return false;
    };
    this.unuseGroup = function(group) {
        var text = this.text.replaceAll(group.key, group.getText());
        if (text != this.text) {
            this.parse(text);
            this.updateInput();
            return true;
        }
        return false;
    };
    this.updateInput = function(){
        if (this.$input) {
            this.$input.html(this.getHtml());
        }
    };

    this.useAllGroups = function(){
        if (this.rootNode == null || this.rootNode.isGroup()) return false;
        for (var i = 0; i < BAGroup.groups.length; i++) {
            var g = BAGroup.groups[i];
            BAGroup.useGroup(this,g);
        }
    };
};

BAExpression.regex = {
    clips: /\([0|1|A-Z0-9|∨|∧|¬|⇒|⇔|\[\]]+\)/g,
    clipname: /([?[1-9]+]?)+/g,
    error: /[A-Za-z0-9]+\(+|\)([A-Za-z0-9]+|¬)|[0-9][A-Za-z]+|¬+(∨|∧|⇒|⇔)|(∨|∧|⇒|⇔)+(∨|∧|⇒|⇔)+|\(\)|\)\(|(∨|∧|⇒|⇔)+\)+|([A-Za-z]+¬+)/g,
    syntax: /(¬*([((A-Za-z)(1-9)*)|1|0])(∧|∨)?)*/g
};

BAExpression.validSyntax = function(text) {
    var forbChar = function(char){
        return char == SYMBOL_AND || char == SYMBOL_OR || char == SYMBOL_IMPL;
    };
    return !(forbChar(text.charAt(0)) || forbChar(text.charAt(text.length - 1)));
};

function REX(re, text) {
    var match = re.exec(text);
    console.log(match);
};