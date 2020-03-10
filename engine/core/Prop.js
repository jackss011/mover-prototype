import p5, { Vector } from "p5";
import Pool from './Pool';
import Context from "./Context";


export default class Prop extends Context
{
    constructor() {
        super();

        /** @type {Pool} */
        this.pool = null;

        this.destroyed = false;
    }


    get collisionManager() {
        return this.pool.collisionManager;
    }


    /**
     * 
     */
    build() {}



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


    onDestroy() {}
}