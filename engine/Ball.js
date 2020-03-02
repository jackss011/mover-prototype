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
        context.circle(x, y, this.radius * 2); 

        const n = this.mouseToWorld().sub(this.position).mult(10);
        this.applyForce(n);    
    }


    /**
     * 
     * @param {number} x
     * @param {number} y 
     * @returns {Vector}
     */
    screenToWorld(x, y) {
        if(!this.context) return new Vector(); 

        if(!y) {
            y = x.y;
            x = x.x;
        }
        
        return new Vector(x, this.context.height - y);
    }
}