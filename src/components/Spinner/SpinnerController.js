class SpinnerController {
    constructor() {
        this.isShown = false;
        this.OVERLAY_SPEED = 500;
        this.SPRITE_SPEED = 250;
        this.$OVERLAY = $('#spinner-overlay');
        this.$SPRITE = $('#spinner-sprite');
    }
    hide(){
        this.$SPRITE.fadeOut(this.SPRITE_SPEED);
        this.$OVERLAY.fadeOut(this.OVERLAY_SPEED);
        this.isShown = false;
    }
    show(){
        this.$SPRITE.fadeIn(this.SPRITE_SPEED);
        this.$OVERLAY.fadeIn(this.OVERLAY_SPEED);
        this.isShown = true;
    }
    toggle(){
        this.isShown ? this.hide() : this.show()
    }
}