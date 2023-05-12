class Scores extends Phaser.Scene {
    constructor() {
        super('scoresScene');
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

        //show scores
        this.score_list = [];
        this.intro = this.add.text(game.config.width/2,0, `SCORES: (PRESS Z TO RETURN TO MENU)`,menuConfig).setOrigin(0.5,0);
        var temp = 1;
        SCORES.forEach(score => {
            this.add.text(0,this.intro.height * temp, `${temp}. ${score}`,menuConfig).setOrigin(0,0);
            temp += 1;
        });

        KEY_Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        if(KEY_Z.isDown) {
            this.sound.play('sfx_select');
            this.scene.start('menuScene');
        }
    }
}