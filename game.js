
var fpscount = document.getElementById("fps")
    , objcount = document.getElementById("objcount")
    , zoom = 10
    , pov = {track: 0, x: 0, y: 0}
    , G = 0.0002
    , nodes = []
    , masscount = 0
    , shipindex = 0
    , ripples = []
    , frameId = NaN
    , rnd = Math.random
    , dt
    , framecounter = 0
    , poshistory = []
    , predictions = [];


function resetView(zoom_factor){
    zoom *= zoom_factor;
}

var setPov = function(e){
    var coords = FX.relMouseCoords(e);
    pov.track = false;
    pov.x += (coords.x - FX.width/2) * zoom;
    pov.y += (coords.y - FX.height/2) * zoom;
    var min = {i: -1, val: Infinity};
    for(var i = 0; i < nodes.length; i++){
        var node = nodes[i];
        var far = Math.sqrt((node.x - pov.x)*(node.x-pov.x) + (node.y - pov.y)*(node.y-pov.y));
        if(far < min.val){
            min.i = i;
            min.val = far;
        }
    }
    if(min.val < 50*zoom){
        pov.track = nodes[min.i];
        pov.x = nodes[min.i].x;
        pov.y = nodes[min.i].y;
    }
};

var eat = function(a){
    if(this.mass == 1 || a.mass == 1) return;
    var winner, other;
    if(this.mass > a.mass){
        winner = this;
        other = a;
    }
    else{
        winner = a;
        other = this;
    }
    winner.x += other.x * (other.mass / (other.mass + winner.mass));
    winner.y += other.y * (other.mass / (other.mass + winner.mass));
    winner.mass += other.mass;
    winner.size += Math.sqrt(other.size);
    other.mass = 0;
    other.size = 0;
}        

function node(x, y, mass, size, vx, vy, color, draw){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.lvx = vx;
    this.lvy = vy;
    this.mass = mass;
    this.size = Math.sqrt(Math.sqrt(mass));
    this.color = color;
    this.color_r = 50 + Math.floor(rnd() * 200);
    this.color_g = 50 + Math.floor(rnd() * 200);
    this.color_b = 50 + Math.floor(rnd() * 200);
    this.draw = draw;
    this.encounter = eat;
}

function init(){
    dt = Date.now();
    //nodes.push(new node(0, 0, 500, rnd()*20, 100, 0, "#f5fca8", draw_star));
    nodes.push(new node(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*100000000, rnd()*20, 0, 0, "#f5fca8", FX.draw_star));
    //nodes.push(new node(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*1000000, rnd()*20, 0, 0, "#f5fca8", draw_star));
    //nodes.push(new node(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*1000000, rnd()*20, 0, 0, "#f5fca8", draw_star));
    shipindex = nodes.length;
    nodes.push(new node(nodes[0].x - 400, nodes[0].y-400, 1, 2, 0, 0, "#8888ff", FX.draw_ship));
    put_on_orbit(nodes[0], nodes[1]);
    //put_on_orbit(nodes[0], nodes[2]);
    //put_on_orbit(nodes[0], nodes[3]);
    
    masscount = shipindex;
    
    document.getElementById("zoom_minus").onclick = function(){resetView(2); return false;};
    document.getElementById("zoom_plus").onclick = function(){resetView(0.5); return false;};
    document.getElementById("ship").onkeydown = SC.arrowsPressed;
    document.getElementById("ship").onkeyup = SC.arrowsReleased;
    document.getElementById("screen").onclick = setPov;
}

function calcDV(node){
    if(node.mass <= 0) return;

    for(var j = 0; j < masscount; j++){
        if(node == nodes[j]) continue;
        var a = node, b = nodes[j];
        if(b.mass <= 0) continue;
        var dx = b.x - a.x,
            dy = b.y - a.y,
            far = Math.sqrt(dx * dx + dy * dy);
        if(far < a.size+b.size)
        {
            a.encounter(b); // affects both a and b
            continue;
        }
        var force = (G * a.mass * b.mass) / (far * far );
        a.lvx = a.vx;
        a.lvy = a.vy;
        a.vx += force * dx / far / a.mass;
        a.vy += force * dy / far / a.mass;
    }
}

function gravity() {
    for(var i = 0; i < nodes.length; i++){
        calcDV(nodes[i]);
    }
        
    for(var i = nodes.length-1; i >= 0; i--){  // cleanup of removed nodes
        if(nodes[i].mass <= 0){
            nodes.splice(i, 1);
            masscount --;
        }
    }
}

function put_on_orbit(center, orbiter){
    var dx = center.x - orbiter.x,
        dy = center.y - orbiter.y,
        far = Math.sqrt(dx * dx + dy * dy),
        g =  (G * center.mass * orbiter.mass) / (far * far ),
        V = Math.sqrt(g * far / orbiter.mass );
    orbiter.vx += dy * V / far;
    orbiter.vy -= dx * V / far;
    // optional. Works weird with little mass difference
    V2 =  Math.sqrt(g * far / center.mass);
    center.vx -= dy * V2 / far;
    center.vy += dx * V2 / far;
}

function main_loop() {
    var ddt = Date.now() - dt;
    dt = Date.now();
    var fps = 0;
    FX.clear();
    frameId = requestAnimationFrame(main_loop);
    
    framecounter++;
    fps = Math.floor(1000/ddt);
    if(framecounter >= fps){
        framecounter = 1;
        fpscount.innerHTML = "FPS: " + fps;
        objcount.innerHTML = "Objects population: " + (nodes.length);
    }
    var ship = nodes[shipindex];
        
    if(framecounter % 6 == 0){
            
        if(SC.thrust != 0){
            ship.vx += SC.thrust * Math.cos(SC.all_rotation);
            ship.vy += SC.thrust * Math.sin(SC.all_rotation);
            ripples.unshift({x: ship.x, y: ship.y, age: 0});
        }
        if(ripples.length > 40 || (ripples.length > 0 && ripples[ripples.length-1].age > 40)    ) ripples.pop();
    }
    
    gravity();
    
    if(pov.track){
        pov.x = pov.track.x;
        pov.y = pov.track.y;
    }

    for(var i = 0; i < ripples.length; i++)
        FX.draw_ripple(ripples[i]);

    
//    var lmod = Math.sqrt(ship.lvx * ship.lvx + ship.lvy * ship.lvy);
//    var lang = Math.atan(ship.lvy / ship.lvx);
//    if(ship.lvx < 0) lang += Math.PI;
//    
//    var mod = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
//    var ang = Math.atan(ship.vy / ship.vx);
//    if(ship.vx < 0) ang += Math.PI;
//    var dmod = mod - lmod;
//    var dang = ang - lang;
//    var tmpx = ship.x;
//    var tmpy = ship.y;
//    var tmpvx = ship.vx;
//    var tmpvy = ship.vy;
//    var tmpmod = Math.sqrt(tmpvx*tmpvx+tmpvy*tmpvy);
//    var tmpang = Math.atan(tmpvy / tmpvx);
//    if(tmpvx < 0) tmpang += Math.PI;
//            
//    for(var i = 0; i < 50; i++){
//        tmpmod = Math.sqrt(tmpvx*tmpvx+tmpvy*tmpvy);
//        tmpang = Math.atan(tmpvy / tmpvx);
//        if(tmpvx < 0) tmpang += Math.PI;
//        tmpmod += dmod;
//        tmpang += zoom*dang;
//        tmpvx = tmpmod * Math.cos(tmpang);
//        tmpvy = tmpmod * Math.sin(tmpang);
//        tmpx += zoom*tmpvx;
//        tmpy += zoom*tmpvy;
//        h = {x: tmpx, y: tmpy};
//        var sx = (h.x - pov.x) / zoom + canvas.width/2 ,  // scaled position and size
//        sy = (h.y - pov.y) / zoom + canvas.height/2;
//        ctx.fillRect(sx, sy, 1, 1);
//    }
    
    nodes.forEach(function(node){
        node.x += node.vx; //node.posx[0] + ((node.posx[1] - node.posx[0]) * (framecounter / fps));
        node.y += node.vy; //node.posy[0] + ((node.posy[1] - node.posy[0]) * (framecounter / fps));;
        node.draw(node);
    });
    SC.draw(); 
}

window.onload = function(){
    init();
    main_loop();
}
