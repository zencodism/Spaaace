(function(FX){
    var canvas = document.getElementById("screen"),
        ctx = canvas.getContext("2d");
    
    FX.relMouseCoords = function(event){
        return canvas.relMouseCoords(event);
    }
    
    FX.width = canvas.width;
    FX.height = canvas.height;
    
    var translate_coords = function(x, y, size){
        return {x: Math.floor((x - pov.x) / zoom + canvas.width/2) ,
                y: Math.floor((y - pov.y) / zoom + canvas.height/2) ,
                s : Math.floor(size / zoom + 2) };
    };

    FX.clear = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    
    FX.draw_star = function(s){
        var scr = translate_coords(s.x, s.y, s.size);
        ctx.beginPath();
        ctx.arc(scr.x, scr.y, scr.s*4, 0, 2*Math.PI);
        var grad = ctx.createRadialGradient(scr.x, scr.y, scr.s, scr.x, scr.y, scr.s*4);
        grad.addColorStop(0, 'rgba(' + s.color_r + ', ' + s.color_g + ', ' + s.color_b + ', 1.0)');//"#f5fca8");//this.color);
        grad.addColorStop(0.3, 'rgba(' + s.color_r + ', ' + s.color_g + ', ' + s.color_b + ', 0.3)');
        grad.addColorStop(1, 'rgba(' + s.color_r + ', ' + s.color_g + ', ' + s.color_b + ', 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();
    };

    FX.draw_ship = function(s){
        var scr = translate_coords(s.x, s.y, s.size);
        ctx.fillStyle = this.color;
        ctx.fillRect(scr.x - scr.s/2, scr.y - scr.s/2, scr.s, scr.s);
    };

    FX.draw_ripple = function(r){
        var scr = translate_coords(r.x, r.y, 0);
        ctx.beginPath();
        ctx.arc(scr.x, scr.y, r.age, 0, 2*Math.PI);
        ctx.stroke();
        r.age+=2;
    };
}
(window.FX = window.FX || {}));