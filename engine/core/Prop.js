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
}