class Dead extends Phaser.Scene{
    constructor() {
        super("Dead")
    }

    preload(){
        this.load.image('deadScreen','./assets/images/ponnyhof_screen.png');
    }

    create() {
        let deadsSreen = this.add.image((window.innerWidth - 1000),(window.innerHeight - 550),'deadScreen');
    }
}