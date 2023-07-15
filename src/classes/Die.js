class Die {
    constructor(numFaces, name) {
        this.result;
        this.numFaces = numFaces;
        this.name = name;
        this.trueValues = {'s': 0, 'a': 0, 'f': 0, 't': 0, 'T': 0, 'D': 0};
        this.cancelledValues = {'s': 0, 'a': 0, 'f': 0, 't': 0, 'T': 0, 'D': 0};
        this.success = 0;
        this.advantage = 0;
    }
    roll() {
        this.result = this.dieFaces[Math.floor(Math.random() * this.dieFaces.length)];
    }
    toString() {
        if (this.result != undefined){
        let str = "";
        str += this.name + '.'.repeat(12 - this.name.length);
        str += '.'.repeat(20 - this.result.face.length) + this.result.face;
        return str;
        } else {
        return this.name;
        }
    }
}