ig.module(
	'game.entities.booster'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBooster = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/booster.png', 32, 32 ),
    size: {x: 32, y: 32},
    offset: {x: 0, y: 0},
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    init: function( x, y, settings ) {
    	this.parent( x, y, settings );
    	this.addAnim('rotate', .25, [0,1,2,3,4,5]);
    },
    update: function() {
    	// near an edge? return!
    	this.parent();
    },
    check: function( other ) {
        other.boostJumps++;
        ig.game.boosts++;
    	this.kill();
    },
    kill: function(){
        this.parent();
        ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset: 1});
    }
});
});
