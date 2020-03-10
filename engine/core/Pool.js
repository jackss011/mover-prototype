import p5, { Vector } from 'p5'

import Context from './Context';
import {Controller} from '..'
import Actor from './Actor';
import Prop from './Prop'
import { Timer } from '../time/timers';
import CollisionManager from '../collision/CollisionManager';


export default class Pool extends Context
{
    /**
     * 
     * @param {p5} context 
     */
    constructor(context, controller) {
        super();
        
        
        this.context = context;
        this.delta = 0;
        
        /** @type {Array<Actor>} */
        this.actors = [];
        
        /** @type {Array<Timer>} */
        this.timers = [];
        
        /** @type {Controller} */
        this.spawnController(controller || new Controller());

        this.collisionManager = new CollisionManager(this);


        context.mouseClicked = () => {
           this.mouseClick = this.mouseToWorld(context.mouseX, context.mouseY);
        }
    }


    /**
     * 
     * @param {Prop} prop
     */
    initProp(prop) {
        prop.context = this.context;
        prop.pool = this;
        
        prop.build();

        return prop;
    }


    /**
     * 
     * @param {Controller} controller 
     */
    spawnController(controller) {
        this.controller = controller;
        this.initProp(controller);

        return controller;
    }


    /**
     * 
     * @param {Actor} actor 
     * @param {Vector} position 
     * 
     * @returns {Actor}
     */
    spawnActor(actor, position) {
        this.initProp(actor);
        actor.position = position;

        this.actors.push(actor);
        actor.begin();

        return actor;
    }


    /**
     * 
     * @param {Timer} timer 
     */
    addTimer(timer) {
        this.timers.push(timer);
    }


    /**
     * 
     */
    begin() {
        this.context.canvas.style.cursor = "none";

        this.controller.begin();

        this.actors.forEach(a => a.begin());
    }


    /**
     * 
     */
    updateDelta() {
        this.delta = 1 / this.context.frameRate();
        if(this.context.frameRate() === 0) this.delta = 0;
    }


    /**
     * 
     */
    tick() {
        this.updateDelta();

        // controller tick
        this.controller.tick(this.delta, this.context);
        
        // timer tick
        this.timers.forEach(t => t.tick(this.delta));

        // actors tick
        this.actors.forEach(a => a.tick(this.delta, this.context));


        if(this.mouseClick) {
            //console.time('trace');
            const res = this.collisionManager.verticalTrace(this.mouseClick, 'mouse');
            //console.timeEnd('trace');
            if(res) console.log(res);
        }

        this.mouseClick = null;
        

        // console.time('collision');
        this.collisionManager.resolveCollisionBounds();
        this.collisionManager.resolveCollisions();
        // console.timeEnd('collision')
        
        this.actors.forEach(a => a.postTick(this.delta, this.context))
    }
}