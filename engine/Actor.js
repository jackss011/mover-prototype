import p5, { Vector } from "p5";
import Pool from './Pool';
import { Collision } from "./collision";
import Props from "./Prop";


export default class Actor extends Props
{
    constructor() {
        super();
        
        this.position = new Vector();
        
        /** @type {Collision} */
        this.collision = null;
    }
}