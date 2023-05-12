
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

        //load projectile
        this.load.image('Shot', './assets/Sprites/shot.png');

        //load player stuff
        this.load.image('player_base_sprite', './assets/Sprites/player_base_sprite.png');       //base sprite should have same dimesions as frameWidth + frameHeight
        this.load.spritesheet('spaceship_forward','./assets/Sprites/spaceship_forward1.png', {frameWidth: 96, frameHeight: 80, startFrame: 0, endFrame: 2});
        this.load.spritesheet('spaceship_side', './assets/Sprites/spaceship_side1.png', {frameWidth: 113, frameHeight: 85, startFrame: 0, endFrame: 2});

        //load enemy stuff
        this.load.image('SpaceEye', './assets/Sprites/large_space_eye.png');
    }

    create() {
        if (!this.test) {
            this.test = new GrayScalePipeline(this.game);
        }
        const  grayscalePipeline = this.renderer.pipelines.add('Gray', this.test);
        this.background1 = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background1.setPipeline(grayscalePipeline);

        this.temp = 0; //keep track of time for shader scrolling

        //Instantiate player
        this.player = new Player(this, 0, 0, 'player_base_sprite').setOrigin(0.5,0.5);
        this.player.create();
        this.background1.setDepth(this.player.depth - 2);

        //enemies
        this.enemy_list = [];
        this.spawnTimer = 0;
        
        //get input
        KEY_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        KEY_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        KEY_UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); //press up to speed up
        KEY_DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); //press down to speed down
        KEY_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        KEY_Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        let menuConfig = {
            fontFamily: 'Trebuchet MS',
            fontSize: '14px',
            // backgroundColor: '#816271',
            // color: '#c3a38a',
            color: '#FFF1E8',
            align: 'right',
            // padding: {
            //     top: 5,
            //     bottom: 5,
            // },
            fixedWidth: 0
        }


        //UI Elements
        this.waveIncrease = false;
        this.wave = 1;  //wave number
        this.nextWave_UI = this.add.text(game.config.width/2, game.config.height/2, `WAVE ${this.wave}`, menuConfig).setOrigin(0.5);
        this.nextWave_UI.setVisible(false);

        this.maxDistance = 50; //increase every time.
        this.distance_UI = this.add.text(game.config.width/2, 14+2.5, `DISTANCE: ${Math.round(this.temp)}`, menuConfig).setOrigin(0.5);

        this.lives = 3;
        this.lives_UI = this.add.text(0, 0, `LIVES: ${this.lives}`, menuConfig).setOrigin(0.0);

        this.score = 0;
        this.score_UI = this.add.text(120, 0, `SCORE ${this.score}`, menuConfig);

        this.shotReady = false;
        this.shot_ready_UI = this.add.text(0, 0, `SHOT READY!`, menuConfig).setOrigin(0.5);
        this.shot_ready_UI.setVisible(false);

        //Game over screen
        let gameOverTextConfig = {
            fontFamily: 'Trebuchet MS',
            fontSize: '14px',
            // backgroundColor: '#816271',
            // color: '#c3a38a',
            color: '#FFF1E8',
            align: 'right',
            // padding: {
            //     top: 5,
            //     bottom: 5,
            // },
            fixedWidth: 0
        }
        this.GAME_OVER = false;
        this.SELECT = 0;
        this.GAME_OVER_TEXT = this.add.text(game.config.width/2, game.config.height/2, `GAME OVER`, gameOverTextConfig).setOrigin(0.5).setVisible(false);
        this.RESTART_TEXT = this.add.text(game.config.width/4, 3*(game.config.height/4), `RESTART`, gameOverTextConfig).setOrigin(0.5).setVisible(false);
        this.MENU_TEXT = this.add.text(3*(game.config.width/4), 3*(game.config.height/4), `MENU`, gameOverTextConfig).setOrigin(0.5).setVisible(false);

        //projectiles
        this.projectile_list = [];
        this.projectile_timer = Math.max(200/this.wave, 10);
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

        this.lives_UI.text = `LIVES: ${this.player.lives}`; //player lives
        if (this.player.lives < 0) { //gameover screen
            this.GAME_OVER = true;
            multiplier = 0;
            this.GAME_OVER_TEXT.setVisible(true);
            this.MENU_TEXT.setVisible(true);
            this.RESTART_TEXT.setVisible(true);
            if(Phaser.Input.Keyboard.JustDown(KEY_LEFT)) {
                // this.scene.start('playScene');
                this.SELECT = 1;
                this.RESTART_TEXT.setBackgroundColor('#83769C'); //fill in color for selected button
                this.MENU_TEXT.setBackgroundColor('rgba(0,0,0,0)'); //fill in color for UN selected button
            }
            if(Phaser.Input.Keyboard.JustDown(KEY_RIGHT)) {
                // this.scene.start('menuScene');
                this.SELECT = 2;
                this.MENU_TEXT.setBackgroundColor('#83769C'); //fill in color for selected button
                this.RESTART_TEXT.setBackgroundColor('rgba(0,0,0,0)'); //fill in color for UN selected button
            }
            if(Phaser.Input.Keyboard.JustDown(KEY_SPACE)) {
                if(this.SELECT == 1) {
                    this.scene.start('playScene');
                }
                if(this.SELECT == 2) {
                    this.scene.start('menuScene');
                }
            }
        }

        if(!this.GAME_OVER) { //if not game over.
            if (this.temp > this.maxDistance) { //if passed over this wave's distance
                this.wave += 1;
                this.maxDistance += 50; //increase next wave max distance
                this.enemy_list.forEach(enemy => { //destroy all enemies on waveIncrease.
                    enemy.destroy();
                });
                this.waveIncrease = true; //increase wave
            } else {
                //Spawn Projectiles
                this.projectile_timer += 1;
                
                //announce shot is ready
                this.shot_ready_UI.x = this.player.x;
                this.shot_ready_UI.y = this.player.y - this.player.height/2;
                if(this.projectile_timer > Math.max(200/this.wave, 10) && this.projectile_timer < 50 + Math.max(200/this.wave, 10)) {
                    this.shot_ready_UI.setVisible(true);
                } else {
                    this.shot_ready_UI.setVisible(false);
                }

                // if (this.shotReady) {
                //     // this.shot_ready_UI.setVisible(true);
                //     this.shot_ready_UI.x = this.player.x;
                //     this.shot_ready_UI.y = this.player.y;
                //     this.time.delayedCall(0, () => { //after 0.1 second delay,  set invisible
                //         this.shot_ready_UI.setVisible(false);
                //         this.shotReady = false;
                //     }, null, this);
                // }

                if(KEY_Z.isDown && this.projectile_timer > Math.max(200/this.wave, 10)) {
                    this.projectile_list.push(new Shot(this, this.player.x, this.player.y - this.player.height/2, 'Shot').setOrigin(0.5).setDepth(this.player.depth - 1));
                    this.projectile_timer = 0;
                }
                this.projectile_list.forEach(projectile => {
                    // projectile.z = this.player.w + 1;
                    projectile.fire();
                    this.enemy_list.forEach(enemy => {
                        projectile.detectOverlap(enemy);
                    });
                });

                this.player.update(); //player update (controls movement)
                
                //spawn enemies
                this.spawnTimer += 1; //spawnTimer.
                // 100/this.wave
                // Math.min(100/this.wave, 10)
                if (this.spawnTimer > Math.max(200/this.wave, 10) && !this.waveIncrease) { //every few time spawn
                    // this.enemy_list.push(new SpaceEye(this, game.config.width/2, game.config.height/2, 'SpaceEye').setOrigin(0.5,0.5)); //instantiate and add to list
                    this.enemy_list.push(new SpaceEye(this, game.config.width * Math.random(), game.config.height/2, 'SpaceEye').setOrigin(0.5,0.5)); //instantiate and add to list
                    this.spawnTimer = 0; //reset spawnTimer.
                }
                this.enemy_list = this.enemy_list.filter(enemy => enemy.active == true); //remove inactive enemies
                this.enemy_list.forEach(enemy => {
                    enemy.movement(multiplier); //apply movement to enemy
                    this.player.detectOverlap(enemy); //detect collision from player to enemies. for each enemy
                });

                
                this.temp += 0.05 * multiplier;
                // console.log(multiplier);
                this.score += multiplier;
                this.score_UI.text = `SCORE: ${Math.round(this.score)}`;
                this.distance_UI.text = `DISTANCE: ${Math.round(this.maxDistance - this.temp)}`;
            }

            if (this.waveIncrease) {
                this.temp = 0;
                multiplier = 0;
                this.nextWave_UI.setVisible(true); //set visible
                this.time.delayedCall(1000, () => { //after 1 second delay,  set invisible
                    // console.log("HERE");
                    this.nextWave_UI.text = `WAVE ${this.wave}`;
                    this.nextWave_UI.setVisible(false);
                    multiplier = 0;
                    this.waveIncrease = false;
                }, null, this);
            }
        }
    }
}