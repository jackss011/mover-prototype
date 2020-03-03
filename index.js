import p5, { Vector } from 'p5'
import Pool from './engine/core/Pool'
import Ball from './engine/Ball'
import Target from './engine/Target'

import {StopwatchLog} from './engine/time/stopwatchs' 
import {Timer} from './engine/time/timers'


const canvas = new p5(/**@param {p5} st */st => {
    const pool = new Pool(st);
    window.pool = pool;

    const swTick = new StopwatchLog('tick', 100);
    swTick.logEnabled = false;


    st.setup = () => {
        st.frameRate(144);
        st.createCanvas(600, 400);
        pool.begin();
        
        const follower = pool.spawnActor(new Ball(15), new Vector(100, 100));
        const target = pool.spawnActor(new Target(), new Vector(200, 200));

        follower.target = target;
    }


    st.draw = () => {
        st.background(220);
        swTick.start();
        pool.tick();
        swTick.reset();
    }
})
