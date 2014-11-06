var fpscount = document.getElementById("fps"),
    objcount = document.getElementById("objcount"),
    ripples = [],
    traces = [],
    frameId = NaN,
    dt,
    nextDT;

function init(){
    dt = Date.now();
    nextDT = dt + 200;
    CTRL.init_controls();
    S.init_world();
}

function gravity() {
    for(var i = 0; i < S.nodes.length; i++){
        for(var j = 0; j < S.nodes.length; j++){
            if(i == j) continue;
            var a = S.nodes[i], b = S.nodes[j];
            if(b.mass <= 1) continue;
            var dx = b.x - a.x,
                dy = b.y - a.y,
                far = Math.sqrt(dx * dx + dy * dy) + 1,
                force = (S.G * b.mass) / (far * far * far);
            a.vx += force * dx;
            a.vy += force * dy;
        }
    }
}

function main_loop() {
    FX.clear();
    frameId = requestAnimationFrame(main_loop);
    
    var ddt = Date.now() - dt;
    dt = Date.now();
    var fps = Math.ceil(200/ddt);
    var ship = S.nodes[S.shipindex];
        
    if(dt > nextDT){
        nextDT = dt + 200;
        gravity();    
//        S.nodes.forEach(function(node){
//            traces.push({x: node.x, y: node.y});
//        });
        
        if(ship.thrust){
            ship.vx += ship.thrust * Math.cos(ship.rotation);
            ship.vy += ship.thrust * Math.sin(ship.rotation);
            ripples.unshift({x: ship.x, y: ship.y, age: 0});
        }
        if(ripples.length > 40 || (ripples.length > 0 && ripples[ripples.length-1].age > 40)    ) ripples.pop();
        fpscount.innerHTML = "FPS: " + fps * 5;
        objcount.innerHTML = "Objects population: " + (S.nodes.length);
        document.getElementById("messages").innerHTML += dt + "<br/>";
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
    
//    for(var i = 0; i < traces.length; i++)
//        FX.draw_trace(traces[i]);
    
    
    s = CTRL.state(); 
    ship.rotation += s.rotation;
    ship.thrust = s.thrust;
}

window.onload = function(){
    init();
    main_loop();
}
