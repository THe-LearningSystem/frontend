/**
 * Created by Sergej on 06.09.2016.
 */
var DomUtils = {
    getCaretPosition: function (editableDiv) {
        var caretPos = 0,
            sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                if (range.commonAncestorContainer.parentNode == editableDiv) {
                    caretPos = range.endOffset;
                }
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            if (range.parentElement() == editableDiv) {
                var tempEl = document.createElement("span");
                editableDiv.insertBefore(tempEl, editableDiv.firstChild);
                var tempRange = range.duplicate();
                tempRange.moveToElementText(tempEl);
                tempRange.setEndPoint("EndToEnd", range);
                caretPos = tempRange.text.length;
            }
        }
        return caretPos;
    },
    insertTextAtCursor: function (text) {
        var sel, range, html;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
                /*range.endOffset++;*/
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = text;
        }
    },
    pasteHtmlAtCaret: function (html, node) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                if (node && (range.startContainer.id != node.id || range.endContainer.id != node.id || range.startContainer.className != node.className || range.endContainer.className != node.className)) {
                    return false;
                }
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                if (lastNode == node) return;
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    },
    saveSelection: function () {
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    },
    restoreSelection: function (range) {
        if (range) {
            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && range.select) {
                range.select();
            }
        }
    },
    getSelectionStart: function() {
        return document.getSelection().getStartElement();
    },
    getCaretCharacterOffsetWithin: function(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    },
    setCaretPosition: function(element, offset) {
        var range = document.createRange();
        var sel = window.getSelection();

        //select appropriate node
        var currentNode = null;
        var previousNode = null;

        for (var i = 0; i < element.childNodes.length; i++) {
            //save previous node
            previousNode = currentNode;

            //get current node
            currentNode = element.childNodes[i];
            //if we get span or something else then we should get child node
            while(currentNode.childNodes.length > 0){
                currentNode = currentNode.childNodes[0];
            }

            if (currentNode)
            //console.log(currentNode.nodeValue);
            //calc offset in current node
            if (previousNode != null) {
                offset -= previousNode.length;
            }
            //check whether current node has enough length
            if (offset <= currentNode.length) {
                break;
            }
        }
        //move caret to specified offset
        if (currentNode != null) {
            if (currentNode.length < offset) {
                offset--;
            }
            try {
                range.setStart(currentNode, offset);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return true;
            } catch (e) {
            }
        }
        return false;
    },
    getSelectedText: function(withHtml) {
        var html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                if (withHtml) {
                    html = container.innerHTML;
                }
                else {
                    html = container.innerText;
                }
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                if (withHtml) {
                    html = document.selection.createRange().htmlText;
                } else {
                    html = document.selection.createRange().text;
                }
            }
        }
        return html;
    }
};
function IS_OPERATOR(char) {
    return char == SYMBOL_AND || char == SYMBOL_OR || char == SYMBOL_IMPL || char == SYMBOL_EQUAL || char == SYMBOL_NEG;
}
function HAS_OPERATOR(text) {
    for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i);
        if (IS_OPERATOR(char)) return true;
    }
    return false;
}
