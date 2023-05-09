const fragShader = `
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
`;

class GrayScalePipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'gray'
            ]
        });

        this._gray = 1;
    }

    onPreRender ()
    {
        this.set1f('gray', this._gray);
    }

    get gray ()
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
        const grayscalePipeline = this.renderer.pipelines.add('Gray', new GrayScalePipeline(this.game));
        this.background1 = this.add.tileSprite(0, 100, 640, 480, 'scrolling_tile').setOrigin(0, 0).setPipeline(grayscalePipeline);    //All background sprites are used for parallax scrolling effect.
        

    }

    update() {
        this.background1.tilePositionY -= 2;
        
    }
}