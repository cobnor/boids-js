import Boid from "./Boid.js";
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth*0.9;
canvas.height = window.innerHeight*0.9;
const ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
const boids = [];
const population = 500;

const sepBar = document.getElementById("separation");
const aliBar = document.getElementById("alignment");
const cohBar = document.getElementById("cohesion");


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
        b.flock(boids, 2*aliBar.value/100, 2*aliBar.value/100, 2*sepBar.value/100);
        b.x = ((b.x % width) + width) % width
        b.y = ((b.y % height) + height) % height
    }
    window.requestAnimationFrame(update);
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
    
    //head
    //ctx.fillStyle = "rgb(255 0 0)";
    //ctx.fillRect(b.x-2,b.y-2,4,4);

    // body
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
    

    //ctx.lineTo(10,10);
    ctx.lineWidth = 1;
    ctx.stroke();

}

init();