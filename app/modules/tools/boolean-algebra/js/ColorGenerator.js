/**
 * Created by Sergej on 16.01.2017.
 */
/* Generator für Farben */
var ColorGenerator = {
    counter: 0,
    value1: 137,
    value2: 0,
    generate: function(from, to){
        var color = Math.rnd(from, to);
        var rgb = [0,0,0];

        ColorGenerator.counter = ColorGenerator.counter > 2 ? 0 : ColorGenerator.counter + 1;
        var left = ColorGenerator.counter > 0 ? ColorGenerator.counter - 1 : 2;
        var right = ColorGenerator.counter < 3 ? ColorGenerator.counter + 1 : 0;

        rgb[ColorGenerator.counter] = color;
        rgb[left] = ColorGenerator.value1;
        rgb[right] = ColorGenerator.value2;

        var r = rgb[0].toString(16);
        var g = rgb[1].toString(16);
        var b = rgb[2].toString(16);
        if (r == "0") r = "00";
        if (g == "0") g = "00";
        if (b == "0") b = "00";

        return '#' + r + g + b;
    }
};