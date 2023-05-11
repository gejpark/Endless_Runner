
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
        this.load.spritesheet('spaceship_side', './assets/Sprites/spaceship_side1.png', {frameWidth: 113, frameHeight: 85, startFrame: 0, endFrame: 2});

        //load enemy stuff
        this.load.image('SpaceEye', './assets/Sprites/space_eye.png');
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


        this.temp = 0; //keep track of time for shading scrolling
        // this.multiplier = 1;
        
        
        
        // this.anims.create({
        //     key: 'spaceship_forward',
        //     frames: this.anims.generateFrameNumbers('spaceship_forward', {start: 0, end: 2, first: 0}),
        //     frameRate: 15,
        //     repeat: -1,
        // });

        //Instantiate player
        this.player = new Player(this, 0, 0, 'player_base_sprite').setOrigin(0.5,0.5);
        this.player.create();

        this.enemy = new SpaceEye(this, game.config.width/2, game.config.height/2, 'SpaceEye').setOrigin(0.5,0.5);
        //get input
        KEY_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        KEY_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        KEY_UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); //press up to speed up
        KEY_DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); //press down to speed down
        KEY_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        let menuConfig = {
            fontFamily: 'Trebuchet MS',
            fontSize: '28px',
            backgroundColor: '#816271',
            color: '#c3a38a',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }


        //UI Elements
        this.nextWave_UI = this.add.text(game.config.width/2, game.config.height/2, 'NEXT WAVE', menuConfig).setOrigin(0.5);
        this.nextWave_UI.setVisible(false);

        this.distance_UI = this.add.text(game.config.width/2, 14+2.5, `distance ${Math.round(this.temp)}`, menuConfig).setOrigin(0.5);

        this.lives_UI = this.add.text(0, 0, 'LIVES', menuConfig).setOrigin(0.0);

        this.score_UI = this.add.text(120, 0, 'SCORE', menuConfig);
    }

    update() {
        var multiplier = 1; //when speeding up, makes shader play faster.
        if(KEY_UP.isDown) {
            multiplier = 3;
        } else if (KEY_DOWN.isDown) {
            multiplier = 0.3;
        }
        const grayscalePipeline = this.renderer.pipelines.get('Gray');
        grayscalePipeline.gray = this.temp;
        // this.temp += 0.05 * multiplier;
        
        this.player.update();
        this.enemy.update();
        this.enemy.detectOverlap(this.player);
        // this.enemy.detectCollision(this.player);
        

        let menuConfig = {
            fontFamily: 'Trebuchet MS',
            fontSize: '28px',
            backgroundColor: '#816271',
            color: '#c3a38a',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        if (this.temp > 50) {
            this.nextWave_UI.setVisible(true); //set visible
            this.time.delayedCall(1000, () => { //after 1 second delay,  set invisible
                console.log("HERE");
                this.nextWave_UI.setVisible(false);
                this.temp = 0;
                }, null, this);
        } else {
            this.temp += 0.05 * multiplier;
            this.distance_UI.text = `distance ${Math.round(this.temp)}`;
        }
    }
}