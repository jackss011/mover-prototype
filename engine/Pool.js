import { Vector } from 'p5'

export default class Pool
{
    constructor(st) {
        this.st = st;
        this.movers = [];
        this.delta = 0;
    }

    spawnMover(mover, position) {
        mover.st = this.st;
        mover.position = position;
        mover.pool = this;

        this.movers.push(mover);
        mover.begin();
    }

    begin() {}

    tick() {
        // const now = Date.now();
        // let delta = this.prev === undefined ? 0 : (now - this.prev) / 1000;
        // this.prev = now;
        this.delta = 1 / this.st.frameRate();
        if(this.st.frameRate() === 0) this.delta = 0;

        this.movers.forEach(m => {
            if(m.position.y < 15) {
                let sc = -(1 + 1);
                let n = new Vector(0, 1);
                let dot = Vector.dot(n, m.velocity);
                if(dot > 0) return;
                n.mult(dot * sc)
                m.applyImpulse(n);
            }
        })
        

        this.movers.forEach(m => m.tick(this.delta, this.st))
        
     
    }
}