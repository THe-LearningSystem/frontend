/**
 * Created by Sergej on 18.01.2017.
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
Array.prototype.merge = function(A) {
    if (Array.isArray(A)) {
        for (var i = 0; i < A.length; i++) {
            var a = A[i];
            if (this.indexOf(a) < 0) {
                this.push(a);
            }
        }
    } else {
        if (this.indexOf(A) < 0) {
            this.push(A);
        }
    }
};
Array.prototype.contains = function(obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
Array.prototype.toggleObject = function(obj){
    for (var i = 0; i < this.length; i++) {
        if (this[i] == obj) {
            this.splice(i, 1);
            return -1;
        }
    }
    this.push(obj);
    return 1;
};
Array.prototype.remove = function(obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == obj) {
            this.splice(i, 1);
        }
    }
};
Array.prototype.clear = function() {
    if (this.length == 0) return;
    this.splice(0, this.length);
};
Array.prototype.clone = function() {
    return this.slice(0);
};
String.prototype.countChar = function(char) {
    if (this.length == 0) return 0;
    var count = 0;
    for (var i = 0; i < this.length; i++) {
        var ch = this.charAt(i);
        if (ch == char) {
            count++;
        }
    }
    return count;
};
Math.isPowerOfTwo = function(number) {
    var n2 = number - 1;
    return ( (number != 0) && ((number & n2) == 0));
};

Math.rnd = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
Math.previousPowerOfTwo = function(x) {
    if (x == 0) {
        return 0;
    }
    x |= (x >> 1);
    x |= (x >> 2);
    x |= (x >> 4);
    x |= (x >> 8);
    x |= (x >> 16);
    return x - (x >> 1);
};