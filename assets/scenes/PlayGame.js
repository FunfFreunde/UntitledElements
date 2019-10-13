class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame")
    }

    create() {
        let style = {font: "bold  50px Arial", boundsAlignH: "center", boundsAlignV: "middle"};
        this.add.text(0, 0, "Press Space to Start", style);
        this.text.setTextBounds(0, 100, 800, 100);
    }
}