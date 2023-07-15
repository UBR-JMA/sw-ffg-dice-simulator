class Difficulty extends Die {
    constructor() {
        super(8, "Difficulty");
        this.dieFaces = [
            new DieFace("BLANK"),
            new DieFace("FAILURE"),
            new DieFace("THREAT"),
            new DieFace("THREAT"),
            new DieFace("THREAT"),
            new DieFace("FAILURE THREAT"),
            new DieFace("DOUBLE FAILURE"),
            new DieFace("DOUBLE THREAT"),
        ];
        this.numFaces = this.dieFaces.length;
    }
}
