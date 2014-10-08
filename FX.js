(function(FX){
    var canvas = document.getElementById("screen"),
        ctx = canvas.getContext("2d"),
        zoom = 10,
        pov = {track: 0, x: 0, y: 0};
        
    FX.setPov = function(e){
        var coords = e;//FX.relMouseCoords(e);
        pov.track = false;
        pov.x += (coords.x - FX.width/2) * zoom;
        pov.y += (coords.y - FX.height/2) * zoom;
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
    };
    
    FX.draw_star = function(){
        var scr = FX.translate_coords(this.x, this.y, this.size);
        ctx.beginPath();
        ctx.arc(scr.x, scr.y, scr.s*8, 0, 2*Math.PI);
        var grad = ctx.createRadialGradient(scr.x, scr.y, scr.s, scr.x, scr.y, scr.s*8);
        grad.addColorStop(0, 'rgba(' + this.color_r + ', ' + this.color_g + ', ' + this.color_b + ', 1.0)');
        grad.addColorStop(0.1, 'rgba(' + this.color_r + ', ' + this.color_g + ', ' + this.color_b + ', 0.3)');
        grad.addColorStop(1, 'rgba(' + this.color_r + ', ' + this.color_g + ', ' + this.color_b + ', 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();
    };

    FX.draw_ship = function(){
        var scr = FX.translate_coords(this.x, this.y, this.size);
        ctx.translate(scr.x, scr.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.icon, -20, -20, 40, 40);
        ctx.rotate(-this.rotation);
        ctx.translate(-scr.x, -scr.y);
    };

    FX.draw_ripple = function(r){
        var scr = FX.translate_coords(r.x, r.y, 0);
        ctx.strokeStyle = "#aadddd";
        ctx.beginPath();
        ctx.arc(scr.x, scr.y, r.age, 0, 2*Math.PI);
        ctx.stroke();
        r.age += 1;
    };
}
(window.FX = window.FX || {}));