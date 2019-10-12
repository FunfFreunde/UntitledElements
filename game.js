const config = {
  type: Phaser.AUTO,
  width: 800,
  heigth: 640,
  scene: {
    preload: preload,
    create: create,
    update: update,
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
{ }

function create()
{ }

function update()
{ }
