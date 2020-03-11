import p5 from 'p5'

import Actor from './Actor';
import Pool from './Pool';
import Context from './Context';


export default class Component extends Context {
    constructor() {
        super();
        
        /** @type {Actor} */
        this.actor = null;

        this.begun = false;
    }


    /**
     * @returns {Context}
     */
    get context() {
        return this.actor ? this.actor.context : null;
    }


    /**
     * 
     * @returns {Pool} context 
     */
    get pool() {
        return this.actor ? this.actor.pool : null;
    }


    /**
     * 
     * @param {p5} context 
     */
    init(context) {}


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
     */
    onDestroy() {}
}