import p5, { Vector } from "p5";
import color from 'chroma-js'


export default class Context
{
    constructor() {
        /** @type {p5} */
        this._context = null;
    }

    get context() {
        return this._context;
    }


    set context(value) {
        this._context = value;
    }


    /**
     * @returns {Vector}
     */
    mouseToWorld() {
        if(!this.context) return new Vector();

        return new Vector(this.context.mouseX, this.context.height - this.context.mouseY);
    }


    /**
     * 
     * @param {number | Vector} x
     * @param {number} y 
     * @returns {Vector}
     */
    screenToWorld(x, y) {
        if(!this.context) return new Vector(); 

        if(!y) {
            y = x.y;
            x = x.x;
        }
        
        return new Vector(x, this.context.height - y);
    }


    /**
     * 
     * @param {number | Vector} x 
     * @param {number} y 
     */
    worldToScreen(x, y) {
        return this.screenToWorld(x, y);
    }


    /**
     * @param {color.Color} c
     */
    p5color(c) {
        let rgb = c.rgba();
        rgb[3] *= 255;
        return rgb;
    }
}