import p5, { Vector } from "p5";


export default class Mover
{
    constructor() {
        this.position = new Vector();
        this.velocity = new Vector();
        this.cumulatedForces = new Vector();
        this.cumulatedImpulse = new Vector();
        this.pool = null;
        this.invMass = 1;
    }

    /**
     * @param {Number} value
     */
    set mass(value) {

    }

    /**
     * 
     */
    begin() {}

    /**
     * 
     * @param {Number} delta 
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