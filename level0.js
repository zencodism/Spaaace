(function(LVL){
    LVL.nodes = [];
    LVL.masscount = 0;
    LVL.shipindex = 0;
    
    var rnd = Math.random;
    
    LVL.init_world = function(){
        LVL.nodes.push(new ACTS.star(rnd() * 3200 - 1600, rnd() * 3200 - 1600, 300000, 0, 0));
        LVL.nodes.push(new ACTS.planet(LVL.nodes[0].x+2500, LVL.nodes[0].y-1940, 5000, 0, 0));
        LVL.shipindex = LVL.nodes.length;
        LVL.nodes.push(new ACTS.ship(LVL.nodes[1].x+100, LVL.nodes[1].y-120, 1, 0, 0));
        PHYS.orbit(LVL.nodes[0], LVL.nodes[1]);
        PHYS.orbit(LVL.nodes[1], LVL.nodes[2]);
        LVL.masscount = LVL.shipindex;
        LVL.nodes.push(new ACTS.gate(LVL.nodes[2].x - 150, LVL.nodes[2].y + 100, 1, 0, 0));
        PHYS.orbit(LVL.nodes[1], LVL.nodes[3]);
        for(var i = 0; i < 30; i++)
            LVL.add_random_object();
    };
    
    LVL.add_random_object = function(){
        if(rnd() > 0.7)
            LVL.nodes.push(new ACTS.star(rnd() * 6400 - 3200, rnd() * 6400 - 3200, 10000 + rnd()*500000, rnd()*100-50, rnd()*100-50));
        else
            LVL.nodes.push(new ACTS.planet(rnd() * 6400 - 3200, rnd() * 6400 - 3200, 1000 + rnd()*10000, rnd()*100-50, rnd()*100-50));
    }
}
(window.LVL = window.LVL || {}));