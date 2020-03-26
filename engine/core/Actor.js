import p5, { Vector } from "p5";
import { Collision } from "../collision/Collision";
import Props from "./Prop";
import Component from "./Component";


export default class Actor extends Props
{
    constructor() {
        super();
        
        this.position = new Vector();

        /** @type {Array<Component>} */
        this.components = [];

        this.componentRequireBegin = false;
        this.hasBegun = false;
    }


    /**
     * 
     * @param {Component} component 
     */
    addComponent(component) {
        if(!component instanceof Component) {
            Console.error(component, "is not a component");
            return;
        }

        
        this.componentRequireBegin = true;
        
        this.components.push(component);
        component.actor = this;

        component.init();

        return component;
    }


    /**
     * 
     * @param {Collision} collision 
     */
    registerCollision(collision) {
        this.collisionManager.addCollision(collision);
        return collision;
    }


    /**
     * 
     * @param {Collision} collision 
     */
    unregisterCollision(collision) {
        this.collisionManager.removeCollision(collision);
        return collision;
    }


    /**
     * @param {Number} delta 
     * @param {p5} context 
     */
    tick(delta, context) {
        super.tick(delta, context);

        if(this.componentRequireBegin) {
            this.components.forEach(c => {
                if(!c.hasBegun) {
                    c.begin();
                    c.hasBegun = true;
                }
            });
        }

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


    destroy() {
        this.destroyed = true;
    }
}