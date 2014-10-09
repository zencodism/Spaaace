var fpscount = document.getElementById("fps")
    , objcount = document.getElementById("objcount")
    , ripples = []
    , frameId = NaN
    , dt
    , tprev;

function init(){
    dt = Date.now();
    tprev = dt;
    CTRL.init_controls();
    S.init_world();
}

function calcDV(node){
    if(node.mass <= 0) return;
    for(var j = 0; j < S.masscount; j++){
        if(node == S.nodes[j]) continue;
        var a = node, b = S.nodes[j];
        if(b.mass <= 0) continue;
        var dx = b.x - a.x,
            dy = b.y - a.y,
            far = Math.sqrt(dx * dx + dy * dy);
        if(far < a.size+b.size)
        {
            a.oncontact(b); // affects both a and b
            continue;
        }
        var force = (S.G * a.mass * b.mass) / (far * far );
        a.lvx = a.vx;
        a.lvy = a.vy;
        a.vx += force * dx / far / a.mass;
        a.vy += force * dy / far / a.mass;
    }
}

function gravity() {
    for(var i = 0; i < S.nodes.length; i++){
        calcDV(S.nodes[i]);
    }
        
    for(var i = S.nodes.length-1; i >= 0; i--){  // cleanup of removed nodes
        if(S.nodes[i].mass <= 0){
            S.nodes.splice(i, 1);
            S.masscount --;
            S.shipindex --;
        }
    }
}

function main_loop() {
    FX.clear();
    frameId = requestAnimationFrame(main_loop);
    
    var ddt = Date.now() - dt;
    dt = Date.now();
    var fps = Math.floor(1000/ddt);
    var ship = S.nodes[S.shipindex];
        
    if(dt - tprev >= 200){
        tprev = dt;
        gravity();
        if(ship.thrust){
            ship.vx += ship.thrust * Math.cos(ship.rotation);
            ship.vy += ship.thrust * Math.sin(ship.rotation);
            ripples.unshift({x: ship.x, y: ship.y, age: 0});
        }
        if(ripples.length > 40 || (ripples.length > 0 && ripples[ripples.length-1].age > 40)    ) ripples.pop();
//        fpscount.innerHTML = "FPS: " + fps;
//        objcount.innerHTML = "Objects population: " + (S.nodes.length);
    }
    
    if(ship.thrust && !ripples.length)
        ripples.unshift({x: ship.x, y: ship.y, age: 0});
    
    FX.update_pov();

    for(var i = 0; i < ripples.length; i++)
        FX.draw_ripple(ripples[i]);

    S.nodes.forEach(function(node){
        node.x += node.vx / fps;
        node.y += node.vy / fps;
        node.draw();
    });
    s = CTRL.state(); 
    ship.rotation += s.rotation;
    ship.thrust = s.thrust;
}

window.onload = function(){
    init();
    main_loop();
}
