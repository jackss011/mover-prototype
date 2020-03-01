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
     * @param {p5} st 
     */
    tick(delta, st) {
        
        //let mouse = this.mouseToWorld();
        this.applyForce(new Vector(0, -250));
        
        // if(this.velocity.mag() > 2)
        // this.velocity.setMag(2)
        
        super.tick(delta, st);
        
        st.circle(this.position.x, st.height - this.position.y, this.radius * 2); 
    }
}