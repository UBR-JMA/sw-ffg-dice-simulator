class Setback extends Die {
    constructor() {
        super(6, "Setback");
        this.dieFaces = [
            new DieFace("BLANK"),
            new DieFace("BLANK"),
            new DieFace("FAILURE"),
            new DieFace("FAILURE"),
            new DieFace("THREAT"),
            new DieFace("THREAT"),
        ];
        this.numFaces = this.dieFaces.length;
    }
}