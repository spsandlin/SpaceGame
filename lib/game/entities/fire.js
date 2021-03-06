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
	'game.entities.fire'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityFire = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.7)',
	
	 type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

	check: function( other ) {
    	other.kill();
    },
	update: function(){}
});

});