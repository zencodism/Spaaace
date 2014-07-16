(function(SC){
    
    var canvas = document.getElementById("ship"),
        ctx = canvas.getContext("2d"),
        shipicon = new Image()
        shipicon2 = new Image(),
        rotation = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shipicon.src = 'img/rocket.png';
    shipicon2.src = 'img/rocket-fire.png';
    ctx.translate(100, 100);

    SC.thrust = 0,
    SC.all_rotation = -Math.PI/4;
    
    SC.arrowsPressed = function(key){
        if(key.keyCode == 38) SC.thrust = 0.5;
        if(key.keyCode == 40) SC.thrust = -0.5;
        if(key.keyCode == 37) rotation = -0.05;
        if(key.keyCode == 39) rotation = 0.05;
        return false;
    };

    SC.arrowsReleased = function(key){
        if(key.keyCode == 38) SC.thrust = 0;
        if(key.keyCode == 40) SC.thrust = 0;
        if(key.keyCode == 37) rotation = 0;
        if(key.keyCode == 39) rotation = 0;
        return false;
    };

    SC.draw = function(){
        SC.all_rotation += rotation;
        ctx.fillStyle = "#666666";
        ctx.fillRect(-100, -100, 200, 200);
        ctx.rotate(rotation);
        if(SC.thrust)
            ctx.drawImage(shipicon2, -34, -34);
        else
            ctx.drawImage(shipicon, -34, -34);
    }
}
(window.SC = window.SC || {}));