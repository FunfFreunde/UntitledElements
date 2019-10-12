const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  heigth: 640,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true,
    },
  }
};

const game = new Phaser.Game(config);

function preload()
{
  this.load.image('background', './assets/images/background.png');
  this.load.image('spike', './assets/images/spike.png');
  this.load.image('tiles', './assets/tilesets/platformPack_tilesheet.png');
  this.load.tilemapTiledJSON('map', './assets/tilemaps/level1.json');
  this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
}

function create()
{
  const backgroundImage = this.add.image(0,0,'background').setOrigin(0.0);
  backgroundImage.setScale(2, 0.8);

  const map = this.make.tilemap( { key: 'map' } );

  const tileset = map.addTilesetImage('kenny_simple_platformer', 'tiles');

  const platforms = map.createStaticLayer('Platforms',tileset, 0, 230);

  platforms.setCollisionByExclusion(-1, true);

  this.player = this.physics.add.sprite(500, 300, 'player');
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(true);
  this.physics.add.collider(this.player, platforms);

  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNames('player', {
      prefix: 'robo_player_',
      start: 2,
      end: 3,
    }),
    framerate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: [{ key: 'player', frame: 'robo_player_0' }],
    framereate: 10,
  });

  this.anims.create({
    key: 'jump',
    frames: [{ key: 'player', frame: 'robo_player_1' }],
    framerate: 10,
  });

  this.cursors = this.input.keyboard.createCursorKeys();



  this.spikes = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  const spikeObjects = map.getObjectLayer('Spikes')['objects'];

  spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y + 200 - spikeObject.height/2, 'spike').setOrigin(0,0);
    spike.body.setSize(spike.width, spike.height/2).setOffset(0, spike.height/2);
  });

  this.cameras.main.startFollow(this.player);
}

function update()
{
  if(this.cursors.left.isDown)
  {
    this.player.setVelocityX(-200);
    if(this.player.body.onFloor()) { this.player.play('walk', true); }
  }
  else if(this.cursors.right.isDown)
  {
    this.player.setVelocityX(200);
    if(this.player.body.onFloor()) { this.player.play('walk', true); }
  }
  else
  {
    this.player.setVelocityX(0);
    if(this.player.body.onFloor()) { this.player.play('idle', true); }
  }

  if((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.onFloor())
  {
    this.player.setVelocityY(-350);
    this.player.play('jump', true);
  }

  if(this.player.body.velocity.x > 0)
  {
    this.player.setFlipX(false);
  }
  else if (this.player.body.velocity.x < 0)
  {
    this.player.setFlipX(true);
  }
}

function playerHit(player, fire)
{
  player.setVelocity(0);
  player.setX(50);
  player.setY(50);
  player.play('idle', true);
}

