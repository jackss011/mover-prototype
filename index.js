import p5, { Vector } from 'p5'
import * as Engine from './engine'
import Ball from './engine/Ball'
import Target from './engine/Target'


class TestController extends Engine.Controller {
    begin() {
        super.begin();
        
        const target = this.pool.spawnActor(new Target(), new Vector(200, 200));
        
        const follower = this.pool.spawnActor(new Ball(15), new Vector(100, 100));
        follower.target = target;
    }
}

const canvas = Engine.createCanvas(600, 400, new TestController());
