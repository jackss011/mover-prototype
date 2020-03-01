import Mover from './Mover'
import p5, { Vector } from 'p5';


export default class Ball extends Mover {
    /**
     * 
     * @param {Number} delta 
     * @param {p5} st 
     */
    tick(delta, st) {
        super.tick(delta, st);

        st.circle(this.position.x, st.height-this.position.y, 30);
        this.applyForce(new Vector((200 - this.position.x)*0.01, -2).mult(this.mass));
    }
}