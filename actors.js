(function(ACTS){
    var rnd = Math.random;
    
    var eat = function(target){
        if(this.mass < target.mass) return;
        this.vx += target.vx * (target.mass / (target.mass + this.mass));
        this.vy += target.vy * (target.mass / (target.mass + this.mass));
        this.mass += target.mass;
        this.size += Math.sqrt(target.size) / 2;
        target.dying = true;
        target.mass = 0;
    };        
    
    var harvest = function(target){
        
    }

    ACTS.node = function(x, y, mass, vx, vy){
        this.type = 'node';
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.size = 100;
        this.draw = function(){};
        this.oncontact = function(){};
        this.range = 0;
        return this;
    };
    
    ACTS.planet = function(x, y, mass, vx, vy){
        var that = new ACTS.node(x, y, mass, vx, vy);
        that.type = 'planet';
        that.icon = new Image();
        that.s_icon = new Image();
        var ending = Math.floor(rnd() * 6) + '.png';
        that.icon.src = 'img/planet' + ending; 
        that.s_icon.src = 'img/s_planet' + ending;
        that.draw = FX.draw_icon;
        that.size = 2*Math.sqrt(mass);
        that.farlight = Infinity;
        that.lightangle = 0;
        that.oncontact = eat;
        that.range = that.size * 2 / 3;
        return that;
    }
    
    ACTS.star = function(x, y, mass, vx, vy){
        var that = new ACTS.node(x, y, mass, vx, vy);
        that.type = 'star';
        that.color_r = 100 + Math.floor(rnd() * 150);
        that.color_g = 100 + Math.floor(rnd() * 150);
        that.color_b = 100 + Math.floor(rnd() * 150);
        that.icon = new Image();
        that.icon.src = 'img/star.png';
        that.draw = FX.draw_star;
        that.size = 2*Math.sqrt(mass);
        that.oncontact = eat;
        that.range = that.size;
        return that;
    }
    
    ACTS.ship = function(x, y, mass, vx, vy){
        var that = new ACTS.node(x, y, mass, vx, vy);
        that.type = 'ship';
        that.icon = new Image();
        that.icon.src = 'img/rocket.png';
        that.rotation = -Math.PI/4;
        that.thrust = 0;
        that.draw = FX.draw_ship;
        that.range = 1000;
        that.oncontact = harvest;
        return that;
    }
    
    ACTS.gate = function(x, y, mass, vx, vy){
        var that = new ACTS.node(x, y, mass, vx, vy);
        that.type = 'gate';
        that.icon = new Image();
        that.icon.src = 'img/sprites.png';
        that.draw = FX.draw_gate;
        that.frame = 0;
        that.size = 128;
        return that;
    }
}
(window.ACTS = window.ACTS || {}));
