/**
 * Object for a single cell
 * @param color: Color in which it will be colored
 */
function cell(color) {
    var self = this;

    if (color) {
        self.color = color;
    } else {
        self.color = "#000000";
    }
}