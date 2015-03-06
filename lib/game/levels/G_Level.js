ig.module( 'game.levels.G_Level' )
.requires( 'impact.image' )
.defines(function(){
LevelG_Level=/*JSON[*/{
	"entities": [],
	"layer": [
		{
			"name": "collision",
			"width": 12,
			"height": 12,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "",
			"repeat": false,
			"preRender": false,
			"distance": 1,
			"tilesize": 16,
			"foreground": false,
			"data": [
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]
			]
		},
		{
			"name": "g_world",
			"width": 12,
			"height": 12,
			"linkWithCollision": true,
			"visible": 1,
			"tilesetName": "media/dorm-tiles.png",
			"repeat": false,
			"preRender": false,
			"distance": "1",
			"tilesize": 16,
			"foreground": false,
			"data": [
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,7,7,7,7,7,7,7,7,7,7,1],
				[1,7,7,7,7,7,7,7,7,7,7,1],
				[1,7,7,30,30,30,30,30,30,7,7,1],
				[1,7,7,30,7,7,7,7,30,7,7,1],
				[1,7,7,30,7,7,7,7,7,7,7,1],
				[1,7,7,30,7,13,13,13,13,7,7,1],
				[1,7,7,30,7,7,7,7,30,7,7,1],
				[1,7,7,30,14,14,14,14,30,7,7,1],
				[1,7,7,7,7,7,7,7,7,7,7,1],
				[1,7,7,7,7,7,7,7,7,7,7,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]
			]
		}
	]
}/*]JSON*/;
LevelG_LevelResources=[new ig.Image('media/dorm-tiles.png')];
});