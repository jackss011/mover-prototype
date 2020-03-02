import p5, { Vector } from "p5";
import Pool from './Pool';
import Context from "./Context";


export default class Props extends Context
{
    constructor() {
        super();

        /** @type {Pool} */
        this.pool = null;
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
    tick(delta, context) {}


    /**
     * 
     * @param {number} delta 
     * @param {p5} context 
     */
    postTick(delta, context) {}

    
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


    /**
     * @returns {Vector}
     */
    mouseToWorld() {
        if(!this.context) return new Vector();

        return new Vector(this.context.mouseX, this.context.height - this.context.mouseY);
    }
}