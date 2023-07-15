importScripts(
    './classes/DieFace.js',
    './classes/Die.js',
    './classes/Modifiers.js',
    './classes/DiceTypes/Proficiency.js',
    './classes/DiceTypes/Ability.js',
    './classes/DiceTypes/Boost.js',
    './classes/DiceTypes/Challenge.js',
    './classes/DiceTypes/Difficulty.js',
    './classes/DiceTypes/Setback.js',
    './classes/Dice.js',
    './classes/DicePool.js',
    './classes/DiceTrial.js',
);
//the worker allows the main thread to continue to run while the dice trial is being run
//this is important because the dice trial can take a long time to run,
//and is typically computationally expensive.
//Additionally, this allows the spinner to run smoothly while the dice trial is being run.

self.onmessage = function (e) {
    console.log('beginning worker');
    let diceTrial = new DiceTrial(
        new DicePool(
            new Dice(e.data.dicePool.diceCount.diceCountArray),
            new Modifiers(e.data.dicePool.modifiers.modList),
        ),
        e.data.numRolls,
    );
    diceTrial.runTrial();
    postMessage(diceTrial);
    //console.log(diceTrial);
}