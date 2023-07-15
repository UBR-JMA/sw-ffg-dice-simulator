class Proficiency extends Die {
    constructor() {
        super(12, "Proficiency");
        this.dieFaces = [
            new DieFace("BLANK"),
            new DieFace("SUCCESS"),
            new DieFace("SUCCESS"),
            new DieFace("ADVANTAGE"),
            new DieFace("SUCCESS ADVANTAGE"),
            new DieFace("SUCCESS ADVANTAGE"),
            new DieFace("SUCCESS ADVANTAGE"),
            new DieFace("DOUBLE SUCCESS"),
            new DieFace("DOUBLE SUCCESS"),
            new DieFace("DOUBLE ADVANTAGE"),
            new DieFace("DOUBLE ADVANTAGE"),
            new DieFace("TRIUMPH"),
        ];
        this.numFaces = this.dieFaces.length;
    }
}
