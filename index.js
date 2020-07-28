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

const responses = [
    {
        ids: [Channels.Ball, Channels.Obstacle],
        response: CollisionResponse.OVERLAP,
    },
    {
        ids: [Channels.Obstacle, Channels.Obstacle],
        response: CollisionResponse.PHYSIC,
    }
]


class Obstacle extends Ball {
    constructor() {
        super(10);

        this.collision.collisionChannel = Channels.Obstacle;

        this.collision.onBeginOverlapHandler = () => this.destroy();

        // this.collision.onBeginOverlapHandler = (a, c, h) => console.log('begin', a, c);
        // this.collision.onEndOverlapHandler = (a, c, h) => console.log('end');

        
    }
}


class Follower extends Ball {
    constructor() {
        super(15);

        this.collision.collisionChannel = Channels.Ball;
        this.linearDamping = 40;
    }
}


class TestController extends Engine.Controller {
    constructor() {
        super();

        this.collisionConfig = {responses}
    }
    

    begin() {
        super.begin();

        var button = document. createElement("button");

        var body = document. getElementsByTagName("body")[0];
        body.appendChild(button)
        button.innerHTML = "Reset"
        button.onclick = () => this.pool.resetPool();
        
        const follower = this.pool.spawnActor(new Follower(), new Vector(500, 200));
        follower.mass = 1;
        
        // const ball2 = this.pool.spawnActor(new Ball(40), new Vector(300, 300));
        // ball2.mass = 10;
        
       

        grid2D(1, 1, 30).forEach(({x, y}) => {
            const obstacle = this.pool.spawnActor(new Obstacle(), new Vector(x, y).add(50, 50))
           // obstacle.collision.channel
        });

        //console.log(grid2D(3, 15, 50))

        const target = this.pool.spawnActor(new Target(), new Vector(200, 200));
        follower.target = target;
        
    }
}

const canvas = Engine.createCanvas(600, 400, new TestController());
