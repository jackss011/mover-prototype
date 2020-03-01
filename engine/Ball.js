import p5, { Vector } from 'p5';
import Mover from './Mover'
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
    }


    /**
     * 
     * @param {Number} delta 
     * @param {p5} context 
     */
    tick(delta, context) {
        
        let mouse = this.mouseToWorld();
        
        let maxV = 1000;
        if(this.velocity.mag() > maxV) this.velocity.setMag(maxV)
        
        super.tick(delta, context);
        this.applyForce(this.mouseToWorld().sub(this.position).mult(10));

        context.circle(this.position.x, context.height - this.position.y, this.radius * 2); 
    }
}