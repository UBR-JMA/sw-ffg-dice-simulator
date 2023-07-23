class SectionController{
    constructor(sections, $container, animationSpeed = 250){
        this.SECTION_STRINGS = sections;
        this.$container = $container;
        this.animationSpeed = animationSpeed;
        this.currentName;
        this.activelySwitching;
        this.init();
    }
    init(){
        let camelSectionStrings = []
        _.each(this.SECTION_STRINGS, (sectionString)=>{
            camelSectionStrings.push(_.camelCase(sectionString));
        });
        this.SECTION_STRINGS = camelSectionStrings;
        _.each(this.SECTION_STRINGS, (name)=>{
            this[name] = {};
            this[name].cases = Util.getStringCases(name);
            this[name].id = this[name].cases.kebab;
        });

        this.formatContainers();
        this.setFinal();
    }
    formatContainers(){
        let sectionBox = document.createElement('div');
        sectionBox.id = 'section-box';
        let $sectionBox = $(sectionBox);
        $sectionBox.addClass('d-flex');
        $sectionBox.addClass('justify-content-center');
        _.each(this.SECTION_STRINGS, (name)=>{
            let section = document.createElement('div');
            section.id = `${this[name].id}-container`;
            let $section = $(section);
            $section.addClass('section-container');
            $section.hide();
            $section.html(`<h1>${this[name].cases.title}</h1>`); 
            $sectionBox.append($section);
        });
        this.formatButtons();
        this.$container.append($sectionBox);
        this.e = sectionBox;
        this.$ = $sectionBox;
    }
    formatButtons(){
        let buttonBox = document.createElement('div');
        buttonBox.id = 'section-btn-box';
        let $buttonBox = $(buttonBox);
        $buttonBox.addClass('d-flex');
        $buttonBox.addClass('justify-content-center');
        _.each(this.SECTION_STRINGS, (name)=>{
            let button = document.createElement('button');
            button.id = `${this[name].id}-btn`;
            button.innerHTML = `<b>${this[name].cases.title}</b>`;
            let $button = $(button);
            $button.addClass('section-btn');
            $button.addClass('section-btn-dormant');
            this[name].btn = {
                e: button,
                $: $button,
            }
            $button.append($button);
            $button.click(()=>{
                if(!$button.hasClass('section-btn-current') && !this.activelySwitching){
                    this.activelySwitching = true;
                    $button.removeClass('section-btn-dormant');
                    $button.addClass('section-btn-current');
                    this[name].container.$.addClass('section-container-current');
                    this.showSection(this[name]);
                    this.currentName = name;
                }
            });
            $buttonBox.append($button);
        });
        this.$container.append($buttonBox);

    }
    showSection(newSection) {
        if (this.currentName == undefined){
            this.currentName = newSection.cases.camel;
        }
        let currentSection = this[this.currentName];
        currentSection.btn.$.addClass('section-btn-dormant');
        currentSection.btn.$.removeClass('section-btn-current');
        currentSection.container.$.fadeOut(this.animationSpeed, ()=>{
            newSection.btn.$.removeClass('section-btn-dormant');
            newSection.btn.$.addClass('section-btn-current');
            newSection.container.$.fadeIn(this.animationSpeed);
            this.currentName = newSection.cases.camel;
            this.activelySwitching = false;
        });
    }
    setFinal(){
        _.each(this.SECTION_STRINGS, (sectionString)=>{
            let name = sectionString;
            this[name].e = document.getElementById(this[name].id);
            this[name].$ = $(this[name].e);
            this[name].container = {
                e: document.getElementById(`${this[name].id}-container`),
                $: $(document.getElementById(`${this[name].id}-container`)),
            }
            this[name].subsections = new Subsections();
        });
    }
}