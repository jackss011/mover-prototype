import p5 from 'p5'

import Pool from './core/Pool'
import {StopwatchLog} from './time/stopwatchs'
import Prop from './core/Prop';


export class Controller extends Prop {
    constructor() {
        super();
    }
} 

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {Controller} controller 
 */
export function createCanvas(x, y, controller) {
    const canvas = new p5(/** @param {p5} context*/ context => {
        const pool = new Pool(context, controller);

        const sw = new StopwatchLog('tick', 100);
        sw.logEnabled = false;

        context.setup = () => {
            context.frameRate(144);
            context.createCanvas(x, y);
            pool.begin();
        }


        context.draw = () => {
            context.background(220);

            sw.start();
            pool.tick();
            sw.reset();
        }
    });

    return canvas;
} 



