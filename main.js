import Boid from "./Boid.js";
import Obstacle from "./Obstacle.js";
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth*0.9;
canvas.height = window.innerHeight*0.9;
const ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
const boids = [];
const obstacles = [];
const population = 200;

const sepBar = document.getElementById("separation");
const aliBar = document.getElementById("alignment");
const cohBar = document.getElementById("cohesion");
const bButton = document.getElementById("boidsButton");
const oButton = document.getElementById("obstaclesButton");
const bodyButton = document.getElementById("bodyButton");

var addBoids = true;
var addObstacles = false;
var bodyEnabled = true;
var drag = false;

function init(){
    sepBar.value = 60;
    aliBar.value = 50;
    cohBar.value = 50;
    for (let i = 0; i < population; i++){
        boids.push(new Boid(Math.floor(Math.random() * width),Math.floor(Math.random() * height)))
    }
    window.requestAnimationFrame(update);
}

function update(){
    canvas.width = window.innerWidth*0.9;
    canvas.height = window.innerHeight*0.9;
    width = canvas.width;
    height = canvas.height
    ctx.clearRect(0,0,width,height);
    for (let b of boids){
        drawBoid(b);
        b.move();
        b.flock(boids, obstacles, 2*aliBar.value/100, 2*cohBar.value/100, 2*sepBar.value/100);
        b.x = ((b.x % width) + width) % width
        b.y = ((b.y % height) + height) % height
    }
    for(let o of obstacles){
        drawObstacle(o);
    }
    window.requestAnimationFrame(update);
}
function drawObstacle(o){
    ctx.strokeStyle = "rgb(255 255 255)";
    ctx.lineWidth = 2;
    ctx.strokeRect(o.left,o.top,o.right-o.left,o.bottom-o.top);
    ctx.lineWidth = 1;
}
function drawBoid(b){
    const size = 5;
    var angle = Math.atan(b.velY/b.velX)+Math.PI;
    if(b.velX<0){
        angle = Math.PI + angle;
    }
    var currentAngle = angle;
    var x = b.x;
    var y = b.y;
    
    if(bodyEnabled){
        //draw body
        ctx.strokeStyle = "rgb(255 255 255)";
        ctx.beginPath();
        ctx.moveTo(x,y);
        x += size * Math.cos(currentAngle);
        y += size * Math.sin(currentAngle);
        ctx.lineTo(x,y);
        currentAngle += 2/3 * Math.PI;
        x -= size * Math.cos(currentAngle);
        y -= size * Math.sin(currentAngle);
        ctx.lineTo(x,y);
        x = b.x;
        y = b.y;
        ctx.lineTo(x,y);
        currentAngle = angle;
        x += size * Math.cos(currentAngle);
        y += size * Math.sin(currentAngle);
        ctx.moveTo(x,y)
        currentAngle -= 2/3 * Math.PI;
        x -= size * Math.cos(currentAngle);
        y -= size * Math.sin(currentAngle);
        ctx.lineTo(x,y);
        ctx.lineTo(b.x,b.y);
        

        ctx.lineWidth = 1;
        ctx.stroke();
    } else{
        //draw head
        ctx.fillStyle = "rgb(255 255 255)";
        ctx.fillRect(b.x-2,b.y-2,4,4);
    }
    
    

}


bButton.onclick = function (){
    addBoids = true;
    addObstacles = false;
};
oButton.onclick = function (){
    addObstacles = true;
    addBoids = false;
};
bodyButton.onclick = function (){
    bodyEnabled = !bodyEnabled;
};
canvas.addEventListener("mousedown", function(e) {
    const rect = e.target.getBoundingClientRect();
    drag = true;
    if(addBoids){
        boids.push(new Boid(e.clientX - rect.left,e.clientY - rect.top));
    }
    if(addObstacles){
        obstacles.push(new Obstacle(e.clientX - rect.left,e.clientY - rect.top))
    }

});
canvas.addEventListener("mouseup", function(e) {
    drag = false;  
    if (obstacles.length > 0){
        if(obstacles[obstacles.length-1].right < obstacles[obstacles.length-1].left){
            let temp = obstacles[obstacles.length-1].right;
            obstacles[obstacles.length-1].right = obstacles[obstacles.length-1].left;
            obstacles[obstacles.length-1].left = temp;
        }
        if(obstacles[obstacles.length-1].bottom < obstacles[obstacles.length-1].top){
            let temp = obstacles[obstacles.length-1].bottom;
            obstacles[obstacles.length-1].bottom = obstacles[obstacles.length-1].top;
            obstacles[obstacles.length-1].top = temp;
        }
    }
});
canvas.addEventListener("mousemove", function(e) {
    if (drag){
        const rect = e.target.getBoundingClientRect();
        if(addBoids){
            boids.push(new Boid(e.clientX - rect.left,e.clientY - rect.top));
        }
        if(addObstacles){
            obstacles[obstacles.length-1].right = e.clientX - rect.left;
            obstacles[obstacles.length-1].bottom = e.clientY - rect.top;

        }
    }

});

canvas.addEventListener("touchstart", function(e) {
    const rect = e.target.getBoundingClientRect();
    drag = true;
    if(addBoids){
        boids.push(new Boid(e.touches[0].clientX - rect.left,e.touches[0].clientY - rect.top));
    }
    if(addObstacles){
        obstacles.push(new Obstacle(e.touches[0].clientX - rect.left,e.touches[0].clientY - rect.top))
    }

});
canvas.addEventListener("touchend", function(e) {
    drag = false;  
    if(obstacles.length > 0){
        if(obstacles[obstacles.length-1].right < obstacles[obstacles.length-1].left){
            let temp = obstacles[obstacles.length-1].right;
            obstacles[obstacles.length-1].right = obstacles[obstacles.length-1].left;
            obstacles[obstacles.length-1].left = temp;
        }
        if(obstacles[obstacles.length-1].bottom < obstacles[obstacles.length-1].top){
            let temp = obstacles[obstacles.length-1].bottom;
            obstacles[obstacles.length-1].bottom = obstacles[obstacles.length-1].top;
            obstacles[obstacles.length-1].top = temp;
        }
    }

});
canvas.addEventListener("touchmove", function(e) {
    if (drag){
        const rect = e.target.getBoundingClientRect();
        if(addBoids){
            boids.push(new Boid(e.touches[0].clientX - rect.left,e.touches[0].clientY - rect.top));
        }
        if(addObstacles){
            obstacles[obstacles.length-1].right = e.touches[0].clientX - rect.left;
            obstacles[obstacles.length-1].bottom = e.touches[0].clientY - rect.top;
        }
    }

});

init();
