(function(S){
    S.G = 100;
    S.nodes = [];
    S.masscount = 0;
    S.shipindex = 0;
    var rnd = Math.random;
    
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
    };        

    function node(x, y, mass, vx, vy){
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
        that.icon = new Image();
        that.icon.src = 'img/planet' + Math.floor(rnd() * 5) + '.png';
        that.draw = FX.draw_icon;
        that.size = mass;
        return that;
    }
    
    function star(x, y, mass, vx, vy){
        var that = new node(x, y, mass, vx, vy);
        that.color_r = 100 + Math.floor(rnd() * 150);
        that.color_g = 100 + Math.floor(rnd() * 150);
        that.color_b = 100 + Math.floor(rnd() * 150);
        that.icon = new Image();
        that.icon.src = 'img/star.png';
        that.draw = FX.draw_star;
        that.size = 2*Math.sqrt(mass);
        //that.oncontact = eat;
        return that;
    }
    
    function ship(x, y, mass, vx, vy){
        var that = new node(x, y, mass, vx, vy);
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
        orbiter.vx += dy * V / far;
        orbiter.vy -= dx * V / far;
// optional. Works weird with little mass difference
//        V2 =  Math.sqrt(g * far / center.mass);
//        center.vx -= dy * V2 / far;
//        center.vy += dx * V2 / far;
    };
    
    S.init_world = function(){
        S.nodes.push(new star(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*300000, 0, 0));
        S.nodes.push(new star(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*100000, 0, 0));
        S.nodes.push(new planet(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*200, 0, 0));
        S.nodes.push(new planet(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*200, 0, 0));
        S.shipindex = S.nodes.length;
        S.nodes.push(new ship(S.nodes[1].x - 200, S.nodes[1].y-200, 1, 2, 0, 0));
        S.nodes.push(new star(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*100000, 0, 0));
        S.nodes.push(new star(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*100000, 0, 0));
        S.nodes.push(new planet(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*200, 0, 0));
        S.nodes.push(new planet(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*200, 0, 0));
        S.nodes.push(new planet(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*200, 0, 0));
        put_on_orbit(S.nodes[0], S.nodes[1]);
        put_on_orbit(S.nodes[0], S.nodes[2]);
        put_on_orbit(S.nodes[1], S.nodes[3]);
        put_on_orbit(S.nodes[1], S.nodes[4]);

        S.masscount = S.shipindex;
    };
}
(window.S = window.S || {}));