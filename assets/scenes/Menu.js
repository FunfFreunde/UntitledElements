class Menu extends Phaser.Scene{
    constructor() {
        super("Menu")
    }

    preload(){
        this.load.image('startScreen','./assets/images/start_screen.png');
    }

    create() {
        let startMenu = this.add.image((window.innerWidth - 1000),(window.innerHeight - 550),'startScreen');
    }
}