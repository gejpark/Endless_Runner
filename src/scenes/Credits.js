class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
    }
    preload() {
        this.load.image('instructions_background', './assets/Sprites/instructions_background.png');
    }
    create() {
        this.menu_background = this.add.sprite(0,0,'instructions_background').setOrigin(0,0);
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Trebuchet MS',
            fontSize: '14px',
            // backgroundColor: '#816271',
            color: '#FFF1E8',
            align: 'right',
            // padding: {
            //     top: 5,
            //     bottom: 5,
            // },
            fixedWidth: 0
        }
        var temp = 1;
        this.intro = this.add.text(game.config.width/2, 0, `CREDITS: (PRESS SPACE TO RETURN TO MENU)`,menuConfig).setOrigin(0.5,0);
        temp += 1;
        this.add.text(game.config.width/2,this.intro.height * temp, `PROGRAMMING DONE BY GENE PARK`,menuConfig).setOrigin(0.5,0);
        temp += 1;
        this.add.text(game.config.width/2,this.intro.height * temp, `ART ASSETS BY GENE PARK, MADE USING ASEPRITE AND PICOCAD`,menuConfig).setOrigin(0.5,0);
        temp += 1;
        this.add.text(game.config.width/2,this.intro.height * temp, `SOUND EFFECTS FROM SFXR: https://sfxr.me/`,menuConfig).setOrigin(0.5,0);
        temp += 1;
        this.add.text(game.config.width/2,this.intro.height * temp, `MUSIC FROM: https://pixabay.com/music/corporate-space-technologies-146694/`,menuConfig).setOrigin(0.5,0);
        
    
        this.spaceship_revolve_base = this.add.sprite(game.config.width/2,game.config.height/2,'spaceship_revolve_base').setOrigin(0.5,0.5);
        if (!this.anims.exists('spaceship_revolve')) { //check if animation already exists
            this.anims.create({
                key: 'spaceship_revolve',
                frames: this.anims.generateFrameNumbers('spaceship_revolve', {start: 0, end: 179, first: 0}),
                frameRate: 15,
                repeat: -1,
            });
        }
        this.spaceship_revolve_base.anims.play('spaceship_revolve', true);
        this.spaceship_revolve_base.setScale(3);

        KEY_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if(KEY_SPACE.isDown) {
            this.sound.play('sfx_select');
            this.scene.start('menuScene');
        }
    }
}