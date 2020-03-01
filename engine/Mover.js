import p5, { Vector } from "p5";
import Pool from './Pool';


export default class Mover
{
    constructor() {
        this.position = new Vector();
        this.velocity = new Vector();
        this.cumulatedForces = new Vector();
        this.cumulatedImpulse = new Vector();
        
        /** @type {Pool} */
        this.pool = null;

        /** @type {number} */
        this.invMass = 1;
    }


    /**
     * @param {number} value
     */
    set mass(value) {
        this.invMass = value == 0 ? 0 : 1 / value;
    }


    /**
     * @returns {number}
     */
    get mass() {
        return this.invMass == 0 ? 0 : 1 / this.invMass;
    }


    /**
     * 
     */
    begin() {}


    /**
     * 
     * @param {number} delta 
     * @param {p5} st 
     */
    tick(delta, st) {
        this.velocity.add(this.cumulatedForces.mult(delta));
        this.cumulatedForces.set(0, 0);

        this.velocity.add(this.cumulatedImpulse);
        this.cumulatedImpulse.set(0, 0);

        this.position.add(this.velocity);
    }


    /**
     * 
     * @param {Vector} force 
     */
    applyForce(force) {
        this.cumulatedForces.add(force);
    }


    /**
     * 
     * @param {Vector} impulse 
     */
    applyImpulse(impulse) {
        this.cumulatedImpulse.add(impulse);
    }
}