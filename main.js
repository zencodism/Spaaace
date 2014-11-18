var fpscount = document.getElementById("fps"),
    objcount = document.getElementById("objcount"),
    messages = document.getElementById("messages"),
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
    document.getElementById("feeder").onclick = function(e){
        S.add_random_object();
        e.stopPropagation();
        return false;
    }
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
            if(far / 2 > a.size + b.size){
                a.oncontact(b);
            }
            if(b.type == 'star' && a.type == 'planet'){
                a.lightangle = -Math.acos(dx/far);
                if(dy < 0) a.lightangle *= -1;
            }
        }
    }
}

function main_loop() {
    FX.clear();
    FX.update_pov();
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
        //messages.innerHTML = dt + "<br/>";
    }
    
    if(ship.thrust && !ripples.length)
        ripples.unshift({x: ship.x, y: ship.y, age: 0});
    
    for(var i = 0; i < ripples.length; i++)
        FX.draw_ripple(ripples[i]);

    S.nodes.forEach(function(node){
        node.draw();
        node.x += node.vx / fps;
        node.y += node.vy / fps;
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
