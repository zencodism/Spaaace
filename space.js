(function(S){
    S.G = 20;
    S.nodes = [];
    S.masscount = 0;
    S.shipindex = 0;
    var rnd = Math.random;
    
    var eat = function(a){
        //if(this.mass == 1 || a.mass == 1) return;
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
    };        

    function node(x, y, mass, vx, vy){
        this.type = 'node';
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.size = 100;
        this.draw = function(){};
        this.oncontact = function(){};
        return this;
    };
    
    function planet(x, y, mass, vx, vy){
        var that = new node(x, y, mass, vx, vy);
        that.type = 'planet';
        that.icon = new Image();
        that.icon.src = 'img/planet' + Math.floor(rnd() * 6) + '.png';
        that.draw = FX.draw_icon;
        that.size = 2*Math.sqrt(mass);
        that.farlight = Infinity;
        that.lightangle = 0;
        return that;
    }
    
    function star(x, y, mass, vx, vy){
        var that = new node(x, y, mass, vx, vy);
        that.type = 'star';
        that.color_r = 100 + Math.floor(rnd() * 150);
        that.color_g = 100 + Math.floor(rnd() * 150);
        that.color_b = 100 + Math.floor(rnd() * 150);
        that.icon = new Image();
        that.icon.src = 'img/star.png';
        that.draw = FX.draw_star;
        that.size = 2*Math.sqrt(mass);
      //  that.oncontact = eat;
        return that;
    }
    
    function ship(x, y, mass, vx, vy){
        var that = new node(x, y, mass, vx, vy);
        that.type = 'ship';
        that.icon = new Image();
        that.icon.src = 'img/rocket.png';
        that.rotation = -Math.PI/4;
        that.thrust = 0;
        that.draw = FX.draw_ship;
        return that;
    }
    
    function put_on_orbit(center, orbiter){
        var dx = center.x - orbiter.x,
            dy = center.y - orbiter.y,
            far = Math.sqrt(dx * dx + dy * dy),
            g =  (S.G * center.mass * orbiter.mass) / (far * far ),
            V = Math.sqrt(g * far / orbiter.mass );
        orbiter.vx = center.vx + dy * V / far;
        orbiter.vy = center.vy -dx * V / far;
    };
    
    S.init_world = function(){
        S.nodes.push(new star(rnd() * 3200 - 1600, rnd() * 3200 - 1600, 300000, 0, 0));
        S.nodes.push(new planet(S.nodes[0].x+2500, S.nodes[0].y-1940, 5000, 0, 0));
        S.shipindex = S.nodes.length;
        S.nodes.push(new ship(S.nodes[1].x+100, S.nodes[1].y-120, 0.2, 0, 0));
        put_on_orbit(S.nodes[0], S.nodes[1]);
        put_on_orbit(S.nodes[1], S.nodes[2]);
        S.masscount = S.shipindex;
    };
    
    S.add_random_object = function(){
        if(rnd() > 0.7)
            S.nodes.push(new star(rnd() * 6400 - 3200, rnd() * 6400 - 3200, 10000 + rnd()*500000, rnd()*100-50, rnd()*100-50));
        else
            S.nodes.push(new planet(rnd() * 6400 - 3200, rnd() * 6400 - 3200, 1000 + rnd()*10000, rnd()*100-50, rnd()*100-50));
    }
}
(window.S = window.S || {}));
