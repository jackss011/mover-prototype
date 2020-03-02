import Actor from "./core/Actor";
import p5, { Vector } from "p5";


export default class Target extends Actor {
    /**
     * 
     * @param {number} delta 
     * @param {p5} context 
     */
    tick(delta, context) {
        this.enabled = context.mouseIsPressed

        this.position = this.mouseToWorld();

        let {x, y} = this.worldToScreen(this.position);

        context.fill(this.enabled ? 100 : 175);
        context.noStroke();
        context.circle(x, y, 10);
        
    }
}