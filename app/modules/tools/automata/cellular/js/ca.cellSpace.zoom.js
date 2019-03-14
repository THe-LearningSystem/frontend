autoSim.CellSpaceZoom = function ($scope) {
    var vm = this;
    var zoom;

    /**
     * Zoomt eine Canvas-Stage zu der angegeben Zoomangabe
     * @param stage
     * @param zoom
     */
    vm.zoomTo = function (stage, zoom) {
        var currentZoom = stage.scaleX;
        stage.scaleX=stage.scaleY*=1/currentZoom;
        stage.scaleX=stage.scaleY*=zoom;

        stage.update();
    };

    /**
     * Zoomt in eine Canvas-Stage rein
     * @param stage
     */
    vm.zoomIn = function (stage) {
        var currentZoom = stage.scaleX;
        stage.scaleX = stage.scaleY *= 1/currentZoom;
        stage.scaleX = stage.scaleY *= currentZoom+0.05;

        stage.update();
    };

    /**
     * Zoomt aus einer Canvas-Stage raus
     * @param stage
     */
    vm.zoomOut = function (stage) {
        var currentZoom = stage.scaleX;
        stage.scaleX = stage.scaleY *= 1/currentZoom;
        stage.scaleX = stage.scaleY *= currentZoom-0.05;

        stage.update();
    };

    /**
     * Event das auf die Scrollbewegung der Maus reagiert und in Canvas-Stage rein- und rauszoomt
     * @param e
     * @constructor
     */
    function MouseWheelHandler(e) {
        var stage = $scope.cellSpace.stage;
        if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0)
            zoom = 1.1;
        else
            zoom = 1/1.1;
        var local = stage.globalToLocal(stage.mouseX, stage.mouseY);
        stage.regX=local.x;
        stage.regY=local.y;
        stage.x=stage.mouseX;
        stage.y=stage.mouseY;
        stage.scaleX=stage.scaleY*=zoom;

        stage.update();
    }

    $scope.cellSpace.canvas.addEventListener("mousewheel", MouseWheelHandler, false);
    $scope.cellSpace.canvas.addEventListener("DOMMousescroll", MouseWheelHandler, false);


    /**
     * Event, damit man mit der Maus die Canvas-Stage bewegen kann
     */
    $scope.cellSpace.stage.addEventListener("stagemousedown", function(e) {
        var stage = $scope.cellSpace.stage;
        var offset={x:stage.x-e.stageX,y:stage.y-e.stageY};
        stage.addEventListener("stagemousemove",function(ev) {
            stage.x = ev.stageX+offset.x;
            stage.y = ev.stageY+offset.y;
            stage.update();
        });
        stage.addEventListener("stagemouseup", function(){
            stage.removeAllEventListeners("stagemousemove");
        });
    });
};