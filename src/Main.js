var app;

$(document).ready(function () {
    //loosely coupled components
    app = new SiteController();
    
    app.spinner = new SpinnerController();

    let sectionStrings = ['Dice Pool','Summary','Charts', 'Tables'];
    app.sections = new SectionController(sectionStrings, $('#section-container'));

    //tightly coupled components
    app.sections.dicePool.controller = new DicePoolController();
    let subsectionStrings = ['Symbol Input', 'Distinct Combinations', 'Iteration Input']
    app.sections.dicePool.subsections = new Subsections(subsectionStrings);
    let outcomesPlural = ['Successes', 'Advantages', 'Triumphs', 'Failures', 'Threats', 'Despairs'];
    let outcomes = ['Success', 'Advantage', 'Triumph', 'Failure', 'Threat', 'Despair'];
    let diceTypes = ['Ability', 'Proficiency', 'Boost', 'Difficulty', 'Challenge', 'Setback'];
    app.sections.dicePool.subsections = {
        symbolInput: new SymbolInputController(diceTypes, outcomes, outcomesPlural)
    };

    Util.fetchAndCreate('fetchTest.html', $('#fetch-test-box'));
});