import p5, { Vector } from 'p5'
import Mover from './Mover';
import Actor from './Actor';
import { resolveBound } from '../collision';


export default class Pool
{
    /**
     * 
     * @param {p5} context 
     */
    constructor(context) {
        this.context = context;
        this.delta = 0;

        /** @type {Array<Actor>} */
        this.actors = [];
    }


    /**
     * 
     * @param {Actor} actor 
     * @param {Vector} position 
     * 
     * @returns {Actor}
     */
    spawnActor(actor, position) {
        actor.context = this.context;
        actor.position = position;
        actor.pool = this;

        this.actors.push(actor);
        actor.begin();

        return actor;
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
        
        this.actors.forEach(a => a.tick(this.delta, this.context))

        this.actors.forEach(a => {
            if(!a.collision) return;

            a.collision.checkOutOfBounds(this.context, hit => resolveBound(a, hit));
        })
        
        this.actors.forEach(a => a.postTick(this.delta, this.context))
    }
}