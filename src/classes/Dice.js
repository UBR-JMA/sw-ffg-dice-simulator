class Dice {
    constructor (diceCountArray) {
        this.diceCountArray = diceCountArray;
        this["Proficiency"] = diceCountArray[0],
        this["Ability"]     = diceCountArray[1],
        this["Boost"]       = diceCountArray[2],
        this["Challenge"]   = diceCountArray[3],
        this["Difficulty"]  = diceCountArray[4],
        this["Setback"]     = diceCountArray[5]
    }
}
