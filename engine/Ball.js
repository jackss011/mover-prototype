import p5, { Vector } from 'p5';
import Mover from './core/Mover'
import {Circle} from './collision'


export default class Ball extends Mover {
    /**
     * 
     * @param {number} radius 
     */
    constructor(radius) {
        super();

        this.radius = radius;
        this.collision = new Circle(this.radius);
        this.collision.attachment = this;

        this.maxVelocity = 400;
    }


    /**
     * 
     * @param {Number} delta 
     * @param {p5} context 
     */
    tick(delta, context) {
        super.tick(delta, context);
        
        let {x, y} = this.worldToScreen(this.position);
        context.stroke(10, 10, 10);
        context.fill(255);
        context.circle(x, y, this.radius * 2); 

        const t = this.target ? this.target.position : this.mouseToWorld();
        const n = Vector.sub(t, this.position).mult(10);
        this.applyForce(n);  
    }
}