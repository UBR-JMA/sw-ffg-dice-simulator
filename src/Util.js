class Util{
    static timeMeasure=(callback, label='<Function Name>')=>{
        let start = performance.now();
        callback();
        let end = performance.now();
        console.log(`${label} took ${(end-start).toFixed(0)} milliseconds.`);
    }
    static getStringCases(string){
        string = _.camelCase(string);
        let cases = {};
        cases['camel'] = _.camelCase(string);
        cases['constant'] = (_.snakeCase(string)).toUpperCase();
        cases['kebab'] = _.kebabCase(string);
        cases['pascal'] = _.upperFirst(_.camelCase(string));
        cases['snake'] = _.snakeCase(string);
        cases['title'] = _.startCase(_.camelCase(string));
        return cases;
    }
}

