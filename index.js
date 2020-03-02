import p5, { Vector } from 'p5'
import Pool from './engine/core/Pool'
import Ball from './engine/Ball'
import Target from './engine/Target'

import {StopwatchLog} from './engine/time/Stopwatch' 


const P5 = new p5(st => {
    let pool = new Pool(st);
    window.pool = pool;
    let swTick = new StopwatchLog('tick', 100);

    st.setup = () => {
        st.frameRate(144);
        st.createCanvas(400, 400);
        pool.begin();
        const follower = pool.spawnActor(new Ball(15), new Vector(100, 100));
        const target = pool.spawnActor(new Target(), new Vector(200, 200));

        follower.target = target;
    }

    //console.log(s)

    st.draw = () => {
        st.background(220);

        swTick.start();
        pool.tick();
        swTick.lap();
    }
})
