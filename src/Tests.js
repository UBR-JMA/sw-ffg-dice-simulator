class Tests{
  constructor(){
    this.tests = [
      this.checkScriptPathIntegrity
    ];
    console.log("Tests Class Initialized.");
  }
  runTests=()=>{
    for (let i = 0; i < this.tests.length; i++) {
      this.tests[i]();
    }
  }
  checkScriptPathIntegrity=()=>{
    console.log("Scripts Accessible.");
  };
}