(function(CTRL){
    
    var rotation = 0,
        thrust = 0,
        antigrav = false;
    
    var sound = new Audio('media/thrust.ogg');

    sound.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    
    arrowsPressed = function(key){
        if(key.keyCode == 38){
            thrust = 10;
            if(sound.paused) sound.play();
        }
        if(key.keyCode == 40){
            thrust = -10;
            if(sound.paused) sound.play();
        }
        if(key.keyCode == 37) rotation = -0.1;
        if(key.keyCode == 39) rotation = 0.1;
        if(key.keyCode == 32) antigrav = true;
        return false;
    };

    arrowsReleased = function(key){
        if(key.keyCode == 38){
            thrust = 0;
            if(!sound.paused) sound.pause();
        }                     
        if(key.keyCode == 40){
            thrust = 0;
            if(!sound.paused) sound.pause();
        }
        if(key.keyCode == 37) rotation = 0;
        if(key.keyCode == 39) rotation = 0;
        if(key.keyCode == 33) FX.zoom_out();
        if(key.keyCode == 34) FX.zoom_in();
        if(key.keyCode == 36) FX.reset_pov();
        if(key.keyCode == 32) antigrav = false;
        return false;
    };

    CTRL.state = function(){
        return { rotation: rotation, thrust: thrust, antigrav: antigrav };
    }
    
    zoom_handler = function(event){
        event.stopPropagation();
        //FX.setPov(event);
        var delta = 0;
        if (!event) event = window.event;
        // normalize the delta
        if (event.wheelDelta) {
            // IE and Opera
            delta = event.wheelDelta / 60;
        } else if (event.detail) {
            // W3C
            delta = -event.detail / 2;
        }
        if(delta < 0) FX.zoom_out();
        if(delta > 0) FX.zoom_in();
    }
    
    CTRL.init_controls = function(){
        document.onkeydown = arrowsPressed;
        document.onkeyup = arrowsReleased;
        document.onclick = FX.setPov;

        if(window.addEventListener) { document.addEventListener('DOMMouseScroll', zoom_handler, false); } 
        document.onmousewheel = zoom_handler;
    };
   
}
(window.CTRL = window.CTRL || {}));