(function(PHYS){
    
    PHYS.G = 20;
    
    PHYS.gravity = function(arr) {
        for(var i = 0; i < arr.length; i++){
            if(arr[i].type == 'planet') arr[i].farlight = Infinity;
            for(var j = 0; j < arr.length; j++){
                if(i == j) continue;
                var a = arr[i], b = arr[j];
                var dx = b.x - a.x,
                    dy = b.y - a.y,
                    far = Math.sqrt(dx * dx + dy * dy) + 1,
                    force = (PHYS.G * b.mass) / (far * far * far);
                a.vx += force * dx;
                a.vy += force * dy;
                if(far < a.range) a.oncontact(b);
                if(far < b.range) b.oncontact(a);
                if(b.type == 'star' && a.type == 'planet' && a.farlight > far){
                    a.lightangle = -Math.acos(dx/far);
                    if(dy < 0) a.lightangle *= -1;
                    a.farlight = far;
                }
            }
        }
    }
    
    PHYS.orbit = function(center, orbiter){
        var dx = center.x - orbiter.x,
            dy = center.y - orbiter.y,
            far = Math.sqrt(dx * dx + dy * dy),
            g =  (PHYS.G * center.mass * orbiter.mass) / (far * far ),
            V = Math.sqrt(g * far / orbiter.mass );
        if(Math.random() >= 0.5){
            orbiter.vx = center.vx + dy * V / far;
            orbiter.vy = center.vy - dx * V / far;
        }
        else{
            orbiter.vx = center.vx - dy * V / far;
            orbiter.vy = center.vy + dx * V / far;
            
        }
    };

}
(window.PHYS = window.PHYS || {}));