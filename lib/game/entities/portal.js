/*
This entity gives damage (through ig.Entity's receiveDamage() method) to
the entity that is passed as the first argument to the triggeredBy() method.

I.e. you can connect an EntityTrigger to an EntityHurt to give damage to the
entity that activated the trigger.


Keys for Weltmeister:

damage
	Damage to give to the entity that triggered this entity.
	Default: 10
*/

ig.module(
	'game.entities.portal'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityPortal = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.7)',
    animSheet: new ig.AnimationSheet( 'media/portal.png', 64, 64 ),
    size: {x: 64, y:64},
    offset: {x: 0, y: 0},
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    init: function( x, y, settings ) {
    	this.parent( x, y, settings );
    	this.addAnim('idle', .12, [0,1,2,3]);
    },
	check: function( other ) {
    	ig.game.loadLevelDeferred(LevelSecondspacelevel);
    },
	update: function(){
        this.parent();
    }
});

});