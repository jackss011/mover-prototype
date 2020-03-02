import Actor from "./core/Actor";
import p5, { Vector } from "p5";
import { Circle } from "./components/shapes";


export default class Target extends Actor {

    constructor() {
        super();

        this.shape = this.addComponent(new Circle(5));
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