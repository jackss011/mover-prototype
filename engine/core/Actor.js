import p5, { Vector } from "p5";
import { Collision } from "../collision/Collision";
import Props from "./Prop";
import Component from "./Component";


export default class Actor extends Props
{
    constructor() {
        super();
        
        this.position = new Vector();
        
        /** @type {Collision} */
        this.collision = null;


        /** @type {Array<Component>} */
        this.components = [];
    }


    /**
     * 
     * @param {Component} component 
     */
    addComponent(component) {
        if(!component instanceof Component) return;

        this.components.push(component);
        component.actor = this;
        component.init();

        return component;
    }


    /**
     * @param {Number} delta 
     * @param {p5} context 
     */
    tick(delta, context) {
        super.delta(delta, context);

        this.components.forEach(c => c.tick(delta, context));
    }


    /**
     * @param {Number} delta 
     * @param {p5} context 
     */
    postTick(delta, context) {
        super.postTick(delta, context);

        this.components.forEach(c => c.postTick(delta, context));
    }


    /**
     * 
     */
    onDestroy() {
        super.onDestroy();

        this.components.forEach(c => c.onDestroy());
    }
}