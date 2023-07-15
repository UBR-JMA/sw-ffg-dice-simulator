class Boost extends Die {
    constructor() {
        super(6, "Boost");
        this.dieFaces = [
            new DieFace("BLANK"),
            new DieFace("BLANK"),
            new DieFace("SUCCESS"),
            new DieFace("ADVANTAGE"),
            new DieFace("SUCCESS ADVANTAGE"),
            new DieFace("DOUBLE ADVANTAGE"),
        ];
        this.numFaces = this.dieFaces.length;
    }
}
