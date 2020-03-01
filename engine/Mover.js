import p5, { Vector } from "p5";
import Pool from './Pool';
import { Circle } from "./collision";


export default class Mover
{
    constructor() {
        this.position = new Vector();
        this.velocity = new Vector();
        this.cumulatedForces = new Vector();
        this.cumulatedImpulse = new Vector();

        /** @type {Circle} */
        this.collision = null;
        
        /** @type {Pool} */
        this.pool = null;

        /** @type {number} */
        this.invMass = 1;

        /** @type {p5} */
        this.context = null;
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
     * @param {p5} context 
     */
    tick(delta, context) {
        this.velocity.add(this.cumulatedForces.mult(delta * this.invMass));
        this.cumulatedForces.set(0, 0);
        this.position.add(Vector.mult(this.velocity, delta));
    }
    
    
    /**
     * 
     * @param {number} delta 
     * @param {p5} context 
     */
    postTick(delta, context) {
        
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


    /**
     * 
     * @param {number} x
     * @param {number} y 
     * @returns {Vector}
     */
    screenToWorld(x, y) {
        if(!this.context) return new Vector(); 
        
        return new Vector(x, this.context.height - y);
    }


    // /**
    //  * 
    //  * @param {Vector} v
    //  * @returns {Vector} 
    //  */
    // screenToWorld(v) {
    //     if(!v) return new Vector();

    //     return this.screenToWorld(v.x, v.y);
    // }


    /**
     * @returns {Vector}
     */
    mouseToWorld() {
        if(!this.context) return new Vector();

        return new Vector(this.context.mouseX, this.context.height - this.context.mouseY);
    }
}