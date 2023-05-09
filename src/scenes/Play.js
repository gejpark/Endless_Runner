class GrayScalePipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
            fragShader: `
            #define SHADER_NAME GRAYSCALE
            precision mediump float;
            uniform sampler2D uMainSampler[%count%];
            uniform float gray;
            varying vec2 outTexCoord;
            varying float outTexId;
            varying vec4 outTint;
            varying vec2 fragCoord;
            void main()
            {
                vec4 texture;
                %forloop%
                gl_FragColor = texture;
                gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), gray);
            }
            `,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'gray'
            ]
        });

        this._gray = 1;
    }

    onPreRender () //on step before rendering effect.
    {
        this.set1f('gray', this._gray); //applies value to uniform
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
        this.background1 = this.add.tileSprite(0, 100, 640, 480, 'scrolling_tile').setOrigin(0, 0).setPipeline(grayscalePipeline);    //All background sprites are used for parallax scrolling effect.
        this.temp = 0.5;
        this.multiplier = 1;
    }

    update() {
        var grayscalePipeline = this.renderer.pipelines.add('Gray', this.test);
        grayscalePipeline.gray = this.temp;
        this.temp += 0.01 * this.multiplier;
        if (this.temp <= 0 || this.temp >= 1) {
            this.multiplier *= -1;
        }
        this.background1.tilePositionY -= 2;
        // grayscalePipeline.gray = 1;
        
    }
}