import p5, { Vector } from "p5";
import color from 'chroma-js'
import Actor from "#/core/Actor";
import { Circle } from "#/components/shapes";


export default class Target extends Actor {

    constructor() {
        super();

        /** @type {Circle} */
        this.shape = this.addComponent(new Circle(5));
        this.shape.stroke = color('#888');
        this.shape.fill = color(0).alpha(0);
    }


    /**
     * 
     * @param {number} delta 
     * @param {p5} context 
     */
    tick(delta, context) {
        this.enabled = context.mouseIsPressed

        this.position = this.mouseToWorld();
    }
}