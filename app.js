//================= The Utils ========================//

class Utils {
    //  generate a random number
    static randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Used to generate random colors
    static randomColorRGB() {
        return (
            "rgb(" + this.randomNumber(0, 255) + 
            ", " + this.randomNumber(0, 255) + 
            ", " + this.randomNumber(0, 255) + 
            ")"
        );
    }


    // random color HSL
    static randomColorHSL(hue, saturation, lightness) {
        return (
            "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)" 
        );
    }
    
    // set gradient color
    static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
        const col = cr + "," + cg + "," + cb;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, "rgba(" + col + ", " + ca * 1 + ")");
        g.addColorStop(0.5, "rgba(" + col + ", " + ca * 0.5 + ")");
        g.addColorStop(1, "rgba(" + col + ", " + ca * 0 + ")");
        return g;
    }

    // create multiple arrays for the dots

    static createMultipleArray(number_one, number_two) {
        let num_one = number_one;
        let num_two = number_two;

        let arr = new Array(num_one);
        for (let i = 0; i < num_one; i++) {
            arr[i] = new Array(num_one);
            for (let j = 0; j < num_two; j++) {
                arr[i][j] = 0;
            }
        }
        return arr;
    }
    // frame-rate
    static calcFPS() {
        const now = +new Date();
        const fps = 1000 / (now - lastTime);
        lastTime = now;
        return fps.toFixed();
    }
}

//==============================================//

// Vector 2d

class Vector2d {
    constructor(x, y) {
        this.vx = x;
        this.vy = y;
    }

    scale(scale) {
        this.vx *= scale;
        this.vy *= scale;
    }

    mult(v) {
        return new Vector2d(this.vx * v, this.vy * v);
    }

    add(v, x, y) {
        if (v instanceof Vector2d) {
            return new Vector2d(this.vx + v.vx, this.vy + v.vy);
        } else {
            this.vx += x;
            this.vy += y;
        }
    }

    sub(v, x, y) {
        if (v instanceof Vector2d) {
            return new Vector2d(this.vx - v.vx, this.vy - v.vy);
        } else {
            this.vx -= x;
            this.vy -= y;
        }
    }

    fromAngle(radian) {
        this.vx = Math.cos(radian);
        this.vy = Math.sin(radian);
    }

    negate() {
        this.vx = -this.vx;
        this.vy = -this.vy;
    }

    length() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    lengthSquared() {
        return this.vx * this.vx + this.vy * this.vy;
    }

    normalize() {
        let len = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (len) {
            this.vx /= len;
            this.vy /= len;
        }
        return len;
    }

    rotate(angle) {
        let vx = this.vx;
        let vy = this.vy;
        let cosVal = Math.cos(angle);
        let sinVal = Math.sin(angle);
        this.vx = vx * cosVal - vy * sinVal;
        this.vy = vx * sinVal + vy * cosVal;
    }

    toString() {
        return '(' + this.vx.toFixed(3) + ',' + this.vy.toFixed(3) + ')';
    }
}

//==============================================//

// Collision 

class Collision {

    constructor(targetArr) {
        this.arr = targetArr;
    }

    collideAll() {
        let vec = new Vector2d(0, 0);
        let dist; 
        let obj1;
        let obj2;
        let c;
        let i;
        for (c = 0; c < this.arr.length; c++) {
            obj1 = this.arr[c];
            for (i = c + 1; i < this.arr.length; i++) {
                obj2 = this.arr[i];
                vec.vx = obj2.x - obj1.x;
                vec.vy = obj2.y - obj1.y;
                dist = vec.length();
                if (dist < obj1.r + obj2.r) {
                    vec.normalize();
                    vec.scale(obj1.r + obj2.r - dist);
                    vec.negate();
                    obj1.x += vec.vx;
                    obj1.y += vec.vy;
                    this.bounce(obj1, obj2);
                }
            }
        }
    }

    bounce(obj1, obj2) {
        let colnAngle = Math.atan2(obj1.y - obj2.y, obj1.x - obj2.x);
        let length1 = obj1.v.length();
        let length2 = obj2.v.length();
        let dirAngle1 = Math.atan2(obj1.v.vy, obj1.v.vx);
        let dirAngle2 = Math.atan2(obj2.v.vy, obj2.v.vx);
        let newVX1 = length1 * Math.cos(dirAngle1 - colnAngle);
        let newVX2 = length2 * Math.cos(dirAngle2 - colnAngle);
        obj1.v.vy = length1 * Math.sin(dirAngle1 - colnAngle);
        obj2.v.vy = length2 * Math.sin(dirAngle2 - colnAngle);
        obj1.v.vx = ((obj1.r - obj2.r) * newVX1 + 2 * obj2.r * newVX2) / (obj1.r + obj2.r);
        obj2.v.vx = ((obj2.r - obj1.r) * newVX2 + 2 * obj1.r * newVX1) / (obj1.r + obj2.r);
        obj1.v.rotate(colnAngle);
        obj2.v.rotate(colnAngle);
    }
}

//==============================================//

// stop watch

class Stopwatch {
    constructor(time) {
        this.startTime = 0;
        this.running = false;
        this.elapsed = undefined;
    }

    start() {
        this.startTime = +new Date();
        this.elapsedTime = null;
        this.running = true;
    }

    stop() {
        this.elapsed = +new Date() - this.startTime;
        this.running = false;
    }

    getElapsedTime() {
        if (this.running) {
            return +new Date() - this.startTime;
        } else {
            return this.elapsed;
        }
    }

    isRunning() {
        return this.running;
    }

    reset() {
        this.elapsed = 0;
    }
}

//==============================================//

// animationTimer

class AnimationTimer {
    constructor(duration, timeWarp) {
        if (duration !== undefined) this.duration = duration;
        if (timeWarp !== undefined) this.timeWarp = timeWarp;
        this.stopwatch = new Stopwatch();
    }

    start() {
        this.stopwatch.start();
    }

    stop() {
        this.stopwatch.stop();
    }

    getElapsedTime() {
        const elapsedTime = this.stopwatch.getElapsedTime();
        const percentComplete = elapsedTime / this.duration;
        if (!this.stopwatch.running) return undefined;
        if (this.timeWarp === undefined) return elapsedTime;
        return elapsedTime * (this.timeWarp(percentComplete) / percentComplete);
    }

    isRunning() {
        return this.stopwatch.running;
    }

    isOver() {
        return this.stopwatch.getElapsedTime() > this.duration;
    }

    makeEaseIn(strength) {
        return percentComplete => {
            return Math.pow(percentComplete, strength * 2);
        };
    }

    makeEaseOut(strength) {
        return percentComplete => {
          return 1 - Math.pow(1 - percentComplete, strength * 2);
        };
      } 
    
    makeEaseInOut() {
        return percentComplete => {
          return percentComplete - Math.sin(percentComplete * 2 * Math.PI) / (2 * Math.PI);
        };
    }
      
    makeElastic(passes) {
        passes = passes || default_elastic_passes;
        return percentComplete => {
          return (1 - Math.cos(percentComplete * Math.PI * passes)) * (1 - percentComplete) + percentComplete;
        };
    }
    
    makeBounce(bounces) {
        const fn = this.makeElastic(bounces);
        return percentComplete => {
          percentComplete = fn(percentComplete);
          return percentComplete <= 1 ? percentComplete : 2 - percentComplete;
        };
    }
    
    makeLinear() {
        return percentComplete => {
          return percentComplete;
        };
    }
}

//==============================================//

// angle

class Angle {
    constructor(angle) {
        this.a = angle;
        this.rad = this.a * Math.PI / 180;
    }

    incDec(num) {
        this.a += num;
        this.rad = this.a * Math.PI / 180;
    }
}

//==============================================//

// template

// global scope
let canvas;
// framerate number
let lastTime = 0;

// canvas

class Canvas {
    constructor(bool) {
        // create canvas
        this.canvas = document.createElement("canvas");

        // if on screen
        if (bool === true) {
            this.canvas.style.position = 'relative';
            this.canvas.style.display = 'block';
            this.canvas.style.backgroundColor = 'black';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            document.getElementsByTagName("body")[0].appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        // mouse information
        this.mouseX = null;
        this.mouseY = null;
        this.mouseZ = null;
        // dom
        this.sizeRange = document.getElementById('size');
        this.multiplySelect = document.getElementById('multiply');
        this.collisionCheckbox = document.getElementById('collision');
        this.numberOfShapesRange = document.getElementById('numberOfShapes');
        this.collisionCheckbox = document.getElementById('collision');

        // shapes
        this.number_of_shapes = this.numberOfShapesRange.value;
        this.shapesArray = [];

        // gravity point
        this.gravityArray = [];

        // timer
        this.timers = [];

        // collision
        this.coll = null;
    }

    // init, render, resize
    init() {
        for (let i = 0; i < this.number_of_shapes; i++) {
            const t = setTimeout(() => {
                const s = new Shape(this.ctx, this.width, this.height, i);
                this.shapesArray.push(s);
            }, i * 5);
            this.timers.push(t);
        }

        this.coll = new Collision(this.shapesArray);
    }

    render() {

        // this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = "darken";
        this.ctx.globalAlpha = 0.1;
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.globalAlpha = 1;
        for (let i = 0; i < this.gravityArray.length; i++) {
        this.gravityArray[i].render();
        }
        for (let i = 0; i < this.shapesArray.length; i++) {
        this.shapesArray[i].render();
        }
        if (this.collisionCheckbox.checked) this.coll.collideAll();
        //this.drawFPS();
        window.requestAnimationFrame(() => {
        this.render();
        });
    }

    drawFPS() {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(Utils.calcFPS() + ' FPS', this.width, this.height);
        ctx.restore();
    }
      
    mousemove(mouseX, mouseY) {
        for (let i = 0; i < this.shapesArray.length; i++) {
          this.shapesArray[i].mousemove(mouseX, mouseY);
        }
    }
      
    click() {
        const g = new Gravity(this.ctx, this.width, this.height);
        this.gravityArray.push(g);
    }
      
    change() {
        this.number_of_shapes = this.numberOfShapesRange.value;
        this.resize();
    }
      
    reset() {
        this.sizeRange.value = 2;
        this.multiplySelect.value = 'lighter';
        this.collisionCheckbox.checked = false;
        this.numberOfShapesRange.value = 500;
        this.number_of_shapes = this.numberOfShapesRange.value;
        this.resize();
    }
      
    resize() {
        if (this.timers.length) {
          for (let i = 0; i < this.timers.length; i++) {
            clearTimeout(this.timers[i]);
          }
        }
        this.gravityArray = [];
        this.shapesArray = [];
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.init();
    }
}

// Gravity Point Class

class Gravity {
    constructor(ctx, w, h, i) {
      this.ctx = ctx;
      this.init(w, h, i);
    }
    
    init(w, h, i) {
      this.w = w;
      this.h = h;
      this.i = i;
      this.x = this.w * Math.random();
      this.y = this.h * Math.random();
      this.r = Math.random() * 8 + 3;
    }
    
    draw() {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = 'black';
      ctx.strokeStyle = 'white';
      ctx.shadowColor = 'white';
      ctx.shadowBlur = this.r * Math.random();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * Math.random(), 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    
    render() {
      this.draw();
    }
}
  

// Shape class
  
class Shape {
    constructor(ctx, w, h, i) {
      this.ctx = ctx;
      this.init(w, h, i);
    }
  
    init(w, h, i) {
      this.w = w;
      this.h = h;
      this.i = i;
      this.s = 200;
      this.scale = Math.random() / 10000;
      this.friction = 1 - Math.random() * Math.random();
      this.x = null;
      this.y = null;
      this.v = null;
      this.acX = 0;
      this.acY = 0;
      this.gco = null;
      this.r = null;
      this.c = 0;
      this.cw = w / 2;
      this.ch = h / 2;
      this.setup();
    }
    
    setup() {
      this.r = Math.random() * canvas.sizeRange.value;
      this.gco = canvas.multiplySelect.value;
      this.x = Math.cos(Math.PI * 2 * Math.random()) * this.s * Math.random() + this.w / 2;
      this.y = Math.sin(Math.PI * 2 * Math.random()) * this.s * Math.random() + this.h / 2;
      this.v = new Vector2d(Utils.randomNumber(-1, 1) * Math.random(), Utils.randomNumber(-1, 1) * Math.random());
    }
    
    attraction(tX, tY) {
      const distX = this.x - tX;
      const distY = this.y - tY;
      this.acX = this.scale * (distX * distX);
      if (this.x > tX) this.acX = -(this.acX);
      this.acY = this.scale * (distY * distY);
      if (this.y > tY) this.acY = -(this.acY);
      this.v.vx += this.acX;
      this.v.vy += this.acY;
      if (Math.abs(this.v.vx) > 5 || Math.abs(this.v.vy) > 5) {
        this.v.vx *= this.friction;
        this.v.vy *= this.friction;
      }
      this.x = (this.x + this.v.vx);
      this.y = (this.y + this.v.vy);
    }
    
    collWall() {
      if (this.x - this.r < 0) {
        this.v.vx *= -1;
      }
      if (this.x + this.r > this.w) {
        this.v.vx *= -1;
      }
      if (this.y - this.r < 0) {
        this.v.vy *= -1;
      }
      if (this.y + this.r > this.h) {
        this.v.vy *= -1;
      }
    }
     
    draw() {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = this.gco;
      ctx.fillStyle = 'hsl(' + this.c + ', 80%, 60%)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    }
    
    updateParams() {
      this.c = Math.sin(Date.now() / 1000) * 360;
      if (this.c < 0) this.c *= -1;
    }
    
    mousemove(mouseX, mouseY) {
      this.cw = mouseX;
      this.ch = mouseY;
    }
    
    attractorDist(points) {
      const arr = points;
      let dist = Number.MAX_VALUE;
      let closestIndex = 0;
      for (let i = 0; i < arr.length; i++) {
        const dx = this.x - arr[i].x;
        const dy = this.y - arr[i].y;
        const newDist = Math.sqrt(dx * dx + dy * dy);
        if (newDist < dist) {
          dist = newDist;
          closestIndex = i;
        }
      }
      this.cw = arr[closestIndex].x;
      this.ch = arr[closestIndex].y;
    }
  
    render() {
      this.draw();
      this.updateParams();
      this.attraction(this.cw, this.ch);
      if (canvas.gravityArray.length) this.attractorDist(canvas.gravityArray);
      if (canvas.collisionCheckbox.checked) this.collWall();
    }
}
  
// RUN
  
(() => {
    'use strict';
    window.addEventListener('load', () => {
      canvas = new Canvas(true);
      canvas.init();
      canvas.render();
      // event
      window.addEventListener("resize", () => {
        canvas.resize();
      }, false);
      // mouse
      canvas.canvas.addEventListener('mousemove', (e) => {
        canvas.mouseX = e.clientX;
        canvas.mouseY = e.clientY;
        canvas.mousemove(e.clientX, e.clientY);
      }, false);
      
      const makeButton = document.getElementById('makeGravityPoints');
      makeButton.addEventListener('click', () => {
        canvas.click();
      }, false);
      
      const select = document.getElementById('multiply');
      select.addEventListener('change', () => {
        canvas.change();
      }, false);
      
      const inputs = document.getElementsByTagName('input');
      for (let i = 1; i < inputs.length; i++) {
        inputs[i].addEventListener('change', () => {
          canvas.change();
        }, false);
      }
      
      const reset = document.getElementById('reset');
      reset.addEventListener('click', () => {
        canvas.reset();
      }, false);
      
      canvas.canvas.addEventListener('touchmove', (e) => {
        const touch = e.targetTouches[0];
        canvas.mousemove(touch.pageX, touch.pageY);
      }, false);
    }, false);
})();
