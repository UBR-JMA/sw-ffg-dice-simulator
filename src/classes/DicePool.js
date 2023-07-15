class DicePool {
    constructor(diceCount, modifiers = null) {
        this.diceCount = diceCount;
        this.modifiers = modifiers;
        this.emptyResults = {'s': 0, 'a': 0, 'f': 0, 't': 0, 'T': 0, 'D': 0}; 
        this.dice;
        this.totalCombos;
        this.results;
        this.totalValues;
        this.netValues;
        this.success;
        this.advantage;
        this.poolSummary;

        this.setDice();
    }
    setDice(){
        this.dice = [];
        for (var i = 0; i < this.diceCount['Proficiency']; i++) this.dice.push(new Proficiency());
        for (var i = 0; i < this.diceCount['Ability']; i++) this.dice.push(new Ability());
        for (var i = 0; i < this.diceCount['Boost']; i++) this.dice.push(new Boost());
        for (var i = 0; i < this.diceCount['Challenge']; i++) this.dice.push(new Challenge());
        for (var i = 0; i < this.diceCount['Difficulty']; i++) this.dice.push(new Difficulty());
        for (var i = 0; i < this.diceCount['Setback']; i++) this.dice.push(new Setback());
        let combos = 1;
        for (var i = 0; i < this.dice.length; i++) combos *= this.dice[i].numFaces;
        this.totalCombos = combos;
    }
    roll() {
        this.results = [];
        this.totalValues = this.netValues = null;
        this.poolSummary = this.advantage = this.success = null;
        for (var i = 0; i < this.dice.length; i++) {
        this.dice[i].roll();
        this.results.push(this.dice[i].result);
        }
        this.setTotalValues();
        this.setNetValues();
        this.setSuccess();
        this.setAdvantage();
        this.setPoolSummary();
    }
    setTotalValues() {
        this.totalValues = {'s': 0, 'a': 0, 'f': 0, 't': 0, 'T': 0, 'D': 0};
        for (let i = 0; i < this.results.length; i++) {
            for (let key in this.totalValues){
                this.totalValues[key] += this.results[i].value[key];
            }
        }
        if (this.modifiers != undefined){
            let combined = {'s': 0, 'a': 0, 'f': 0, 't': 0, 'T': 0, 'D': 0};
            for (let key in combined){
                combined[key] = this.totalValues[key] + this.modifiers[key];
            }
            this.totalValues = combined;
        }
    }
    setNetValues(){
        this.netValues = {'s': 0, 'a': 0, 'f': 0, 't': 0, 'T': 0, 'D': 0};
        // The best way to DRY this out would be to further connect successes/failures and advantages/threats on a more fundamental level.
        // In such a case, the effort required to create that connection would be more than the effort required to just write this out.
        this.netValues['s'] = this.totalValues['s'] > this.totalValues['f'] ? this.totalValues['s'] - this.totalValues['f'] : 0;
        this.netValues['a'] = this.totalValues['a'] > this.totalValues['t'] ? this.totalValues['a'] - this.totalValues['t'] : 0;
        this.netValues['f'] = this.totalValues['f'] > this.totalValues['s'] ? this.totalValues['f'] - this.totalValues['s'] : 0;
        this.netValues['t'] = this.totalValues['t'] > this.totalValues['a'] ? this.totalValues['t'] - this.totalValues['a'] : 0;
        this.netValues['T'] = this.totalValues['T'];
        this.netValues['D'] = this.totalValues['D'];
        //Note that the netValues are derived from the totalValues, not the results.
        //This means we don't need to redo the modifier math, since it's already been done.
    }
    setSuccess() {
        this.success = this.getNetValues()['s'] > 0;
    }
    setAdvantage() {
        this.advantage = this.getNetValues()['a'] > 0;
    }
    setPoolSummary(){
        this.poolSummary = "";
        let str = "";
        let successes = this.netValues['s'];
        let advantages = this.netValues['a'];
        let triumphs = this.netValues['T'];
        let failures = this.netValues['f'];
        let threats = this.netValues['t'];
        let despairs = this.netValues['D'];
        if (successes > 0) str += successes + " SUCCESS" + (successes > 1 ? "ES" : "");
        if (advantages > 0) str += (str.length > 0 ? ", " : "") + advantages + " ADVANTAGE" + (advantages > 1 ? "S" : "");
        if (triumphs > 0) str += (str.length > 0 ? ", " : "") + triumphs + " TRIUMPH" + (triumphs > 1 ? "S" : "");
        if (failures > 0) str += (str.length > 0 ? ", " : "") + failures + " FAILURE" + (failures > 1 ? "S" : "");
        if (threats > 0) str += (str.length > 0 ? ", " : "") + threats + " THREAT" + (threats > 1 ? "S" : "");
        if (despairs > 0) str += (str.length > 0 ? ", " : "") + despairs + " DESPAIR" + (despairs > 1 ? "S" : "");
        this.poolSummary = str;
    }

    getDiceCount()  { return this.diceCount; }
    getModifiers()  { return this.modifiers; }
    getDice()       { return this.dice; }
    getTotalCombos(){ return this.totalCombos; }
    getResults()    { return this.results; }
    getTotalValues(){ return this.totalValues; }
    getNetValues()  { return this.netValues; }
    getSuccess()    { return this.success; }
    getAdvantage()  { return this.advantage; }
    getPoolSummary(){ return this.poolSummary; }
    toString() {
        let str = "";
        for (var i = 0; i < this.dice.length; i++) {
        str += this.dice[i].toString() + "\n";
        }
        return str;
    }
}
