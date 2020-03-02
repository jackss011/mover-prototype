import p5, { Vector } from 'p5'
import Pool from './engine/core/Pool'
import Ball from './engine/Ball'


const P5 = new p5(st => {
    let pool = new Pool(st);
    window.pool = pool;

    st.setup = () => {
        st.frameRate(144);
        st.createCanvas(400, 400);
        pool.begin();
        pool.spawnActor(new Ball(15), new Vector(100, 100));
    }

    //console.log(s)

    st.draw = () => {
        st.background(220);
        pool.tick();
    }
})
