load_second = function(LVL){
    LVL.nodes = [];
    LVL.masscount = 0;
    LVL.shipindex = 0;
    
    LVL.init_world = function(){
        LVL.nodes = [];
        LVL.nodes.push(new ACTS.star(0, 0, 300000, 0, 0));
        LVL.nodes.push(new ACTS.star(2000, 0, 300000, 0, 0));
        LVL.nodes.push(new ACTS.star(2000, 2000, 300000, 0, 0));
        LVL.nodes.push(new ACTS.star(4000, -2000, 300000, 0, 0));
        LVL.nodes.push(new ACTS.star(4000, -4000, 300000, 0, 0));
        LVL.shipindex = LVL.nodes.length;
        LVL.nodes.push(new ACTS.ship(LVL.nodes[0].x+500, LVL.nodes[0].y-500, 1, 0, 0));
        LVL.nodes.push(new ACTS.check(LVL.nodes[4].x+500, LVL.nodes[4].y-520, 0, 0));
        PHYS.orbit(LVL.nodes[0], LVL.nodes[1]);
        PHYS.orbit(LVL.nodes[1], LVL.nodes[2]);
        PHYS.orbit(LVL.nodes[2], LVL.nodes[3]);
        PHYS.orbit(LVL.nodes[3], LVL.nodes[4]);
        PHYS.orbit(LVL.nodes[0], LVL.nodes[5]);
        PHYS.orbit(LVL.nodes[4], LVL.nodes[6]);
        LVL.masscount = LVL.shipindex;
        
    };          
                
}