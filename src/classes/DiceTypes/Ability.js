class Ability extends Die {
    constructor() {
        super(8, "Ability");
        this.dieFaces = [
            new DieFace("BLANK"),
            new DieFace("SUCCESS"),
            new DieFace("SUCCESS"),
            new DieFace("ADVANTAGE"),
            new DieFace("ADVANTAGE"),
            new DieFace("SUCCESS ADVANTAGE"),
            new DieFace("DOUBLE SUCCESS"),
            new DieFace("DOUBLE ADVANTAGE"),
        ];
        this.numFaces = this.dieFaces.length;
    }
}
