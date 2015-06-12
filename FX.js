(function(FX){
    var canvas = document.getElementById("screen"),
        ctx = canvas.getContext("2d"),
        pov = {track: 0, x: 0, y: 0},
        ship_canvas = document.getElementById("ship"),
        sctx = ship_canvas.getContext("2d"),
        shadow_canvas = document.getElementById("shadow"),
        shctx = shadow_canvas.getContext("2d"),
        shadow_icon = new Image(),
        s_shadow_icon = new Image();
    
    shadow_icon.src = 'img/shade.png';
    s_shadow_icon.src = 'img/s_shade.png';
    shctx.translate(400, 400);
    sctx.translate(100, 100);
    
    FX.zoom = 8;
    
    FX.setPov = function(e){
        var coords = canvas.relMouseCoords(e);
        pov.track = false;
        pov.x += (coords.x - canvas.width/2) * FX.zoom;
        pov.y += (coords.y - canvas.height/2) * FX.zoom;
        var min = {i: -1, val: Infinity};
        for(var i = 0; i < LVL.nodes.length; i++){
            var node = LVL.nodes[i];
            var far = Math.sqrt((node.x - pov.x)*(node.x-pov.x) + (node.y - pov.y)*(node.y-pov.y));
            if(far < min.val){
                min.i = i;
                min.val = far;
            }
        }
        if(min.val < 50 * FX.zoom){
            pov.track = LVL.nodes[min.i];
            pov.x = LVL.nodes[min.i].x;
            pov.y = LVL.nodes[min.i].y;
        }
    };
    
    FX.reset_pov = function(){
        pov = {track: 0, x: 0, y: 0};
        //zoom = 8;
    }
        
    FX.zoom_out = function(){
        FX.zoom *= 2;
    };
    
    FX.zoom_in = function(){
        FX.zoom /= 2;
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
        return {x: Math.round((x - pov.x) / FX.zoom + canvas.width/2) ,
                y: Math.round((y - pov.y) / FX.zoom + canvas.height/2) ,
                s : Math.round(size / FX.zoom + 1) };
    };

    FX.clear = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sctx.clearRect(-100, -100, 200, 200);
    };
    
    FX.draw_icon = function(scr){
        shctx.clearRect(-400, -400, 800, 800);
        if(scr.s > 100){
            shctx.drawImage(this.icon, -400, -400, 800, 800);
            shctx.rotate(-this.lightangle);
            shctx.drawImage(shadow_icon, -400, -400, 800, 800);
            shctx.rotate(this.lightangle);
            ctx.drawImage(shadow_canvas, scr.x - scr.s/2, scr.y - scr.s/2, scr.s, scr.s);
        }
        else{
            shctx.drawImage(this.s_icon, -50, -50, 100, 100);
            shctx.rotate(-this.lightangle);
            shctx.drawImage(s_shadow_icon, -50, -50, 100, 100);
            shctx.rotate(this.lightangle);
            ctx.drawImage(shadow_canvas, 350, 350, 100, 100, scr.x - scr.s/2, scr.y - scr.s/2, scr.s, scr.s);
        }
    };
    
    FX.draw_gate = function(scr){
        ctx.drawImage(this.icon, scr.x - scr.s/2, scr.y - scr.s/2, scr.s, scr.s);
//        ctx.drawImage(this.icon, 128*this.frame, 0, 128, 128, scr.x - scr.s/2, scr.y - scr.s/2, scr.s, scr.s);
//        this.frame ++;
//        this.frame %= 30;
    };
    
    FX.draw_star = function(scr){
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


    FX.draw_ship = function(scr){
        ctx.beginPath();
        ctx.moveTo(scr.x, scr.y);
        ctx.arc(scr.x, scr.y, this.range / FX.zoom, this.rotation-0.3, this.rotation+0.3);
        ctx.lineTo(scr.x, scr.y);
        var grad = ctx.createRadialGradient(scr.x, scr.y, 1, scr.x, scr.y, this.range / FX.zoom);
        grad.addColorStop(0, this.color + ', 0.4)');
        grad.addColorStop(1, this.color + ', 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();
        
//        sctx.rotate(this.rotation);
//        sctx.drawImage(this.icon, -100, -100);
//        sctx.rotate(-this.rotation);
//        ctx.drawImage(ship_canvas, scr.x-scr.s/2, scr.y-scr.s/2, scr.s, scr.s);
        ctx.fillRect(scr.x - 1, scr.y - 1, 2, 2)
        
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
    
    FX.draw_frame = function(arr){
        for(var i = 0; i < arr.length; i++){
            var scr = FX.translate_coords(arr[i].x, arr[i].y, arr[i].size);
            if(scr.x > -scr.s && scr.x > -scr.s && scr.x < canvas.width + scr.s && scr.y < canvas.height + scr.s)
                arr[i].draw(scr);
        }
    }
}
(window.FX = window.FX || {}));