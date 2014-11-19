(function(FX){
    var canvas = document.getElementById("screen"),
        ctx = canvas.getContext("2d"),
        zoom = 8,
        pov = {track: 0, x: 0, y: 0},
        ship_canvas = document.getElementById("ship"),
        sctx = ship_canvas.getContext("2d"),
        shadow_canvas = document.getElementById("shadow"),
        shctx = shadow_canvas.getContext("2d"),
        shadow_icon = new Image();
    
    shadow_icon.src = 'img/shade.png';
    shctx.translate(400, 400);
    sctx.translate(100, 100);
        
    FX.setPov = function(e){
        var coords = canvas.relMouseCoords(e);
        pov.track = false;
        pov.x += (coords.x - canvas.width/2) * zoom;
        pov.y += (coords.y - canvas.height/2) * zoom;
        var min = {i: -1, val: Infinity};
        for(var i = 0; i < S.nodes.length; i++){
            var node = S.nodes[i];
            var far = Math.sqrt((node.x - pov.x)*(node.x-pov.x) + (node.y - pov.y)*(node.y-pov.y));
            if(far < min.val){
                min.i = i;
                min.val = far;
            }
        }
        if(min.val < 50*zoom){
            pov.track = S.nodes[min.i];
            pov.x = S.nodes[min.i].x;
            pov.y = S.nodes[min.i].y;
        }
    };
    
    FX.zoom_out = function(){
        zoom *= 2;
    };
    
    FX.zoom_in = function(){
        zoom /= 2;
    };
    
    FX.update_pov = function(){
        if(pov.track){
            pov.x = pov.track.x;
            pov.y = pov.track.y;
        }
    };
    
    FX.width = canvas.width;
    FX.height = canvas.height;
    
    FX.translate_coords = function(x, y, size){
        return {x: Math.floor((x - pov.x) / zoom + canvas.width/2) ,
                y: Math.floor((y - pov.y) / zoom + canvas.height/2) ,
                s : Math.floor(size / zoom + 2) };
    };

    FX.clear = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sctx.clearRect(-100, -100, 200, 200);
    };
    
    FX.draw_icon = function(){
        var scr = FX.translate_coords(this.x, this.y, this.size);
        shctx.clearRect(0, 0, 800, 800);
        shctx.drawImage(this.icon, -400, -400);
        shctx.rotate(-this.lightangle);
        shctx.drawImage(shadow_icon, -400, -400);
        shctx.rotate(this.lightangle);
        ctx.drawImage(shadow_canvas, scr.x - scr.s/2, scr.y - scr.s/2, scr.s, scr.s);
    };
    
    FX.draw_star = function(){
        var scr = FX.translate_coords(this.x, this.y, this.size);
        ctx.beginPath();
        ctx.arc(scr.x, scr.y, scr.s*2, 0, 2*Math.PI);
        var grad = ctx.createRadialGradient(scr.x, scr.y, scr.s/4, scr.x, scr.y, scr.s*2);
        grad.addColorStop(0, 'rgba(' + this.color_r + ', ' + this.color_g + ', ' + this.color_b + ', 0.6)');
        grad.addColorStop(0.1, 'rgba(' + this.color_r + ', ' + this.color_g + ', ' + this.color_b + ', 0.2)');
        grad.addColorStop(1, 'rgba(' + this.color_r + ', ' + this.color_g + ', ' + this.color_b + ', 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();
        
        ctx.drawImage(this.icon, scr.x - scr.s, scr.y - scr.s, 2*scr.s, 2*scr.s);
    };


    FX.draw_ship = function(){
        var scr = FX.translate_coords(this.x, this.y, this.size);
        sctx.rotate(this.rotation);
        sctx.drawImage(this.icon, -100, -100);
        sctx.rotate(-this.rotation);
        ctx.drawImage(ship_canvas, scr.x-scr.s/2, scr.y-scr.s/2, scr.s, scr.s);        
    };

    FX.draw_ripple = function(r){
        var scr = FX.translate_coords(r.x, r.y, 0);
        ctx.strokeStyle = "#aadddd";
        ctx.beginPath();
        ctx.arc(scr.x, scr.y, r.age, 0, 2*Math.PI);
        ctx.stroke();
        r.age += 1;
    };
    
    FX.draw_trace = function(t){
        var scr = FX.translate_coords(t.x, t.y);
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(scr.x, scr.y, 1, 1);
    };
}
(window.FX = window.FX || {}));