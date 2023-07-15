class Challenge extends Die {
    constructor() {
        super(12, "Challenge");
        this.dieFaces = [
            new DieFace("BLANK"),
            new DieFace("FAILURE"),
            new DieFace("FAILURE"),
            new DieFace("THREAT"),
            new DieFace("THREAT"),
            new DieFace("FAILURE THREAT"),
            new DieFace("FAILURE THREAT"),
            new DieFace("DOUBLE FAILURE"),
            new DieFace("DOUBLE FAILURE"),
            new DieFace("DOUBLE THREAT"),
            new DieFace("DOUBLE THREAT"),
            new DieFace("DESPAIR"),
        ];
        this.numFaces = this.dieFaces.length;
    }
}
