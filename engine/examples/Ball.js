import p5, { Vector } from 'p5';
import color from 'chroma-js'

import Mover from '../core/Mover'
import {Circle} from '../collision/Collision'
import {Circle as Round} from '#/components/shapes'
import { TraceMode, Collision } from '../collision/Collision';



export default class Ball extends Mover {
    /**
     * 
     * @param {number} radius 
     */
    constructor(radius) {
        super();

        this.radius = radius;


        this.maxVelocity = 700;

        this.boundsCheck = true;

        this.collision = new Circle(this.radius);
        this.collision.attachment = this;
        this.collision.traceResponse.mouse = TraceMode.PASS;
    }


    build() {
        this.registerCollision(this.collision);

        /** @type {Round} */
        this.shape = this.addComponent(new Round(this.radius));
    }


    /**
     * 
     * @param {Number} delta 
     * @param {p5} context 
     */
    tick(delta, context) {
        super.tick(delta, context);

        if(this.target && this.target.enabled) 
        {
            const n = Vector.sub(this.target.position, this.position).mult(10);
            this.applyForce(n);
        }          
    }
}