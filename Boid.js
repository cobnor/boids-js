export default class Boid{
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
        
        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 8 - 3
        this.velX = speed*Math.cos(angle);
        this.velY = speed*Math.sin(angle);
        
        this.accX = 0;
        this.accY = 0;

        this.maxForce = 0.2;
        this.maxSpeed = 5;
    }
    withinDist(maxDist,x,y){
        if((this.x-x)*(this.x-x) + (this.y-y)*(this.y-y) <= maxDist * maxDist){
            return true
        }
        else{
            return false
        }
    }
    length(x,y){
        return Math.sqrt(x*x + y*y)
    }
    setMagnitude(x,y,m){
        const l = this.length(x,y);
        return [x / l * m, y / l * m];
    }
    move(){
        if(this.length(this.velX,this.velY) > this.maxSpeed){
            this.velX = this.setMagnitude(this.velX, this.velY, this.maxSpeed)[0];
            this.velY = this.setMagnitude(this.velX, this.velY, this.maxSpeed)[1];
        }
        this.x+=this.velX;
        this.y+=this.velY;
        this.velX += this.accX;
        this.velY += this.accY;
    }
    flock(boids, a, c, s){
        const align = this.alignment(boids,a);
        const cohere = this.cohesion(boids,c);
        const separate = this.separation(boids,s);
        this.accX = a*align[0] + c*cohere[0] + s*separate[0];
        this.accY = a*align[1] + c*cohere[1] + s*separate[1];
        //this.accX = separate[0];
        //this.accY = separate[1];

    }
    alignment(boids,a){ // apply force in direction of average position of local flockmates
        const localRadius = 50*a;
        var forceX = 0;
        var forceY = 0;
        var totalX = 0;
        var totalY = 0;
        var count = 0;
        
        for(let b of boids){
            if (b!=this && this.withinDist(localRadius,b.x,b.y)){
                totalX += b.velX;
                totalY += b.velY;
                count++;
            }
        }
        if (count > 0){
            forceX = totalX / count;
            forceY = totalY / count;
            
            forceX = this.setMagnitude(forceX, forceY, this.maxSpeed)[0] - this.velX;
            forceY = this.setMagnitude(forceX, forceY, this.maxSpeed)[1] - this.velY;

            if(this.length(forceX, forceY) > this.maxForce){
                forceX = this.setMagnitude(forceX, forceY, this.maxForce)[0];
                forceY = this.setMagnitude(forceX, forceY, this.maxForce)[1];
            }
        }
        return [forceX, forceY]
    }

    cohesion(boids,c){ // apply force in direction of average location of local flockmates
        const localRadius = 50*c;
        var forceX = 0;
        var forceY = 0;
        var totalX = 0;
        var totalY = 0;
        var count = 0;
        
        for(let b of boids){
            if (b!=this && this.withinDist(localRadius,b.x,b.y)){
                totalX += b.x;
                totalY += b.y;
                count++;
            }
        }
        if (count > 0){
            forceX = totalX / count;
            forceY = totalY / count;
            forceX -= this.x;
            forceY -= this.y;
            forceX = this.setMagnitude(forceX, forceY, this.maxSpeed)[0] - this.velX;
            forceY = this.setMagnitude(forceX, forceY, this.maxSpeed)[1] - this.velY;

            if(this.length(forceX, forceY) > this.maxForce){
                forceX = this.setMagnitude(forceX, forceY, this.maxForce)[0];
                forceY = this.setMagnitude(forceX, forceY, this.maxForce)[1];
            }
        }
        return [forceX, forceY]
    }

    separation(boids,s){ // apply force inversely proportional to distance to local flockmates
        const localRadius = 40*s;
        console.log(localRadius)
        var forceX = 0;
        var forceY = 0;
        var count = 0;
        
        for(let b of boids){
            if (b!=this && this.withinDist(localRadius,b.x,b.y)){
                let dist = Math.sqrt((this.x-b.x)*(this.x-b.x) + (this.y-b.y)*(this.y-b.y))
                forceX += (this.x-b.x)/dist;
                forceY += (this.y-b.y)/dist;
                count++;
            }
        }

        if (count > 0){
            //forceX /= count;
            //forceY /= count;
            forceX = this.setMagnitude(forceX, forceY, this.maxSpeed)[0] - this.velX;
            forceY = this.setMagnitude(forceX, forceY, this.maxSpeed)[1] - this.velY;

            if(this.length(forceX, forceY) > this.maxForce){
                forceX = this.setMagnitude(forceX, forceY, this.maxForce)[0];
                forceY = this.setMagnitude(forceX, forceY, this.maxForce)[1];
            }
        }
        return [forceX, forceY]
    }

}
