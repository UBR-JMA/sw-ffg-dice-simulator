var app;

$(document).ready(function () {
    //loosely coupled components
    app = new SiteController();
    app.tests = new Tests();
    
    app.spinner = new SpinnerController();
    var spinner = app.spinner;

    let sectionStrings = ['Dice Pool','Summary','Charts', 'Tables'];
    app.sections = new SectionController(sectionStrings, $('#section-container'));
    var sections = app.sections;

    //tightly coupled components
    sections.dicePool.controller = new DicePoolController();
    var dicePool = app.sections.dicePool.controller;
    let subsectionStrings = ['Symbol Input', 'Distinct Combinations', 'Iteration Input']
    let dicePoolSubsections = app.sections.dicePool.subsections = new Subsections(subsectionStrings);
    let outcomesPlural = ['Successes', 'Advantages', 'Triumphs', 'Failures', 'Threats', 'Despairs'];
    let outcomes = ['Success', 'Advantage', 'Triumph', 'Failure', 'Threat', 'Despair'];
    let diceTypes = ['Ability', 'Proficiency', 'Boost', 'Difficulty', 'Challenge', 'Setback'];
    app.sections.dicePool.subsections = {
        symbolInput: new SymbolInputController(diceTypes, outcomes, outcomesPlural)
    };

    app.tests.runTests();










    // declarations for known and static values
    const DEV = {
        PERFORMANECE_MEASUREMENT: {
            FUNCTION_SPEED: true,
        }
    };
    const BUFFS = ["Proficiency", "Ability", "Boost"];
    const DEBUFFS = ["Challenge", "Difficulty", "Setback"];
    const DICE_TYPES = BUFFS.concat(DEBUFFS);
    const POSITIVE_OUTCOMES = ["SUCCESS", "ADVANTAGE", "TRIUMPH"];
    const NEGATIVE_OUTCOMES = ["FAILURE", "THREAT", "DESPAIR"];
    const POSITIVE_ICONS = BUFFS.concat(POSITIVE_OUTCOMES);
    const NEGATIVE_ICONS = DEBUFFS.concat(NEGATIVE_OUTCOMES);
    const OUTCOMES = POSITIVE_OUTCOMES.concat(NEGATIVE_OUTCOMES);
    const OUTCOMES_INIT_CAP_PLURAL = ["Successes", "Advantages", "Triumphs", "Failures", "Threats", "Despairs"];

    const ALL_ICONS = POSITIVE_ICONS.concat(NEGATIVE_ICONS);
    const CHART_FADE_SPEED = 100; //millisecond
    const SECTION_SLIDING_SPEED = 250; //millisecond
    const CHART_FADE_EASING = 'swing';
    const HIGHCHARTS = [
        'highchart-netPercent',
        'highchart-totalPercent',
        'highchart-net',
        'highchart-total'
    ];
    const CHART_BUTTONS = { // the buttons that show/hide the charts, as jQuery objects
        'netPercent': $('#netPercent-chart-btn'),
        'totalPercent': $('#totalPercent-chart-btn'),
        'net': $('#net-chart-btn'),
        'total': $('#total-chart-btn'),
    };
    const CHART_BOXES = { // the boxes that contain the charts, as jQuery objects
        'netPercent': $('#netPercent-chart-box'),
        'totalPercent': $('#totalPercent-chart-box'),
        'net': $('#net-chart-box'),
        'total': $('#total-chart-box'),
    };

    var numRolls;
    var numModifiers;
    var chart;
    var chartsData = {};
    var charts = {}
    var currentChart = CHART_BOXES['netPercent'];

    // SECTION: SITE SECTION FOLDING
    const SECTION_NAMES = {
        //  name    :  label,
        'dicepool': 'Dice Pool',
        'summary': 'Summary',
        'charts': 'Charts',
        'tables': 'Tables',
    };
    function showSection($button, $container, $box, label, speed = SECTION_SLIDING_SPEED) {
        hideAllSections();
        $button.html(`<b>${label}</b>`);
        $button.removeClass('section-collapser-btn');
        $button.addClass('section-collapser-btn-current');
        $container.slideDown(speed);
    }
    function hideSection($button, $container, $box, label, speed = SECTION_SLIDING_SPEED) {
        $container.slideUp(speed);
        $button.html(`<b>${label}</b>`);
        $button.removeClass('section-collapser-btn-current');
        $button.addClass('section-collapser-btn');
    }
    function hideAllSections() {
        _.each(SECTION, function (section, sectionName) {
            section.hide();
        });
    }
    SECTION = {};
    _.each(SECTION_NAMES, function (label, sectionName) {
        _.set(SECTION, sectionName, {
            'label': label,
            'speed': SECTION_SLIDING_SPEED,
            '$container': $('#' + sectionName),
            '$btn': $('#' + sectionName + '-btn'),
            '$box': $('#' + sectionName + '-box'),
            'isHidden': function () { return this.$container.is(':hidden'); },
            'isShown': function () { return this.$container.is(':visible'); },
            'hide': function (btn = this.$btn, container = this.$container, box = this.$box, label = this.label, speed = this.speed) { hideSection(btn, container, box, label, speed); },
            'show': function (btn = this.$btn, container = this.$container, box = this.$box, label = this.label, speed = this.speed) { showSection(btn, container, box, label, speed); },
            'toggle': function () { this.isHidden() ? this.show() : this.hide(); },
            'bound': false,
            'isBound': function () { return this.bound; },
            'bindBtn': function () {
                if (!this.bound) {
                    this.$btn.click(this.toggle.bind(this));
                    this.bound = true;
                }
                return this.bound;
            }
        });
    });
    _.forEach(SECTION, (section) => section.bindBtn() && section.$container.hide());


    

    //ICON STRIP
    function appendIcons(container, name = "blank", count = DICE_STRIP_ICON_SPACING) {
        for (i = 0; i < count; i++) {
            let img = document.createElement("img");
            img.src = `./images/${name}.png`;
            img.height = DICE_STRIP_ICON_WIDTH;
            img.width = DICE_STRIP_ICON_WIDTH;
            container.append(img);
        }
    }
    function appendIconCount(container, count, name) {
        // for cases where the total number of icons exceeds 40,
        // show a singular dice type icon followed by it's count.

        //append the image icon
        let iconImg = document.createElement("img");
        iconImg.src = `./images/${name}.png`;
        iconImg.height = DICE_STRIP_ICON_WIDTH;
        iconImg.width = DICE_STRIP_ICON_WIDTH;
        container.append(iconImg);
        //append the count
        let countLabel = document.createElement("span");
        countLabel.innerHTML = " x " + count + "&nbsp;";
        $(countLabel).addClass('h3');
        $(countLabel).addClass('pl-1');
        $(countLabel).addClass('text-light');
        container.append(countLabel);
        //append the blank icon
        let blankImg = document.createElement("img");
        blankImg.src = `./images/blank.png`;
        blankImg.height = DICE_STRIP_ICON_WIDTH;
        blankImg.width = DICE_STRIP_ICON_WIDTH;
        container.append(blankImg);

    }
    function updateIconStrip() {
        let container = $('#dice-icon-strip');
        container.empty();
        let name = "";

        if (numIconTypes <= DICE_STRIP_MAX_ICONS) {
            for (let i = 0; i < POSITIVE_ICONS.length; i++) {
                name = (POSITIVE_ICONS[i]).toLowerCase();
                let suffix = POSITIVE_OUTCOMES.includes((POSITIVE_ICONS[i]).toUpperCase()) ? "-light" : "";
                let count = parseInt($(`#${name}-input`).val());
                appendIcons(container, name + suffix, count);
            }
            //appendIcons(container); //blanks for spacing
            for (let i = 0; i < NEGATIVE_ICONS.length; i++) {
                name = (NEGATIVE_ICONS[i]).toLowerCase();
                let suffix = NEGATIVE_OUTCOMES.includes((NEGATIVE_ICONS[i]).toUpperCase()) ? "-light" : "";
                let count = parseInt($(`#${name}-input`).val());
                appendIcons(container, name + suffix, count);
            }

        } else {
            for (let i = 0; i < ALL_ICONS.length; i++) {
                name = (ALL_ICONS[i]).toLowerCase();
                let count = parseInt($(`#${name}-input`).val());
                if (count > 0) {
                    if (OUTCOMES.includes(name.toUpperCase())) {
                        name += "-light";
                    }
                    appendIconCount(container, count, name);
                }
            }
        }
    }

    //DICE POOL
    const DICE_STRIP_ICON_WIDTH = 30;
    const DICE_STRIP_ICON_SPACING = 2;
    const DICE_STRIP_MAX_ICONS = 20;
    $('#icon-strip-blank').css('width', DICE_STRIP_ICON_WIDTH);
    $('#icon-strip-blank').css('height', DICE_STRIP_ICON_WIDTH);
    const DICE_POOL = {
        INPUTS: (
            (_.times(DICE_TYPES.length, (i) => _.lowerCase(DICE_TYPES[i] + '-input')))
                .concat(
                    (_.times(DICE_TYPES.length, (i) => _.lowerCase(DICE_TYPES[i] + '-input'))))
        ),
        getNumInputTotal: getNumDiceInput,
    }
    var numIconTypes;
    var numDice;
    $('.form-control').change(function () {
        $('#total-roll-combos').html('Total Distinct Rolls: ' + getTotalRollCombos());

        updateIconStrip();
    });
    function getTotalRollCombos() { // what happens whenever any dice or modifier input is changed
        /*
        These multipliers might look weird, why don't they just get the numFaces value?
        well, the numFaces value is the number of faces on the die, but the total 
        number of combos is the computed number of possible results.
        These dice have repeat faces, so the number of possible results is not the same.
        The multiplier then becomes the number of -distinct- faces on the die.
        */
        let proficiencyCombos = Math.pow(7, parseInt($('#proficiency-input').val()));
        let abilityCombos = Math.pow(6, parseInt($('#ability-input').val()));
        let boostCombos = Math.pow(5, parseInt($('#boost-input').val()));
        let challengeCombos = Math.pow(7, parseInt($('#challenge-input').val()));
        let difficultyCombos = Math.pow(6, parseInt($('#difficulty-input').val()));
        let setbackCombos = Math.pow(3, parseInt($('#setback-input').val()));
        proficiencyCombos = proficiencyCombos == 0 ? 1 : proficiencyCombos;
        abilityCombos = abilityCombos == 0 ? 1 : abilityCombos;
        boostCombos = boostCombos == 0 ? 1 : boostCombos;
        challengeCombos = challengeCombos == 0 ? 1 : challengeCombos;
        difficultyCombos = difficultyCombos == 0 ? 1 : difficultyCombos;
        setbackCombos = setbackCombos == 0 ? 1 : setbackCombos;

        numCombos = proficiencyCombos * abilityCombos * boostCombos * challengeCombos * difficultyCombos * setbackCombos;
        return numCombos.toLocaleString();
    }



    //clicking the "Run Trial" button or pressing [Enter] starts the trial process.
    $("#run-trials").click(runDiceTrial);
    $(document).keydown((e) => ((e.which == 13) && (!$('#run-trials').is(":disabled"))) && $('#run-trials').click());

    function runDiceTrial() {
        //run the trial if there is at least one input
        if (DICE_POOL.getNumInputTotal() > 0) {
            runTrial(trialPrep());
        }
        trialCleanup();
    }
    function getNumDiceInput() {
        return (
            parseInt($('#proficiency-input').val()) +
            parseInt($('#ability-input').val()) +
            parseInt($('#boost-input').val()) +
            parseInt($('#challenge-input').val()) +
            parseInt($('#difficulty-input').val()) +
            parseInt($('#setback-input').val()) +
            parseInt($('#success-input').val()) +
            parseInt($('#advantage-input').val()) +
            parseInt($('#failure-input').val()) +
            parseInt($('#threat-input').val()) +
            parseInt($('#triumph-input').val()) +
            parseInt($('#despair-input').val())
        );
    }
    function trialPrep() {
        SECTION.SPINNER.show();
        disableTrialBtn();
        numRolls = parseInt($('#roll-number-input').val());
        let diceTrial = new DiceTrial(
            new DicePool(
                new Dice([
                    parseInt($('#proficiency-input').val()),
                    parseInt($('#ability-input').val()),
                    parseInt($('#boost-input').val()),
                    parseInt($('#challenge-input').val()),
                    parseInt($('#difficulty-input').val()),
                    parseInt($('#setback-input').val()),
                ]),
                new Modifiers([
                    parseInt($('#success-input').val()),
                    parseInt($('#advantage-input').val()),
                    parseInt($('#failure-input').val()),
                    parseInt($('#threat-input').val()),
                    parseInt($('#triumph-input').val()),
                    parseInt($('#despair-input').val()),
                ])
            ),
            numRolls,
        )
        return diceTrial;
    }
    async function runTrial(diceTrial) {
        let startTime = performance.now();
        //do the thing. the big thing.
        runTrialWorker(diceTrial);
        getTrialResults(await runTrialWorker(diceTrial));

        let endTime = performance.now();
        let timeDiff = (endTime - startTime) / 1000; // function run time in seconds
        $('#run-time').html(`<i>Roll trial completed in ${timeDiff.toFixed(4)} seconds</i>`);
    }
    function runTrialWorker(diceTrial) {
        return new Promise((resolve, reject) => {
            let worker = new Worker('./src/worker.js');
            worker.postMessage(diceTrial);
            worker.onmessage = function (e) {
                let updatedDiceTrial = e.data;
                Object.assign(diceTrial, updatedDiceTrial);
                resolve(diceTrial);
            }
        });
    }
    function getTrialResults(diceTrial) {
        trialSummary = diceTrial.getTrialSummary();
        cancelledTrialSummary = diceTrial.getCancelledTrialSummary();

        let totalValues = diceTrial.getTotalValues();
        let averageValues = diceTrial.getAverageValues();
        let cancelledTotalValues = diceTrial.getCancelledTotalValues();
        let cancelledAverageValues = diceTrial.getCancelledAverageValues();
        $('#roll-count-label').html(`After cross-cancellation and ${numRolls.toLocaleString()} rolls, the average results of the dice pool above is:`);
        updateTrialSummary(cancelledAverageValues);
        buildCharts(diceTrial);
        CHART_BUTTONS.netPercent.click();
        updateResultsTable(totalValues, averageValues, cancelledTotalValues, cancelledAverageValues);
        SECTION.summary.show();
        SECTION.SPINNER.hide();
    }
    function trialCleanup() {
        enableTrialBtn();
    }
    function disableTrialBtn() {
        $('#run-trials').prop('disabled', true);
        $('#run-trials').addClass('btn-secondary');
        $('#run-trials').removeClass('btn-warning');
    }
    function enableTrialBtn() {
        $('#run-trials').prop('disabled', false);
        $('#run-trials').addClass('btn-success');
        $('#run-trials').removeClass('btn-secondary');
    }
    function updateTotals(totalValues) {
        $('#total-success').html(totalValues['s']);
        $('#total-advantage').html(totalValues['a']);
        $('#total-failure').html(totalValues['f']);
        $('#total-threat').html(totalValues['t']);
        $('#total-triumph').html(totalValues['T']);
        $('#total-despair').html(totalValues['D']);
    }
    function updateAverages(averageValues) {
        $('#average-success').html(averageValues['s'].toFixed(3));
        $('#average-advantage').html(averageValues['a'].toFixed(3));
        $('#average-failure').html(averageValues['f'].toFixed(3));
        $('#average-threat').html(averageValues['t'].toFixed(3));
        $('#average-triumph').html(averageValues['T'].toFixed(3));
        $('#average-despair').html(averageValues['D'].toFixed(3));
    }
    function updateAdjustedTotals(cancelledTotalValues) {
        $('#adjusted-total-success').html(cancelledTotalValues['s']);
        $('#adjusted-total-advantage').html(cancelledTotalValues['a']);
        $('#adjusted-total-failure').html(cancelledTotalValues['f']);
        $('#adjusted-total-threat').html(cancelledTotalValues['t']);
        $('#adjusted-total-triumph').html(cancelledTotalValues['T']);
        $('#adjusted-total-despair').html(cancelledTotalValues['D']);
    }
    function updateAdjustedAverages(cancelledAverageValues) {
        $('#adjusted-average-success').html(cancelledAverageValues['s'].toFixed(3));
        $('#adjusted-average-advantage').html(cancelledAverageValues['a'].toFixed(3));
        $('#adjusted-average-failure').html(cancelledAverageValues['f'].toFixed(3));
        $('#adjusted-average-threat').html(cancelledAverageValues['t'].toFixed(3));
        $('#adjusted-average-triumph').html(cancelledAverageValues['T'].toFixed(3));
        $('#adjusted-average-despair').html(cancelledAverageValues['D'].toFixed(3));
    }
    function updateResultsTable(totalValues, averageValues, cancelledTotalValues, cancelledAverageValues) {
        updateTotals(totalValues);
        updateAverages(averageValues);
        updateAdjustedTotals(cancelledTotalValues);
        updateAdjustedAverages(cancelledAverageValues);
    }
    function updateTrialSummary(cancelledAverageValues) {
        let success = cancelledAverageValues['s'] > cancelledAverageValues['f'];
        let advantage = cancelledAverageValues['a'] > cancelledAverageValues['t'];
        let numSuccessFailure = Math.abs(cancelledAverageValues['s'] - cancelledAverageValues['f']);
        let numAdvantageThreat = Math.abs(cancelledAverageValues['a'] - cancelledAverageValues['t']);
        let successCountElem = $('#trial-summary-success-count');
        let successIconContainer = $('#trial-summary-success-label-icon');
        let successLabelElem = $('#trial-summary-success-label-text');
        let advantageCountElem = $('#trial-summary-advantage-count');
        let advantageIconContainer = $('#trial-summary-advantage-label-icon');
        let advantageLabelElem = $('#trial-summary-advantage-label-text');
        successCountElem.empty();
        successIconContainer.empty();
        successLabelElem.empty();
        advantageCountElem.empty();
        advantageIconContainer.empty();
        advantageLabelElem.empty();

        //BOX-SHADOW
        //success/failure
        successBox = $('#success-summary-box');
        successBox.prop('style', `border-radius: 20px; box-shadow: 0px 0px 20px 10px ${success ? 'green' : 'red'} inset;`);
        //advantage/threat
        advantageBox = $('#advantage-summary-box');
        advantageBox.prop('style', `border-radius: 20px; box-shadow: 0px 0px 20px 10px ${advantage ? 'green' : 'red'} inset;`);


        //SUCCESS/FAILURE
        if (numAdvantageThreat > 0) {

        }
        //count label 
        let successCountText = "  ≈" + numSuccessFailure.toFixed(1);
        successCountElem.html(successCountText);
        //icon
        let successFailureImgSrc = success ? 'images/success-light.png' : 'images/failure-light.png';
        let successFailureImg = document.createElement('img');
        successFailureImg.src = successFailureImgSrc;
        $(successFailureImg).prop('style', 'height: 6rem; width: auto;');
        successIconContainer.append(successFailureImg);
        //text label
        let successText = success ? 'SUCCESSES' : 'FAILURES';
        successLabelElem.removeClass('text-success');
        successLabelElem.removeClass('text-danger');
        successLabelElem.addClass(success ? 'text-success' : 'text-danger');
        successLabelElem.html(successText);


        //ADVANTAGE/THREAT
        //count label
        let advantageCountText = "  ≈" + (numAdvantageThreat.toFixed(1));
        advantageCountElem.html(advantageCountText);
        //icon 
        let advantageThreatImgSrc = advantage ? 'images/advantage-light.png' : 'images/threat-light.png';
        let advantageThreatImg = document.createElement('img');
        advantageThreatImg.src = advantageThreatImgSrc;
        $(advantageThreatImg).prop('style', 'height: 6rem; width: auto;');
        advantageIconContainer.append(advantageThreatImg);
        //text label
        let advantageText = advantage ? 'ADVANTAGES' : 'THREATS';
        advantageLabelElem.removeClass('text-success');
        advantageLabelElem.removeClass('text-danger');
        advantageLabelElem.addClass(advantage ? 'text-success' : 'text-danger');
        advantageLabelElem.html(advantageText);
    }

    //CHARTS
    function buildCharts(diceTrial) {
        buildChart( //netPercent
            diceTrial.getCancelledTabulatedResultsPercents(),
            'netPercent',
            'highchart-netPercent',
            'Net Results (Percentages)',
            `
A histogram of of dice symbol occurrences per roll
over ${numRolls.toLocaleString()} rolls for the given dice pool.\n</br>
Measured as percentages. Opposite outcomes are cross-cancelled.
`,
            '# of Outcomes/ Roll',
            'Net Results (%)',
            100,
            '%'
        );
        buildChart( //totalPercent
            diceTrial.getTabulatedResultsPercents(),
            'totalPercent',
            'highchart-totalPercent',
            'Total Results (Percentages)',
            `
A histogram of of dice symbol occurrences per roll
over ${numRolls.toLocaleString()} rolls for the given dice pool.\n</br>
Measured as percentages. Opposite outcomes are <i>NOT</i> cross-cancelled.
`,
            'Percent of Rolls',
            'Total Results',
            100,
            '%'
        );
        buildChart( //netSum
            diceTrial.getCancelledTabulatedResults(),
            'net',
            'highchart-net',
            'Net Results',
            `
A histogram of of dice symbol occurrences per roll
over ${numRolls.toLocaleString()} rolls for the given dice pool.\n</br>
Measured as sum total. Opposite outcomes are cross-cancelled.
`,
            'Number of Rolls',
            'Total Results',
            numRolls
        );
        buildChart( //totalSum
            diceTrial.getTabulatedResults(),
            'total',
            'highchart-total',
            'Total Results',
            `
A histogram of of dice symbol occurrences per roll
over ${numRolls.toLocaleString()} rolls for the given dice pool.\n</br>
Measured as sum total. Opposite outcomes are <i>NOT</i> cross-cancelled.
`,
            'Number of Rolls',
            'Total Results',
            numRolls
        );
    }
    function buildChart(chartData, chartName, targetElementId, titleText, subtitleText, xAxisTitle, yAxisTitle, yMax, chartYUnitsRight = '') {
        _.set(chartsData, chartName, buildChartData(chartData, yMax));
        _.set(chartsData[chartName], 'targetElementId', targetElementId);
        _.set(chartsData[chartName], 'titleText', titleText);
        _.set(chartsData[chartName], 'subtitleText', subtitleText);
        _.set(chartsData[chartName], 'xAxisTitle', xAxisTitle);
        _.set(chartsData[chartName], 'yAxisTitle', yAxisTitle);
        _.set(chartsData[chartName], 'chartYUnitsRight', chartYUnitsRight);

        let chartOptions = chartsData[chartName];
        chart = Highcharts.chart(chartOptions.targetElementId, {
            chart: {
                type: 'column',
                options3d: {
                    enabled: true,
                    alpha: 10,
                    beta: 10,
                    viewDistance: 100,
                    depth: 100
                },
                panning: {
                    enabled: true,
                    type: 'xy',
                },
                zooming: {
                    type: 'xy',
                    mouseWheel: true,
                },
            },
            legend: {
                enabled: true,
                title: {
                    text: 'Outcome',
                    style: {
                        textAlign: 'center',
                    },
                },
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
            },
            series: chartOptions.array,
            subtitle: {
                text: chartOptions.subtitleText
            },
            title: {
                text: chartOptions.titleText,
            },
            tooltip: {
                formatter: function () {
                    let outcomePS = {}
                    let i = 0;
                    OUTCOMES_INIT_CAP_PLURAL.forEach((outcome, i) => {
                        outcomePS[outcome] = OUTCOMES[i].toLowerCase();
                        i++;
                    });

                    return `
<b>${((this.y).toLocaleString()) + chartOptions.chartYUnitsRight}</b> had <b>${this.x}</b>
<span style="color: ${this.series.color}; "text-shadow: 0px 0px 10px #777, 0px 0px 2px #fff;"">
<b>${this.series.name}.</b>
</span>

`;
                },
            },
            xAxis: {
                min: 0,
                title: {
                    text: chartOptions.xAxisTitle,
                },
                categories: chartOptions.combinedCategories,
                crosshair: true,
            },
            yAxis: {
                min: 0,
                title: {
                    text: chartOptions.yAxisTitle,
                },
                crosshair: true,
                startOnTick: false,
                endOnTick: false,
            },
        });

    }
    function buildChartData(results, yMax) {
        let data = {
            'combinedCategories': [],
            'array': [],
        };
        // for each outcome, build a series of x
        for (let outcome = 0; outcome < OUTCOMES_INIT_CAP_PLURAL.length; outcome++) {
            let series = getResultSeries(results, OUTCOMES_INIT_CAP_PLURAL[outcome]);
            data.combinedCategories = _.union(data.combinedCategories, series.categories);
            if (series.data[0] != yMax) {
                data.array = _.union(data.array, [series]);
            }
        }

        return data;
    }
    function getResultSeries(results, name) {
        let outcome;
        let color;
        switch (name) {
            case "Successes":
                outcome = 's';
                color = "#4d7825";
                break;
            case "Failures":
                outcome = 'f';
                color = "#611b77"
                break;
            case "Advantages":
                outcome = 'a';
                color = "#83e1fb"
                break;
            case "Threats":
                outcome = 't';
                color = "#1e1f1f"
                break;
            case "Triumphs":
                outcome = 'T';
                color = "#fde000"
                break;
            case "Despairs":
                outcome = 'D';
                color = "#f20601"
                break;
        }
        let data = [];
        let categories = [];
        let keys = Object.keys(results[outcome]);
        for (key in keys) {
            categories.push(key);
        }
        for (value in results[outcome]) {
            data.push(results[outcome][value]);
        }
        let resultSeries = {
            'name': name,
            'color': color,
            'data': data,
            'categories': categories
        }
        return resultSeries;
    }
    function highlightChartButton($chartBtn) {
        resetChartButtons();
        $chartBtn.removeClass('btn-success');
        $chartBtn.removeClass('bg-success');
        $chartBtn.addClass('btn-outline-success');
        $chartBtn.addClass('disabled');
        $chartBtn.addClass('bg-light');
        $chartBtn.css('z-index', '2');
        $chartBtn.css('position', 'relative');
        $chartBtn.css('top', '1px');
    }
    function resetChartButtons() {
        _.each(CHART_BUTTONS, function (button) {
            button.removeClass('btn-outline-success');
            button.removeClass('disabled');
            button.removeClass('bg-light');
            button.addClass('btn-success');
            button.addClass('bg-success');
            button.css('z-index', '1');
            button.css('position', 'static');
            button.css('top', '0px');
        });
    }
    function hideCharts() {
        _.each(CHART_BOXES, box => box.hide());
    }
    function bindChartButtons() {
        _.forEach(CHART_BUTTONS, (button, key) => {
            button.on('click', () => {
                currentChart.fadeOut(CHART_FADE_SPEED, CHART_FADE_EASING, () => {
                    currentChart = CHART_BOXES[key];
                    currentChart.fadeIn(CHART_FADE_SPEED, CHART_FADE_EASING);
                });
                highlightChartButton(button);
            });
        });
    }

    function init() {
        bindChartButtons();
        hideCharts();
    }
    init();
    //SECTION: FINISHED INITIAL LOADING
    SECTION.dicepool.$box.show();
    //toggleDicePoolSection(true);
    initialized = true;
});