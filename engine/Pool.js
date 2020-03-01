import p5, { Vector } from 'p5'
import Mover from './Mover';


export default class Pool
{
    /**
     * 
     * @param {p5} st 
     */
    constructor(st) {
        this.st = st;
        this.delta = 0;

        /** @type {Array<Mover>} */
        this.movers = [];
    }


    /**
     * 
     * @param {Mover} mover 
     * @param {Vector} position 
     * 
     * @returns {Mover}
     */
    spawnMover(mover, position) {
        mover.st = this.st;
        mover.position = position;
        mover.pool = this;

        this.movers.push(mover);
        mover.begin();

        return mover;
    }


    /**
     * 
     */
    begin() {}


    /**
     * 
     */
    updateDelta() {
        this.delta = 1 / this.st.frameRate();
        if(this.st.frameRate() === 0) this.delta = 0;
    }


    /**
     * 
     */
    tick() {
        this.updateDelta();
        

        this.movers.forEach(m => {
            if(m.position.y < 15) {
                let coefficent = -(1 + 1);
                let normal = new Vector(0, 1);
                
                let normVelocity = Vector.dot(normal, m.velocity);
                if(normVelocity > 0) return;

                normal.mult(normVelocity * coefficent * m.mass)
                m.applyImpulse(normal);
            }
        })
        

        this.movers.forEach(m => m.tick(this.delta, this.st))
        
     
    }
}