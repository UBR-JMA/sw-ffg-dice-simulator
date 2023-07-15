class Modifiers {
    constructor (modList) {
        this.modList = modList;
        this['s'] = modList[0];
        this['a'] = modList[1];
        this['f'] = modList[2];
        this['t'] = modList[3];
        this['T'] = modList[4];
        this['D'] = modList[5];
    }
}