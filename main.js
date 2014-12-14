var fpscount = document.getElementById("fps"),
    objcount = document.getElementById("objcount"),
    messages = document.getElementById("messages"),
    ripples = [],
    traces = [],
    dt,
    nextDT;

window.frameId = NaN;

function init(){
    dt = Date.now();
    nextDT = dt + 200;
    CTRL.init_controls();
    LVL.init_world();
    document.getElementById("feeder").onclick = function(e){
        LVL.add_random_object();
        e.stopPropagation();
        return false;
    }
    document.getElementById("reset").onclick = function(e){
        document.getElementById("log").className = "";
        FX.reset_pov();
        init();
        main_loop();
        e.stopPropagation();
        return false;
    }
}

function main_loop() {
    FX.clear();
    FX.update_pov();
    window.frameId = requestAnimationFrame(main_loop);
    
    var ddt = Date.now() - dt;
    dt = Date.now();
    var fps = Math.ceil(200/ddt);
    var ship = LVL.nodes[LVL.shipindex];
        
    if(dt > nextDT){
        nextDT = dt + 200;
        PHYS.gravity(LVL.nodes); 
        LVL.clear_dead();
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
        objcount.innerHTML = "Objects population: " + (LVL.nodes.length);
        //messages.innerHTML = dt + "<br/>";
    }
    
    if(ship.thrust && !ripples.length)
        ripples.unshift({x: ship.x, y: ship.y, age: 0});
    
    for(var i = 0; i < ripples.length; i++)
        FX.draw_ripple(ripples[i]);

    FX.draw_frame(LVL.nodes);
    LVL.nodes.forEach(function(node){
        node.x += node.vx / fps;
        node.y += node.vy / fps;
    });
    
//    for(var i = 0; i < traces.length; i++)
//        FX.draw_trace(traces[i]);
    
    
    s = CTRL.state(); 
    ship.rotation += s.rotation;
    if(ship.rotation < 0) ship.rotation += 2*Math.PI;
    ship.rotation %= 2*Math.PI;
    ship.thrust = s.thrust;
}

window.onload = function(){
    init();
    main_loop();
}
