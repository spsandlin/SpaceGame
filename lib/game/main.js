ig.module( 
	'game.main' 
)
.requires(
    'impact.game',
    'game.levels.firstspacelevel',
    'game.levels.secondspacelevel',
    'game.levels.levelselector',
    'impact.font',
    'impact.debug.debug',
    'plugins.camera'
)

.defines(function(){

MyGame = ig.Game.extend({
    gravity: 150,
    instructText: new ig.Font( 'media/couriernewfont.png' ),
    statText: new ig.Font( 'media/04b03.font.png' ),
    livesText: new ig.Font('media/uga_font.png'),
    showStats: false,
    statMatte: new ig.Image('media/stat-matte.png'),
    levelTimer: new ig.Timer(),
    levelExit: null,
    stats: {time: 0, kills: 0, deaths: 0},
    lives: 3,
    boosts: 0,
    levelsUnlocked: 3,
    starting: true,
    description: false,
    lifeSprite: new ig.Image('media/life-sprite.png'),
    boostSprite:new ig.Image('media/boostsprite.png'),
    title: new ig.Image('media/title_pic.png'),
    desc: new ig.Image('media/desc-pic.png'),

    
	init: function() {
        this.loadLevel(LevelFirstspacelevel );
        // Bind keys
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind( ig.KEY.X, 'jump' );
        ig.input.bind( ig.KEY.C, 'shoot' );
        ig.input.bind( ig.KEY.TAB, 'switch' );
        ig.input.bind( ig.KEY.SPACE, 'boostJump'); 
        ig.input.bind( ig.KEY.V, 'kick');
        ig.input.bind( ig.KEY.SHIFT, 'start');
        ig.music.add( 'media/sounds/theme.*' );
        ig.music.volume = 0.5;
        this.levelsUnlocked = 3;
        //ig.music.play();
        this.setupCamera();
	},
    loadLevel: function( data ) {
        this.stats = {time: 0, kills: 0, deaths: 0};
    	this.parent(data);
        this.levelTimer.reset();
    },
    setupCamera: function(){
        var player = this.getEntitiesByType( EntityPlayer )[0];
        this.camera=new ig.Camera(ig.system.width/3,ig.system.height/3,3);
        this.camera.trap.size.x=ig.system.width/10;
        this.camera.trap.size.y=ig.system.height/3;
        this.camera.lookAhead.x=ig.system.width/6;
        this.camera.max.x=this.collisionMap.pxWidth-ig.system.width;
        this.camera.max.y=this.collisionMap.pxHeight-ig.system.height;
        this.camera.set(player);
    },
    update: function() {
    	// screen follows the player
    	var player = this.getEntitiesByType( EntityPlayer )[0];
    	if( player ) {
    		this.screen.x = player.pos.x - ig.system.width/2;
    		this.screen.y = player.pos.y - ig.system.height/2;
            
    	}
    	// Update all entities and BackgroundMaps
        if(!this.showStats){
        	this.parent();
        }else{
            if(ig.input.state('continue')){
                this.showStats = false;
                this.levelExit.nextLevel();
                this.parent();
            }
        }
        if(this.starting||this.description){
            player.allowInput = false;
        }
            
        if(ig.input.pressed ('start')){
            if(this.starting){
                this.starting = false;
                this.description = true;
            }
            else if(this.description){
                player.allowInput = true;
                this.description = false;
            }
        }
    },
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
        var player = this.getEntitiesByType( EntityPlayer )[0];
      
        if(this.showStats){
            this.statMatte.draw(0,0);
            var x = ig.system.width;
            var y = ig.system.height;
            this. statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);
            this. statText.draw('Time: '+this.stats.time, x, y+30, ig.Font.ALIGN.CENTER);
            this. statText.draw('Kills: '+this.stats.kills, x, y+40, ig.Font.ALIGN.CENTER);
            this. statText.draw('Deaths: '+this.stats.deaths, x, y+50, ig.Font.ALIGN.CENTER);
            this. statText.draw('Press Spacebar to continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
        }
        
        
        if(this.starting){
            
            this.title.draw((ig.system.width - this.title.width)/2, 0);
            var x = ig.system.width/2,
            y = ig.system.height - 10;
            this.instructText.draw( 'Press Shift To Start', ((ig.system.width - this.title.width)/2)+355, this.title.height-65, ig.Font.ALIGN.CENTER );
            this.instructText.draw( 'Left/Right Moves, X Jumps, C Fires, V SPACE Boost Jumps.', ((ig.system.width - this.title.width)/2)+355,this.title.height-30, ig.Font.ALIGN.CENTER );
        }
        else if(this.description){
            this.desc.draw((ig.system.width - this.title.width)/2, 0);
            this.instructText.draw( 'Press Shift To Start', ((ig.system.width - this.title.width)/2)+355, this.title.height, ig.Font.ALIGN.CENTER );

        }
        else{
            this.instructText.draw("Health: " + player.health,5, 5);
            this.instructText.draw("Lives:", 5,35);
            for(var i=0; i < this.lives; i++)
                this.lifeSprite.draw(((this.lifeSprite.width + 5) * i)+100, 30);
            this.instructText.draw("Boosts:", 5,65);
            for(var i=0; i < this.boosts; i++)
                this.boostSprite.draw(((this.boostSprite.width + 5) * i)+95, 65);
        }
            
	},
    toggleStats: function(levelExit){
        this.showStats = true;
        this.stats.time = Math.round(this.levelTimer.delta());
        this.levelExit = levelExit;
    },
    gameOver: function(){
        ig.finalStats = ig.game.stats;
        ig.system.setGame(GameOverScreen);
    }
});

StartScreen = ig.Game.extend({
    instructText: new ig.Font( 'media/04b03.font.png' ),
    background: new ig.Image('media/screen-bg.png'),
    mainCharacter: new ig.Image('media/screen-main-character.png'),
    title: new ig.Image('media/game-title.png'),
    init: function() {
        ig.input.bind( ig.KEY.SPACE, 'start');
    },
    update: function() {
        if(ig.input.pressed ('start')){
            ig.system.setGame(MyGame)
        }
        this.parent();
    },
    draw: function() {
        this.parent();
        this.background.draw(0,0);
        this.mainCharacter.draw(0,0);
        this.title.draw(ig.system.width - this.title.width, 0);
        var x = ig.system.width/2,
        y = ig.system.height - 10;
        this.instructText.draw( 'Press Spacebar To Start', x+40, y, ig.Font.ALIGN.CENTER );
    }
});

GameOverScreen = ig.Game.extend({
    instructText: new ig.Font( 'media/04b03.font.png' ),
    background: new ig.Image('media/screen-bg.png'),
    gameOver: new ig.Image('media/game-over.png'),
    stats: {},
    init: function() {
        ig.input.bind( ig.KEY.SPACE, 'start');
        this.stats = ig.finalStats;
    },
    update: function() {
        if(ig.input.pressed('start')){
            ig.system.setGame(StartScreen)
        }
        this.parent();
    },
    draw: function() {
        this.parent();
        this.background.draw(0,0);
        var x = ig.system.width/2;
        var y = ig.system.height/2 - 20;
        this.gameOver.draw(x - (this.gameOver.width * .5), y - 30);
        var score = (this.stats.kills * 100) - (this.stats.deaths * 50);
        this.instructText.draw('Total Kills: '+this.stats.kills, x, y+30, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Total Deaths: '+this.stats.deaths, x, y+40, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Score: '+score, x, y+50, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Press Spacebar To Continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
    }
});

if( ig.ua.mobile ) {
    // Disable sound for all mobile devices
    ig.Sound.enabled = false;
}
var scale=(window.innerWidth<640)?2:1;
var canvas=document.getElementById('canvas');
canvas.style.width=window.innerWidth+'px';
canvas.style.height=window.innerHeight+'px';
window.addEventListener('resize',function(){
    if(!ig.system){return;}
    canvas.style.width=window.innerWidth+'px';
    canvas.style.height=window.innerHeight+'px';
    ig.system.resize(window.innerWidth*scale,window.innerHeight*scale);
    if(ig.game&&ig.game.setupCamera){
        ig.game.setupCamera();
    }
    if(window.myTouchButtons){
        window.myTouchButtons.align();
    }
},false);
var width=window.innerWidth*scale,height=window.innerHeight*scale;
ig.main( '#canvas', MyGame, 60, width, height, 1 );
});
