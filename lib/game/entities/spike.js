ig.module(
	'game.entities.spike'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntitySpike = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/spikes.png', 32, 16 ),
    size: {x: 32, y:16},
    flip: false,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    init: function( x, y, settings ) {
    	this.parent( x, y, settings );
    },
    update: function() {
    	// near an edge? return!
    	this.parent();
    },
    check: function( other ) {
    	//other.receiveDamage( 10, this );
    },
});
});