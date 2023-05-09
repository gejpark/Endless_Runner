class GrayScalePipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
            fragShader: `
            precision mediump float;
            uniform float Fov; //1.4
            uniform float Horizon; //0.6
            uniform float Scaling; //0.8
            uniform sampler2D ColorTexture;
            uniform float time;

            void main() {
                // vec2 pos = uv.xy - vec2(0.5, Horizon);
                vec2 resolution = vec2(640,480);
                vec2 pos = vec2(1.0, 1.0) - (gl_FragCoord.xy / (resolution.xy/2.0));
                vec3 p = vec3(pos.x, pos.y, pos.y + Fov);
                vec2 s = vec2(p.x/p.z, p.y/p.z) * Scaling;

                vec2 dir =  vec2(0,-1.0*time);

                // s.x += 0.5;
                // s.y += 0.1;



                // gl_FragColor = texture2D(ColorTexture, s+dir);
                gl_FragColor = texture2D(ColorTexture, s+dir);
            }   
            `,
            uniforms: [
                'Fov',
                'Horizon',
                'Scaling',
                'ColorTexture'
            ]
        });

        this._gray = 1;
        this._fov = 1.4;
        this._horizon = 0.6;
        this._scaling = 0.8;
    }

    onPreRender () //on step before rendering effect.
    {
        // this.set1f('gray', this._gray); //applies value to uniform
        this.set1f('Fov', this._fov);
        this.set1f('Horizon', this._horizon);
        this.set1f('Scaling', this._scaling);
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
        this.test =  new GrayScalePipeline(this.game);
        var grayscalePipeline = this.renderer.pipelines.add('Gray', this.test);
        // this.background1 = this.add.tileSprite(0, 0, 640, 480, 'scrolling_tile').setOrigin(0, 0).setPipeline(grayscalePipeline);    //All background sprites are used for parallax scrolling effect.
        this.background1 = this.add.tileSprite(0, 0, 640, 480, 'scrolling_tile').setOrigin(0, 0);
        this.background1.setPipeline(grayscalePipeline);
        this.temp = 0.5;
        this.multiplier = 1;
    }

    update() {
        // var grayscalePipeline = this.renderer.pipelines.add('Gray', this.test);
        // grayscalePipeline.gray = this.temp;
        // this.temp += 0.01 * this.multiplier;
        // if (this.temp <= 0 || this.temp >= 1) {
        //     this.multiplier *= -1;
        // }
        this.background1.tilePositionY -= 2;
        // grayscalePipeline.gray = 1;
        
    }
}