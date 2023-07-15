
class DiceTrial {
    constructor(dicePool, numRolls){
        this.dicePool = dicePool;
        this.numRolls = numRolls;
        this.results = [];
        this.cancelledResults = [];
        this.tabulatedResults;
        this.tabulatedResultsPercents
        this.cancelledTabulatedResults;
        this.cancelledTabulatedResultsPercents;
        this.totalValues;
        this.averageValues;
        this.trialSummary;
        this.cancelledTotalValues;
        this.cancelledAverageValues;
        this.cancelledtrialSummary;
        
    }
    runTrial(){
        for (var i = 0; i < this.numRolls; i++) {
            this.dicePool.roll();
            this.results.push(this.dicePool.getTotalValues());
            this.cancelledResults.push(this.dicePool.getNetValues());
        }
    }
    setTabulatedResults(){
        //this function aims to get the magnitude of occurrenses of each result
        //this will be used to construct a bell curve or histogram of results
        //for example, each roll can have a number of 'successes'
        //this function will tally the number of times 1 success was rolled, 2 successes, 3 successes, etc.
        let tabulated = {'s': {}, 'a': {}, 'f': {}, 't': {}, 'T': {}, 'D': {}};
        //for each result in the results array
        for (let i = 0; i < this.results.length; i++) {
        //for each key in the result
        for (let key in this.results[i]) {
            //if the key is in the tabulated object, add the value to the key
            if (tabulated[key][this.results[i][key]] == null) {
            tabulated[key][this.results[i][key]] = 1;
            } else {
            tabulated[key][this.results[i][key]]++;
        }}}

        //get the max occurrence
        let occurrences = [];
        for (let outcome in tabulated) { occurrences.push(Object.keys(tabulated[outcome]));}
        occurrences = [...new Set(occurrences.flat())];
        let max = Math.max(...occurrences);
        //use the max occurrence to ensure that the tabulated object has a key for every possible outcome
        for (let outcome in tabulated) {
        for (let i = 0; i <= max; i++) {
            if (tabulated[outcome][i] == null) {
            tabulated[outcome][i] = 0;
        }}}

        this.tabulatedResults = tabulated;
    }
    setTabulatedResultsPercents(){
        this.tabulatedResults ?? this.setTabulatedResults();
        // this function takes the tabulated results and converts the values to percents
        // for each key of the tabulated results, there is a dictionry of values
        // the key of that dictionary is the quantity of a given outcome for any given roll,
        // and the value of that dictionary is the number of times that quantity of outcome was rolled
        // this function will convert the values of the dictionary to percents
        // for example, if there are 200 rolls, and 50 of them had 2 successes,
        // the value of the ['s'] dictionary for the key '2' will be 25% (50/200)
        let tabulatedPercents = {'s': {0:0}, 'a': {0:0}, 'f': {0:0}, 't': {0:0}, 'T': {0:0}, 'D': {0:0}};
        for (var key in this.tabulatedResults) {
        tabulatedPercents[key] = {};
        for (var key2 in this.tabulatedResults[key]) {
            tabulatedPercents[key][key2] = (this.tabulatedResults[key][key2] / this.numRolls) * 100;
        }
        }
        this.tabulatedResultsPercents = tabulatedPercents;
    }
    setCancelledTabulatedResults(){
        //this function will work in almost the exact same way as setTabulatedResults
        //with the exception that it will be getting the cancelledValues instead of the trueValues of each roll
        let netTabulated = {'s': {}, 'a': {}, 'f': {}, 't': {}, 'T': {}, 'D': {}};
        for (var i = 0; i < this.cancelledResults.length; i++) {
        for (var key in this.cancelledResults[i]) {
            if (netTabulated[key][this.cancelledResults[i][key]] == null) {
            netTabulated[key][this.cancelledResults[i][key]] = 1;
            } else {
            netTabulated[key][this.cancelledResults[i][key]]++;
        }}}

        //get the max occurrence
        let occurrences = [];
        for (let outcome in netTabulated) {
        occurrences.push(Object.keys(netTabulated[outcome]));
        }
        occurrences = [...new Set(occurrences.flat())];
        let max = Math.max(...occurrences);
        //use the max occurrence to ensure that the cancelledTabulated object has a key for every possible outcome
        for (let outcome in netTabulated) {
        for (let i = 0; i <= max; i++) {
            if (netTabulated[outcome][i] == null) {
            netTabulated[outcome][i] = 0;
        }}}


        this.cancelledTabulatedResults = netTabulated;
    }
    setCancelledTabulatedResultsPercents(){
        // this function will work like setTabulatedResultsPercents, but with the cancelledTabulatedResults
        this.cancelledTabulatedResults ?? this.setCancelledTabulatedResults();
        let tabulatedPercents = {};
        for (var key in this.cancelledTabulatedResults) {
        tabulatedPercents[key] = {};
        for (var key2 in this.cancelledTabulatedResults[key]) {
            tabulatedPercents[key][key2] = (this.cancelledTabulatedResults[key][key2] / this.numRolls) * 100;
        }
        }
        this.cancelledTabulatedResultsPercents = tabulatedPercents;
    }
    setTotalValues(){
        let totalValues = {'s': 0, 'a': 0, 'f': 0, 't': 0, 'T': 0, 'D': 0};
        for (var i = 0; i < this.results.length; i++) {
        for (let key in totalValues) {
            totalValues[key] += this.results[i][key];
        }}
        this.totalValues = totalValues;
    }
    setAverageValues(){
        (this.totalValues == undefined) && this.setTotalValues();
        this.averageValues = {'s': 0.0, 'a': 0.0, 'f': 0.0, 't': 0.0, 'T': 0.0, 'D': 0.0};
        for (var key in this.totalValues) {
        this.averageValues[key] = this.totalValues[key] / this.numRolls;
        }
    }
    setTrialSummary(){
        (this.averageValues == undefined) && this.setAverageValues();
        this.trialSummary = "";
        let str = `For ${this.numRolls} rolls, the average results are:\n`;
        let successes   = this.averageValues['s'].toFixed(3);
        let advantages  = this.averageValues['a'].toFixed(3);
        let triumphs    = this.averageValues['T'].toFixed(3);
        let failures    = this.averageValues['f'].toFixed(3);
        let threats     = this.averageValues['t'].toFixed(3);
        let despairs    = this.averageValues['D'].toFixed(3);
        if (successes > 0) str += successes + " SUCCESS" + (successes > 1 ? "ES" : "");
        if (advantages > 0) str += (str.length > 0 ? ", " : "") + advantages + " ADVANTAGE" + (advantages > 1 ? "S" : "");
        if (triumphs > 0) str += (str.length > 0 ? ", " : "") + triumphs + " TRIUMPH" + (triumphs > 1 ? "S" : "");
        if (failures > 0) str += (str.length > 0 ? ", " : "") + failures + " FAILURE" + (failures > 1 ? "S" : "");
        if (threats > 0) str += (str.length > 0 ? ", " : "") + threats + " THREAT" + (threats > 1 ? "S" : "");
        if (despairs > 0) str += (str.length > 0 ? ", " : "") + despairs + " DESPAIR" + (despairs > 1 ? "S" : "");
        this.trialSummary = str;
    }
    setCancelledTotalValues(){
        this.cancelledTotalValues = {'s': 0.0, 'a': 0.0, 'f': 0.0, 't': 0.0, 'T': 0.0, 'D': 0.0};
        this.cancelledTotalValues['s'] = this.totalValues['s'] > this.totalValues['f'] ? this.totalValues['s'] - this.totalValues['f'] : 0;
        this.cancelledTotalValues['a'] = this.totalValues['a'] > this.totalValues['t'] ? this.totalValues['a'] - this.totalValues['t'] : 0;
        this.cancelledTotalValues['f'] = this.totalValues['f'] > this.totalValues['s'] ? this.totalValues['f'] - this.totalValues['s'] : 0;
        this.cancelledTotalValues['t'] = this.totalValues['t'] > this.totalValues['a'] ? this.totalValues['t'] - this.totalValues['a'] : 0;
        this.cancelledTotalValues['T'] = this.totalValues['T'];
        this.cancelledTotalValues['D'] = this.totalValues['D'];
    }
    setCancelledAverageValues(){
        (this.averageValues == undefined) && this.setAverageValues();
        this.cancelledAverageValues = {'s': 0.0, 'a': 0.0, 'f': 0.0, 't': 0.0, 'T': 0.0, 'D': 0.0};
        this.cancelledAverageValues['s'] = this.averageValues['s'] > this.averageValues['f'] ? this.averageValues['s'] - this.averageValues['f'] : 0;
        this.cancelledAverageValues['a'] = this.averageValues['a'] > this.averageValues['t'] ? this.averageValues['a'] - this.averageValues['t'] : 0;
        this.cancelledAverageValues['f'] = this.averageValues['f'] > this.averageValues['s'] ? this.averageValues['f'] - this.averageValues['s'] : 0;
        this.cancelledAverageValues['t'] = this.averageValues['t'] > this.averageValues['a'] ? this.averageValues['t'] - this.averageValues['a'] : 0;
        this.cancelledAverageValues['T'] = this.averageValues['T'];
        this.cancelledAverageValues['D'] = this.averageValues['D'];
    }
    setCancelledTrialSummary(){
        (this.cancelledAverageValues == undefined) && this.setCancelledAverageValues();
        this.cancelledTrialSummary = "";
        let str = `For ${this.numRolls} rolls, adjusted for cross-cancelling, the average results are:\n`;
        let successes   = this.cancelledAverageValues['s'].toFixed(3);
        let advantages  = this.cancelledAverageValues['a'].toFixed(3);
        let triumphs    = this.cancelledAverageValues['T'].toFixed(3);
        let failures    = this.cancelledAverageValues['f'].toFixed(3);
        let threats     = this.cancelledAverageValues['t'].toFixed(3);
        let despairs    = this.cancelledAverageValues['D'].toFixed(3);
        if (successes > 0) str += successes + " SUCCESS" + (successes > 1 ? "ES" : "");
        if (advantages > 0) str += (str.length > 0 ? ", " : "") + advantages + " ADVANTAGE" + (advantages > 1 ? "S" : "");
        if (triumphs > 0) str += (str.length > 0 ? ", " : "") + triumphs + " TRIUMPH" + (triumphs > 1 ? "S" : "");
        if (failures > 0) str += (str.length > 0 ? ", " : "") + failures + " FAILURE" + (failures > 1 ? "S" : "");
        if (threats > 0) str += (str.length > 0 ? ", " : "") + threats + " THREAT" + (threats > 1 ? "S" : "");
        if (despairs > 0) str += (str.length > 0 ? ", " : "") + despairs + " DESPAIR" + (despairs > 1 ? "S" : "");
        this.cancelledTrialSummary = str;
    }

    getNumRolls(){
        return this.numRolls;
    }
    getTabulatedResults(){
        this.tabulatedResults ?? this.setTabulatedResults();
        return this.tabulatedResults;
    }
    getTabulatedResultsPercents(){
        this.tabulatedResultsPercents ?? this.setTabulatedResultsPercents();
        return this.tabulatedResultsPercents;
    }
    getCancelledTabulatedResults(){
        this.cancelledTabulatedResults ?? this.setCancelledTabulatedResults();
        return this.cancelledTabulatedResults;
    }
    getCancelledTabulatedResultsPercents(){
        this.cancelledTabulatedResultsPercents ?? this.setCancelledTabulatedResultsPercents();
        return this.cancelledTabulatedResultsPercents;
    }
    getTotalValues(){
        this.totalValues ?? this.setTotalValues();
        return this.totalValues;
    }
    getAverageValues(){
        this.averageValues ?? this.setAverageValues();
        return this.averageValues;
    }
    getTrialSummary(){
        this.trialSummary ?? this.setTrialSummary();
        return this.trialSummary;
    }
    getCancelledTotalValues(){
        this.cancelledTotalValues ?? this.setCancelledTotalValues();
        return this.cancelledTotalValues;
    }
    getCancelledAverageValues(){
        this.cancelledAverageValues ?? this.setCancelledAverageValues();
        return this.cancelledAverageValues;
    }
    getCancelledTrialSummary(){
        this.cancelledTrialSummary ?? this.setCancelledTrialSummary();
        return this.cancelledTrialSummary;
    }
}
