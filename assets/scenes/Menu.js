class Menu extends Phaser.Scene{
    constructor() {
        super("Menu")
    }

    preload(){
        this.load.image('bg','/assets/images/background.png')
    }

    create() {
        let bg = this.add.image(20,20,'bg').setOrigin(0,0);
    }
}