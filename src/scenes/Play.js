
//Code for fragShader taken from: https://www.shadertoy.com/view/Wt33Wf#
class GrayScalePipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
            fragShader: `
            precision mediump float;            //accuracy
            uniform float time;                 //time delta
            float grid(vec2 uv, float battery) {
                vec2 size = vec2(uv.y, uv.y * uv.y * 0.2) * 0.01;
                // uv += vec2(0.0, time * 4.0 * (battery + 0.05));
                uv += vec2(0.0, time * 4.0 );                                       //set speed of grid movement
                uv = abs(fract(uv) - 0.5);
                vec2 lines = smoothstep(size, vec2(0.0), uv);                       //draw lines
                lines += smoothstep(size * 5.0, vec2(0.0), uv) * 0.4 * battery;     //draw a smooth line from 0,0 to end of uv
                return clamp(lines.x + lines.y, 0.0, 3.0);                          //return gridval???
            }

            void main( )
            {
                vec2 resolution = vec2(640,480);
                vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy)/resolution.y;     //?not sure what this is?
                float battery = 0.1;                                                //affects speed of scroll
                {
                    // Grid
                    // float fog = smoothstep(0.1, -0.02, abs(uv.y + 0.2));         //add fog if needed
                    // vec3 col = vec3(0.0, 0.1, 0.2);                                 //color to add (to gl_FragColor)
                    vec3 col = vec3(1.0, 1.0, 1.0);
                    if (uv.y < -0.2) {
                        uv.y = 3.0 / (abs(uv.y + 0.2) + 0.05);
                        uv.x *= uv.y * 1.0;
                        float gridVal = grid(uv, battery);
                        // col = mix(col, vec3(1.0, 0.5, 1.0), gridVal);
                        col = mix(col, vec3(0.0, 0.0, 0.0), gridVal);
                    }

                    // col += fog * fog * fog;
                    // col = mix(vec3(col.r, col.r, col.r) * 0.5, col, battery * 0.7);

                    if (col.x > 0.30) {
                        gl_FragColor = vec4(col,0.0);    
                    } else {
                        gl_FragColor = vec4(col,1.0);
                    }
                }

                
            }
            `,
            uniforms: [
                'time'
            ]
        });

        this._gray = 1;
        // this._fov = 1.4;
        // this._horizon = 0.6;
        // this._scaling = 0.8;
        // this._time = 10;
    }

    onPreRender () //on step before rendering effect.
    {
        this.set1f('time', this._gray); //applies value to uniform
        // this.set1f('Fov', this._fov);
        // this.set1f('Horizon', this._horizon);
        // this.set1f('Scaling', this._scaling);
        
    }

    get gray () //get and set values
    {
        return this._gray;
    }

    set gray (value)
    {
        this._gray = value;
    }
}


class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

    }

    preload() {
        this.load.image('background', './assets/Sprites/background_sprite.png');
        this.load.image('scrolling_tile', './assets/Sprites/scrolling_tile.png');
    }

    create() {
        this.test = new GrayScalePipeline(this.game);
        // var grayscalePipeline = this.renderer.pipelines.add('Gray', this.test);
        const  grayscalePipeline = this.renderer.pipelines.add('Gray', this.test);
        // this.background1 = this.add.tileSprite(0, 0, 640, 480, 'scrolling_tile').setOrigin(0, 0).setPipeline(grayscalePipeline);    //All background sprites are used for parallax scrolling effect.
        // this.background1 = this.add.tileSprite(0, 0, 640, 480, 'scrolling_tile').setOrigin(0, 0);
        this.background1 = this.add.image(0, 0, 'background').setOrigin(0, 0).setPipeline(grayscalePipeline);
        // this.foreground1 = this.add.image(640/2, 480/2, 'scrolling_tile').setOrigin(0, 0);
        this.background1.setPipeline(grayscalePipeline);
        this.temp = 0.5;
        this.multiplier = 1;
    }

    update() {
        // const grayscalePipeline = this.renderer.pipelines.add('Gray', this.test);
        const grayscalePipeline = this.renderer.pipelines.get('Gray');
        grayscalePipeline.gray = this.temp;
        this.temp += 0.01;
        
    }
}