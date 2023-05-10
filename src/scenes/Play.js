
//Code for fragShader taken from: https://www.shadertoy.com/view/dlt3zs
class GrayScalePipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
            fragShader: `
            #ifdef GL_ES
            precision mediump float;            //accuracy
            uniform float time;                 //time delta
            uniform sampler2D ColorTexture;
            #endif

            float Quant(float cc,float steps) {
                return floor(steps*cc)/steps;           // pure quantization
            }

            vec2 CycleGrid(vec2 uv,float colorsteps) {
                float fade = (abs(uv.y)-.1)/.9;
                fade = 1.0-step(fade,0.085);
                vec2 v = vec2(uv.x*abs(1.0/uv.y),abs(1.0/uv.y));
                vec2 fs =  fract(v+0.5)-0.5;
                float e = length(vec2(abs(fs.x)-0.5,0.0));
                
                float lines = step(e,.05);
                float fill = fs.y+0.5;
                fill+=Quant(fract(time*0.5),colorsteps);// Cycle colours
                fill = Quant(fract(fill),colorsteps);
                return vec2(lines,(fill+0.1)) * fade;
            }

            void main() {
                //Set resolution
                vec2 resolution = vec2(640, 480);

                // Pixel coordinates
                vec2 uv = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;

                vec2 dat = CycleGrid(uv , 12.0);  // get grid with 12 colour steps
                // vec3 col = vec3(dat.y,0.0,0.0);
                vec3 col = vec3(dat.y*0.5,dat.y,0.5);
                // col.rgb += dat.x;              //white lines
                // Output to screen
                gl_FragColor = vec4(col, 1.0);

                //To just redraw background image:
                // gl_FragColor = texture2D(ColorTexture, vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y)/resolution);

                // //Mix background and shader.
                // vec4 colTexture = texture2D(ColorTexture, vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y)/resolution);
                // gl_FragColor.rgb = mix(col.rgb, colTexture.rgb, 0.5);
                // gl_FragColor.a = 1.0;
            }
            `,
            uniforms: [
                'time',
                'ColorTexture'
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
        
        //blank background
        this.load.image('background', './assets/Sprites/background_sprite.png');
        
        
        // this.load.image('scrolling_tile', './assets/Sprites/scrolling_tile.png');

        //load player stuff
        this.load.image('player_base_sprite', './assets/Sprites/player_base_sprite.png');       //base sprite should have same dimesions as frameWidth + frameHeight
        this.load.spritesheet('spaceship_forward','./assets/Sprites/spaceship_forward1.png', {frameWidth: 96, frameHeight: 80, startFrame: 0, endFrame: 2});
    }

    create() {
        this.test = new GrayScalePipeline(this.game);
        const  grayscalePipeline = this.renderer.pipelines.add('Gray', this.test);
        this.background1 = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background1.setPipeline(grayscalePipeline);
        
        // this.tile = this.add.image(0,0, 'scrolling_tile').setOrigin(0,0);
        // this.background2 = this.add.tileSprite(0, 0, 640, 480, 'scrolling_tile').setOrigin(0, 0).setPipeline(grayscalePipeline);
        // this.background2.setPipeline(grayscalePipeline);
        
        // this.tile = this.add.sprite(0,0, 'scrolling_tile').setOrigin(0,0);


        this.temp = 0.5; //keep track of time for shading scrolling
        // this.multiplier = 1;
        
        
        
        // this.anims.create({
        //     key: 'spaceship_forward',
        //     frames: this.anims.generateFrameNumbers('spaceship_forward', {start: 0, end: 2, first: 0}),
        //     frameRate: 15,
        //     repeat: -1,
        // });

        //Instantiate player
        this.player = new Player(this, 0, 0, 'player_base_sprite').setOrigin(0,0);
        this.player.create();
        //get input
        KEY_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        KEY_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        const grayscalePipeline = this.renderer.pipelines.get('Gray');
        grayscalePipeline.gray = this.temp;
        this.temp += 0.01;
        
        this.player.update();
        // this.player.anims.play('spaceship_forward', true);
    }
}