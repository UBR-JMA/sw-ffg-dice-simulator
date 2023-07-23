class SymbolInputController{
    constructor(diceTypes, outcomes, outcomesPlural){
        this.stringArrays = {
            'diceTypes': diceTypes,
            'outcomes': outcomes,
            'outcomesPlural': outcomesPlural,
        }

        this.init();
    }
    init(){
        _.each(this.stringArrays, (stringArray, key)=> {
            this[key] = {};
            this.createMembers(stringArray, key)
    });
    }
    createMembers(stringArray, key){
        _.each(stringArray, (sectionString)=>{
            let name = _.camelCase(sectionString) 
            this[key][name] = {};
            this[key][name].cases = Util.getStringCases(name);
            this[key][name].id = this[key][name].cases.kebab;
            this[key][name].controller = {};
            
        });
    }
}
// this[name].id = this[name].cases.kebab;