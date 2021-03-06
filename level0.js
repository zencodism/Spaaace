(function(LVL){
    LVL.nodes = [];
    LVL.masscount = 0;
    LVL.shipindex = 0;
    
    var rnd = Math.random,
        rndint = function(x){ return Math.round(Math.random() * x) };
    
    LVL.init_world = function(){
        LVL.nodes = [];
        LVL.nodes.push(new ACTS.star(0, 0, 300000, 0, 0));
        LVL.nodes.push(new ACTS.planet(rndint(1600) + 1600, rndint(1600) + 1600, 10000, 0, 0));
        LVL.shipindex = LVL.nodes.length;
        LVL.nodes.push(new ACTS.ship(LVL.nodes[1].x+200, LVL.nodes[1].y-220, 1, 0, 0));
        PHYS.orbit(LVL.nodes[0], LVL.nodes[1]);
        PHYS.orbit(LVL.nodes[1], LVL.nodes[2]);
        LVL.masscount = LVL.shipindex;
        for(var i = 0; i < 5; i++)
            LVL.add_checkpoint();
    };
    
    LVL.end = function(msg){
        cancelAnimationFrame(window.frameId);
        document.getElementById("messages").innerHTML = "<p>" + msg + "</p>";
        document.getElementById("log").className = "extended";
    }
    
    
    LVL.add_checkpoint = function(){
        var ind = LVL.nodes.length;
        LVL.nodes.push(new ACTS.check(rndint(3200) - 1600, rndint(3200) - 1600, 0, 0));
        PHYS.orbit(LVL.nodes[0], LVL.nodes[ind]);
    }
    
    LVL.add_random_object = function(){
        if(rnd() > 0.7)
            LVL.nodes.push(new ACTS.star(rnd() * 6400 - 3200, rnd() * 6400 - 3200, 10000 + rnd()*500000, rnd()*100-50, rnd()*100-50));
        else
            LVL.nodes.push(new ACTS.planet(rnd() * 6400 - 3200, rnd() * 6400 - 3200, 1000 + rnd()*10000, rnd()*100-50, rnd()*100-50));
    }
    
    LVL.clear_dead = function(){
        var tmp = [],
            checkpoints = 0;
        for(var i = 0; i < LVL.nodes.length; i++){
            var node = LVL.nodes[i];
            if(node.dying){
                node.size /= 2;
                if(node.size < 10){
                    node.dead = true;
                    if(node.type == "star" || node.type == "planet")
                        LVL.masscount --;
                    if(node.type == "ship"){
                        LVL.end("Your ship was destroyed in violent crash.");
                    }
                }
            }
            if(!node.dead){
                if(node.type == 'ship') LVL.shipindex = tmp.length;
                if(node.type == 'check') checkpoints ++;
                tmp.push(node);
            }
            
        }
        if(checkpoints == 0)
            LVL.end("All checkpoints cleared. Congratulations!");
        LVL.nodes = tmp;
    }
                
                
}
(window.LVL = window.LVL || {}));