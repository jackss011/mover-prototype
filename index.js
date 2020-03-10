import p5, { Vector } from 'p5'

import * as Engine from './engine'
import Ball from './engine/examples/Ball'
import Target from './engine/examples/Target'
import { grid2D } from './engine/utils/flow';
import { CollisionResponse } from './engine/collision/Collision';



const Channels = {
    Ball: 'BALL',
    Obstacle: 'OBSTACLE',
}

const CollisionConfig = {
    responses: [
        {
            ids: [Channels.Ball, Channels.Obstacle],
            response: CollisionResponse.PHYSIC,
        }
    ]
}


class Obstacle extends Ball {
    constructor() {
        super(10);

        this.collision.collisionChannel = Channels.Obstacle;
    }
}


class Follower extends Ball {
    constructor() {
        super(15);

        this.collision.collisionChannel = Channels.Ball;
    }
}


class TestController extends Engine.Controller {
    begin() {
        super.begin();

        this.configureCollisions(CollisionConfig);
        
        const follower = this.pool.spawnActor(new Follower(), new Vector(500, 200));
        follower.mass = 1;
        
        // const ball2 = this.pool.spawnActor(new Ball(40), new Vector(300, 300));
        // ball2.mass = 10;
        
        const target = this.pool.spawnActor(new Target(), new Vector(200, 200));
        follower.target = target;

        grid2D(10, 10, 30).forEach(({x, y}) => {
            const obstacle = this.pool.spawnActor(new Obstacle(), new Vector(x, y).add(50, 50))
           // obstacle.collision.channel
        });

        //console.log(grid2D(3, 15, 50))
        
    }
}

const canvas = Engine.createCanvas(600, 400, new TestController());
