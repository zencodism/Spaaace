(function(S){
    S.G = 0.02;
    S.nodes = [];
    S.masscount = 0;
    S.shipindex = 0;
    
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
        this.size = Math.sqrt(Math.sqrt(mass));
        this.draw = function(){};
        this.oncontact = function(){};
        return this;
    };
    
    function star(x, y, mass, vx, vy){
        var that = new node(x, y, mass, vx, vy);
        that.color_r = 150 + Math.floor(rnd() * 100);
        that.color_g = 150 + Math.floor(rnd() * 100);
        that.color_b = 150 + Math.floor(rnd() * 100);
        that.draw = FX.draw_star;
        that.oncontact = eat;
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
        S.nodes.push(new star(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*100000000, 0, 0));
        S.nodes.push(new star(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*1000000, 0, 0));
        S.nodes.push(new star(rnd() * 3200 - 1600, rnd() * 3200 - 1600, rnd()*1000000, 0, 0));
        S.shipindex = S.nodes.length;
        S.nodes.push(new ship(S.nodes[0].x - 400, S.nodes[0].y-400, 1, 2, 0, 0));
        put_on_orbit(S.nodes[0], S.nodes[1]);
        put_on_orbit(S.nodes[0], S.nodes[2]);
        put_on_orbit(S.nodes[0], S.nodes[3]);

        S.masscount = S.shipindex;
    };
}
(window.S = window.S || {}));