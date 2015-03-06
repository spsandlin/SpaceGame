var levelsUnlocked = 3;

ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity',
    'impact.sound'
)
.defines(function(){
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/spaceman.png', 32, 64 ),
        size: {x: 32, y:64},
        offset: {x:0, y: -14},
        flip: false,
        maxVel: {x: 175, y: 300},
        friction: {x: 400, y: 0},
        accelGround: 400,
        accelAir: 400,
        jump: 450,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,
        allowInput: true,
        inSelector: false,
        weapon: 0,
        totalWeapons: 3,
        boostJumps:10,
        health:100,
        inAcid:false,
        justJumped: false,
        activeWeapon: "EntityBullet",
        startPosition: null,
        invincible: true,
        invincibleDelay: 2,
        invincibleTimer:null,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
        jumpSFX: new ig.Sound( 'media/sounds/jump.*' ),
        shootSFX: new ig.Sound( 'media/sounds/shoot.*' ),
        deathSFX: new ig.Sound( 'media/sounds/death.*' ),
        init: function( x, y, settings ) {
        	this.parent( x, y, settings );
            this.setupAnimation(this.weapon);
            this.startPosition = {x:x,y:y};
            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();

        },
        setupAnimation: function(offset){
            offset = offset * 10;
            this.addAnim('idle', 0.8, [0+offset,1+offset,2+offset,3+offset,4+offset]);
            this.addAnim('run', 0.25, [6+offset,7+offset]);
            this.addAnim('jump', 0.4, [9+offset,10+offset,11+offset,12+offset]);
            this.addAnim('kicking', 0.2, [13+offset,14+offset]);
            this.addAnim('kick', 1, [14+offset]);
            this.addAnim('fall', 1, [8+offset]);
            this.addAnim('swim', 0.2, [15+offset,16+offset]);
        },
        makeInvincible: function(){
            this.invincible = true;
            this.invincibleTimer.reset();
        },
        update: function() {
            console.log(this.inSelector);
            console.log(this.gravityFactor);
            console.log(this.allowInput);
              // move left or right
            if(!this.inSelector){
                this.gravityFactor = 1;
                if(this.allowInput){
                    console.log(this.vel.y);
                    var accel = this.standing ? this.accelGround : this.accelAir;
                    if( ig.input.state('left') ) {
                        this.accel.x = -accel;
                        this.flip = true;
                    }else if( ig.input.state('right') ) {
                        this.accel.x = accel;
                        this.flip = false;
                    }else{
                        this.accel.x = 0;
                    }
                    // jump
                    if( this.standing && ig.input.pressed('jump') ) {
                        this.vel.y = -this.jump;
                        this.jumpSFX.play();
                    }
                    if(this.standing && this.justJumped){
                        this.maxVel.y = 300;
                        this.justJumped = false;
                    }

                    if( this.standing && ig.input.pressed('boostJump') && (this.boostJumps > 0) ) {
                        this.vel.y = -this.jump*1.75;
                        this.maxVel.y = 450;
                        this.boostJumps--;
                        ig.game.boosts--;
                        this.justJumped = true;
                        this.jumpSFX.play();
                    }


                    if(this.inAcid){
                        console.log("inAcid");
                        //this.vel.y = -0.25;
                        this.gravityFactor = 0;
                        this.vel.y = 0;
                        this.inAcid = false;
                        this.currentAnim = this.anims.jump;

                    }
                    else{
                        this.gravityFactor =1;
                    }

                    if(this.pos.y >= 9000){
                        this.kill()
                    }
                    // shoot
                    if( ig.input.pressed('shoot') ) {
                        ig.game.spawnEntity( this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip} );
                        this.shootSFX.play();
                    }
                    if( ig.input.pressed('switch') ) {
                        this.weapon ++;
                        if(this.weapon >= this.totalWeapons)
                            this.weapon = 0;
                        switch(this.weapon){
                            case(0):
                                this.activeWeapon = "EntityBullet";
                                break;
                            case(1):
                                this.activeWeapon = "EntityGrenade";
                                break;
                            case(2):
                                this.activeWeapon = "EntityMissile";
                                break;
                        }
                        if(this.weapon == 2){
                            this.setupAnimation(this.weapon-1);
                        }
                        else{
                            this.setupAnimation(this.weapon);
                        }
                    }
                }
                // set the current animation, based on the player's speed

                    if(ig.input.pressed('kick') && this.vel.x ==0 && this.vel.y == 0){
                        this.currentAnim = this.anims.kick;
                    }else if(ig.input.state('kick') && this.vel.x ==0 && this.vel.y == 0){
                        this.currentAnim = this.anims.kicking;
                    }else if(this.inAcid){
                        this.currentAnim = this.anims.swim;
                        console.log("swimming anim");
                    }else if( this.vel.y < 0 ) {
                        this.currentAnim = this.anims.jump;
                    }else if( this.vel.y > 0 ) {
                        this.currentAnim = this.anims.fall;
                    }else if( this.vel.x != 0 ) {
                        this.currentAnim = this.anims.run;
                    }else{
                        this.currentAnim = this.anims.idle;
                    }

                this.currentAnim.flip.x = this.flip;
                if( this.invincibleTimer.delta() > this.invincibleDelay ) {
                    this.invincible = false;
                    this.currentAnim.alpha = 1;
                }
            }
            else{
                console.log(this.pos.x);
                this.gravityFactor = 0;
                
                if( ig.input.pressed('left') ) {
                    this.flip = true;
                    if(this.pos.x > 2476){
                        this.pos.x -= 245;
                    }
                }else if( ig.input.pressed('right') ) {
                    
                    this.flip = false;
                    if(this.pos.x <= (2966-(245*ig.game.levelsUnlocked))){
                        this.pos.x += 245;
                    }
                }
                if( ig.input.pressed('boostJump') ) {
                
                    if(this.pos.x == 2476){
                        ig.game.loadLevelDeferred(LevelFirstspacelevel);
                    }
                    else if(this.pos.x == 2721){
                        ig.game.loadLevelDeferred(LevelSecondspacelevel);
                    }
                    else{
                    }
                    
                
                }
                this.currentAnim.flip.x = this.flip;
                //this.currentAnim = this.anims.idle;
                console.log(this.vel.y);


            
            
            
            }
        	// move!
        	this.parent();
        },
        kill: function(){
            this.deathSFX.play();
            this.parent();
            ig.game.respawnPosition = this.startPosition;
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:this.onDeath});
        },
        check: function( other ) {
            if(ig.input.pressed('kick') || ig.input.state('kick')){
                other.kill();
            }
        },
        onDeath: function(){
            ig.game.stats.deaths ++;
            ig.game.lives --;
            if(ig.game.lives < 0){
                ig.game.gameOver();
            }else{
                ig.game.spawnEntity( EntityPlayer, ig.respawnPosition.x, ig.respawnPosition.y);
            }
        },
        receiveDamage: function(amount, from){
            if(this.invincible)
                return;
            this.parent(amount, from);
        },
        draw: function(){
            if(this.invincible)
                this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1 ;
            this.parent();
        }
    });
    EntityBullet = ig.Entity.extend({
        size: {x: 9, y: 9},
        offset: {x: 2, y: -35},
        animSheet: new ig.AnimationSheet( 'media/energybullet.png', 9, 9 ),
        maxVel: {x: 450, y: 200},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function( x, y, settings) {
            this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = -(50 + (Math.random()*100));
            this.addAnim( 'idle', 0.2, [0] );
        },
        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y ){
                this.kill();
            }
        },
        check: function( other ) {
            other.receiveDamage( 3, this );
            this.kill();
        }
    });
    EntityMissile = ig.Entity.extend({
        size: {x: 26, y: 6},
        offset:{x:1, y:5},
        
        animSheet: new ig.AnimationSheet( 'media/missile.png', 26, 6 ),
        maxVel: {x: 100, y: 0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim( 'idle', 0.2, [1,2] );
        },
        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y ){
                this.kill();
            }
        },
        check: function( other ) {
            other.receiveDamage( 100, this );
            this.kill();
        },
        kill: function(){
            for(var i = 0; i < 75; i++)
                ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x+Math.floor((Math.random() * 24) + 1), this.pos.y+Math.floor((Math.random() * 12) + 1));
            this.parent();
        }
    });
    EntityGrenade = ig.Entity.extend({
        size: {x: 4, y: 4},
        offset: {x: 2, y: 2},
        animSheet: new ig.AnimationSheet( 'media/grenade.png', 8, 8 ),
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.PASSIVE,
        maxVel: {x: 200, y: 200},
        bounciness: 0.6,
        bounceCounter: 0,
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 7), y, settings );
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = -(50 + (Math.random()*100));
            this.addAnim( 'idle', 0.2, [0,1] );
        },
        handleMovementTrace: function( res ) {
        	this.parent( res );
        	if( res.collision.x || res.collision.y ) {
        		// only bounce 3 times
        		this.bounceCounter++;
        		if( this.bounceCounter > 3 ) {
        			this.kill();
        		}
        	}
        },
        check: function( other ) {
        	other.receiveDamage( 10, this );
        	this.kill();
        },
        kill: function(){
            for(var i = 0; i < 20; i++)
                ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);
            this.parent();
        }
    });
    EntityDeathExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
                this.idleTimer = new ig.Timer();
            },
            update: function() {
                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                    if(this.callBack)
                        this.callBack();
                    return;
                }
            }
    });
    EntityDeathExplosionParticle = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/blood.png', 2, 2 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
            this.addAnim( 'idle', 0.2, [frameID] );
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });
    EntityGrenadeParticle = ig.Entity.extend({
        size: {x: 1, y: 1},
        maxVel: {x: 160, y: 200},
        lifetime: 1,
        fadetime: 1,
        bounciness: 0.3,
        vel: {x: 40, y: 50},
        friction: {x:20, y: 20},
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.LITE,
        animSheet: new ig.AnimationSheet( 'media/explosion.png', 1, 1 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
            var frameID = Math.round(Math.random()*7);
            this.addAnim( 'idle', 0.2, [frameID] );
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });
});
