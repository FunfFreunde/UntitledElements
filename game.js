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
      gravity: { y: 420 },
      debug: true,
    },
  }
};

const game = new Phaser.Game(config);

function preload()
{
  this.load.image('background', './assets/images/background.png');
  this.load.image('tiles', './assets/tilesets/platformPack_tilesheet.png');
  this.load.tilemapTiledJSON('map', './assets/tilemaps/level1.json');
  this.load.atlas('player', 'assets/images/duckface.png', 'assets/images/duckface_player_atlas.json');
  this.load.audio('bgmusic', ['assets/audio/bg.mp3']);
  this.load.image('water', './assets/images/water.png');
  this.load.atlas('fire', 'assets/images/fire.png', 'assets/images/fire.json');
}

function create()
{
  const backgroundImage = this.add.image(-500,0,'background').setOrigin(0.0);
  backgroundImage.setScale(16, 3.5);

  const map = this.make.tilemap( { key: 'map' } );

  const tileset = map.addTilesetImage('simple_platformer', 'tiles');

  const platforms = map.createStaticLayer('Platforms',tileset, 0, 230);

  platforms.setCollisionByExclusion(-1, true);

  this.player = this.physics.add.sprite(0, 0, 'player');
  this.player.setBounce(0.05);
  this.player.setCollideWorldBounds(false);
  this.physics.add.collider(this.player, platforms);

  this.waters = this.physics.add.group({
    allowGravity: true,
    setBounce: 1
  });

  this.physics.add.collider(this.waters, platforms);

  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNames('player', {
      prefix: 'robo_player_',
      start: 0,
      end: 2,
    }),
    framerate: 3,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: [{ key: 'player', frame: 'robo_player_0' }],
    framereate: 3,
  });

  this.anims.create({
    key: 'jump',
    frames: [{ key: 'player', frame: 'robo_player_1' }],
    framerate: 3,
  });

  this.cursors = this.input.keyboard.createCursorKeys();
  this.a_key = this.input.keyboard.addKey('A');
  this.d_key = this.input.keyboard.addKey('D');
  this.w_key = this.input.keyboard.addKey('W');
  
  this.cameras.main.startFollow(this.player);
  playerReset(this.player);

    // load audio
    //music = this.sound.add('hotttt', true);
    //music.play();
    let bgmusic = this.sound.add('bgmusic')
    bgmusic.play({
      volume: .3,
      loop: true
    })

  this.fires = this.physics.add.group({
    allowGravity: false,
    immovable: true,
  });

  this.anims.create({
    key: 'burn',
    frames: this.anims.generateFrameNames('fire', {
      prefix: 'lit_',
      start: 0,
      end: 1
    }),
    framerate: 10,
    repeat: -1
  });
  this.fires.create(400, 2900, 'fire');
  this.fires.create(500, 645, 'fire');
  this.fires.playAnimation('burn');
}


function update()
{
  if(this.cursors.left.isDown || this.a_key.isDown)
  {
    this.player.setVelocityX(-300);
    if(this.player.body.onFloor()) { this.player.play('walk', true); }
  }
  else if(this.cursors.right.isDown || this.d_key.isDown)
  {
    this.player.setVelocityX(300);
    if(this.player.body.onFloor()) { this.player.play('walk', true); }
  }
  else
  {
    this.player.setVelocityX(0);
    if(this.player.body.onFloor()) { this.player.play('idle', true); }
  }

  if((this.cursors.up.isDown || this.cursors.space.isDown || this.w_key.isDown) && this.player.body.onFloor())
  {
    this.player.setVelocityY(-350);
    this.player.play('jump', true);
  }

  pointer = this.input.activePointer;

  if(pointer.isDown)
  {
    var x = pointer.worldX;
    var y = pointer.worldY;

    var vecX = pointer.worldX - this.player.x;
    var vecY = pointer.worldY - this.player.y;

    //vecX = vecX / Math.sqrt(vecX * vecX + vecY * vecY);
    //vecY = vecY / Math.sqrt(vecX * vecX + vecY * vecY);

    vecX = 2 * vecX;
    vecY = 2 * vecY;

    this.waters.create(this.player.x, this.player.y, 'water');
    w = this.waters.getChildren();
    w = w[w.length - 1];
    w.body.velocity.x = vecX;
    w.body.velocity.y = vecY;
  }

  this.waters.getChildren().forEach(function(e)
  {
    if(e.body.onFloor()) { e.destroy(); }
  });

  if(this.player.body.velocity.x > 0)
  {
    this.player.setFlipX(false);
  }
  else if (this.player.body.velocity.x < 0)
  {
    this.player.setFlipX(true);
  }

  if(this.player.body.velocity.y > 0) { this.player.body.velocity.y = this.player.body.velocity.y * 1.07 }
  if(this.player.body.velocity.y > 500) { this.player.body.velocity.y = 700}

  if(!checkPlayerBounds(this.player, 50, 300, 64)){ playerReset(this.player) }

}

function checkPlayerBounds(player, worldH, worldW, tileSize)
{
  if (player.x < -250) { return false }
  if (player.y < 0) {return false}
  if (player.x > worldW * tileSize + 250) {return false}
  if (player.y > worldH * tileSize + 500) {return false}
  return true;
}

function playerReset(player)
{
  player.setVelocity(0);
  player.setX(400);
  player.setY(2900);
  player.play('idle', true);
}