class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        this.load.glsl('wave', 'src/shader/shader1.frag');
        this.load.image('background', './assets/Sprites/background_sprite.png');
        this.load.image('scrolling_tile', './assets/Sprites/scrolling_tile.png');
    }

    create() {
        
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background1 = this.add.tileSprite(0, 0, 640, 480, 'scrolling_tile', 'wave').setOrigin(0,0);
        //Warp tilesprite for "Mode-7" effect
        // this.background1.SetAngle(30);
        // this.add.rectangle(0, 0, game.config.width, borderUISize * 2 + borderUISize + borderPadding, 0x997577).setOrigin(0, 0);
        // console.log(this.background1.renderer.projectionMatrix);
        // const shader = this.add.shader('tunnel', 400, 300, 800, 600, [ this.background1 ]);
        const shader = this.make.shader({
            key: 'wave',
            x: config.width/2,
            y: config.height/2,
            width: config.width,
            height: config.height,
            add: false
        });

        //  Make a Bitmap Mask from it
        const mask = shader.createBitmapMask();

        //  Apply the mask to this image
        // this.add.image(400, 300, 'scrolling_tile').setMask(mask);
        this.background1.setMask(mask);

        // this.background1 = this.add.tileSprite(0, 0, 640, 480, 'scrolling_tile').setOrigin(0,0);
        // this.background1.setMask(mask);



        
        
    }

    update() {
        this.background1.tilePositionY -= 2;
    }
}