import p5, { Vector } from 'p5'
import Mover from './Mover';
import { resolveBound } from './collision';


export default class Pool
{
    /**
     * 
     * @param {p5} context 
     */
    constructor(context) {
        this.context = context;
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
        mover.context = this.context;
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
        this.delta = 1 / this.context.frameRate();
        if(this.context.frameRate() === 0) this.delta = 0;
    }


    /**
     * 
     */
    tick() {
        this.updateDelta();
        
        this.movers.forEach(m => m.tick(this.delta, this.context))

        this.movers.forEach(m => {
            if(!m.collision) return;

            m.collision.checkOutOfBounds(this.context, hit => resolveBound(m, hit));
        })
        
        this.movers.forEach(m => m.postTick(this.delta, this.context))
    }
}