import p5, { Vector } from "p5";


export default class Context
{
    constructor() {
        /** @type {p5} */
        this.context = null;
    }


    /**
     * @returns {Vector}
     */
    mouseToWorld() {
        if(!this.context) return new Vector();

        return new Vector(this.context.mouseX, this.context.height - this.context.mouseY);
    }


    worldToScreen(x, y) {
        return this.screenToWorld(x, y);
    }
}