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
        _.each(this.stringArrays, (stringArray, key)=>
            this.createMembers(stringArray, key)
        );
    }
    createMembers(stringArray, key){
        let camelSectionStrings = []
        _.each(stringArray, (sectionString)=>{
            camelSectionStrings.push(_.camelCase(sectionString));
        });
        stringArray = camelSectionStrings;
        _.each(stringArray, (name)=>{
            this[name] = {};
            this[name].cases = Util.getStringCases(name);
        });
        
    }
}
// this[name].id = this[name].cases.kebab;