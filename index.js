import p5, { Vector } from 'p5'

import * as Engine from './engine'
import Ball from './engine/examples/Ball'
import Target from './engine/examples/Target'


class TestController extends Engine.Controller {
    begin() {
        super.begin();
        
        const follower = this.pool.spawnActor(new Ball(15), new Vector(100, 100));
        
        const ball2 = this.pool.spawnActor(new Ball(40), new Vector(300, 300));
        ball2.mass = 10;
        
        const target = this.pool.spawnActor(new Target(), new Vector(200, 200));
        follower.target = target;
    }
}

const canvas = Engine.createCanvas(600, 400, new TestController());
