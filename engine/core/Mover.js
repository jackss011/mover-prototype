import p5, { Vector } from "p5";
import Pool from './Pool';
import { Collision } from "../collision/Collision";
import Actor from "./Actor";


export default class Mover extends Actor
{
    constructor() {
        super();
        
        this.velocity = new Vector();
        this.cumulatedForces = new Vector();
        this.cumulatedImpulse = new Vector();

        /** @type {Collision} */
        this.collision = null;
        this.boundsCheck = false;
        
        this.invMass = 1;
        this.linearDamping = 0;
        this.maxVelocity = 2000;
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
     * @param {number} delta 
     * @param {p5} context 
     */
    tick(delta, context) {
        const dv = this.cumulatedForces.mult(delta * this.invMass);
        this.velocity.add(dv);

        if(this.linearDamping > 0) {
            const dvD = Math.sqrt(this.velocity.mag()) * this.linearDamping * delta * this.invMass;

            if(this.velocity.mag() < 0.1 && dvD > dv.mag())
                this.velocity.set(0, 0);
            else
                this.velocity.mult(1 - dvD);
        }
        
        this.cumulatedForces.set(0, 0);

        const mag = this.velocity.magSq();
        if(mag > this.maxVelocity * this.maxVelocity) 
            this.velocity.setMag(this.maxVelocity);

        this.position.add(Vector.mult(this.velocity, delta));
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
        this.velocity.add(Vector.mult(impulse, this.invMass));
    }
}