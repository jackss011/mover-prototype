import p5 from 'p5'
import Component from '../core/Component';



export class Shape extends Component {
    constructor() {
        super();
    }


    /**
     * @param {p5} context
     */
    render(context) {}


    /**
     * 
     * @param {number} delta 
     * @param {p5} context 
     */
    postTick(delta, context) {
        super.postTick(delta, context);

        if(!this.actor) return;
        this.render(context);
    }
}



export class Circle extends Shape {
    constructor(radius = 0) {
        super();

        this.radius = radius;
    }

    /**
     * @param {p5} context
     */
    render(context) {
        let {x, y} = this.worldToScreen(this.actor.position);
        context.stroke(10, 10, 10);
        context.fill(255);
        context.circle(x, y, this.radius * 2); 
    }
}