var fs = require('fs');
var readData = fs.readFileSync('inputData.json', 'utf8');
const Jsondata = JSON.parse(readData);
const returnPeriod = (ImpactData)=>{
    ImpactData = Jsondata;
    if(ImpactData.data.periodType === 'days'){
        return Math.trunc((ImpactData.data.timeToElapse * 1) / 3);
    }
    if(ImpactData.data.periodType === 'weeks'){
        return Math.trunc((ImpactData.data.timeToElapse * 7) / 3);
    }
    if(ImpactData.data.periodType === 'months'){
        return Math.trunc((ImpactData.data.timeToElapse * 30) / 3);
    }
    return 0;
}

const Impact = ()=>{
    const timeToElapse = Jsondata.data.timeToElapse;
    const avgDailyIncomePopulation = Jsondata.data.region.avgDailyIncomePopulation;
    const avgDailyIncomeInUSD = Jsondata.data.region.avgDailyIncomeInUSD;
    const totalHospitalBeds = Jsondata.data.totalHospitalBeds;

    const CurrentlyInfected = Jsondata.data.reportedCases * 10;
    const CurrentlyInfected_Severe = Jsondata.data.reportedCases * 50;

    const infectionsByRequestedTime = CurrentlyInfected * (2 ** returnPeriod(Jsondata));
    const infectionsByRequestedTime_Severe = CurrentlyInfected_Severe * (2 ** returnPeriod(Jsondata));

    const severeCasesByRequestedTime = parseInt(0.15 * infectionsByRequestedTime);
    const severeCasesByRequestedTime_Severe = parseInt(0.15 * infectionsByRequestedTime_Severe);

    const severeCovid19PositiveBeds = parseInt(0.35 * totalHospitalBeds);
    const severeCovid19PositiveBeds_Severe = parseInt(0.35 * totalHospitalBeds);

    const hospitalBedsByRequestedTime = severeCovid19PositiveBeds - severeCasesByRequestedTime;
    const hospitalBedsByRequestedTime_Severe = severeCovid19PositiveBeds_Severe - severeCasesByRequestedTime_Severe;

    const casesForICUByRequestedTime = 0.05 * infectionsByRequestedTime;
    const casesForICUByRequestedTime_Severe = 0.05 * infectionsByRequestedTime_Severe;

    const casesForVentilatorsByRequestedTime = 0.02 * infectionsByRequestedTime; 
    const casesForVentilatorsByRequestedTime_Severe = 0.02 * infectionsByRequestedTime_Severe; 

    const dollarsInFlightICU = infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD * timeToElapse;
    const dollarsInFlightICU_Severe = infectionsByRequestedTime_Severe * avgDailyIncomePopulation * avgDailyIncomeInUSD * timeToElapse;


    return {
        "estimate":{
        "impact":{
            "currentlyInfectPeople" : CurrentlyInfected,
            "infectionsByRequestedTime" : infectionsByRequestedTime,
            "severeCasesByRequestedTime" : severeCasesByRequestedTime,
            "hospitalBedsByRequestedTime" : hospitalBedsByRequestedTime,
            "casesForICUByRequestedTime" : casesForICUByRequestedTime,
            "casesForVentilatorsByRequestedTime" : casesForVentilatorsByRequestedTime,
            "dollarsInFlightICU" : dollarsInFlightICU  
        },
        "severeImpact":{
            "currentlyInfectPeople" : CurrentlyInfected_Severe,
            "infectionsByRequestedTime" : infectionsByRequestedTime_Severe,
            "severeCasesByRequestedTime" : severeCasesByRequestedTime_Severe,
            "hospitalBedsByRequestedTime" : hospitalBedsByRequestedTime_Severe,
            "casesForICUByRequestedTime" : casesForICUByRequestedTime_Severe,
            "casesForVentilatorsByRequestedTime" : casesForVentilatorsByRequestedTime_Severe,
            "dollarsInFlightICU" : dollarsInFlightICU_Severe  
        }
    }
}
}



const covid19ImpactEstimator = (data) => {
  data = Jsondata.data;
  im= Impact();
  estimate = im.estimate;
  returnData = {
    data,    
    estimate   
  }
  
  console.log(returnData);
}


covid19ImpactEstimator();

// //total hospital beds
// var totalHospitalBeds = data.data.totalHospitalBeds;
// var avgDailyIncomeInUSD = data.data.region.avgDailyIncomeInUSD;

//  //output : CurrentlyInfected
//  var ImpactCurrentlyInfected = data.data.reportedCases * 10;
//  var SevereCurrentlyInfected = data.data.reportedCases * 50;

//  //output : infectionsByRequestedTime
//  var ImpactinfectionsByRequestedTime = ImpactCurrentlyInfected * (1024);
//  var SevereinfectionsByRequestedTime = SevereCurrentlyInfected * (1024);
 
//  //output : severeCasesByRequestedTime
//  var ImpactsevereCasesByRequestedTime = parseInt(0.15 * ImpactinfectionsByRequestedTime);
//  var SsevereCasesByRequestedTime = parseInt(0.15 * SevereinfectionsByRequestedTime);

//  // output: hospitalBedsByRequestedTime
//  var severeCovid19PositiveBeds = parseInt(0.35 * totalHospitalBeds);
//  var ImpacthospitalBedsByRequestedTime = severeCovid19PositiveBeds - ImpactsevereCasesByRequestedTime;
//  var SeverehospitalBedsByRequestedTime = severeCovid19PositiveBeds - SsevereCasesByRequestedTime;

// //output: casesForICUByRequestedTime
// var ImpactcasesForICUByRequestedTime = 0.05 * ImpactinfectionsByRequestedTime;
// var SeverecasesForICUByRequestedTime = 0.05 * SsevereCasesByRequestedTime;

// // output : casesForVentilatorsByRequestedTime
// var ImpactcasesForVentilatorsByRequestedTime = 0.02 * ImpactinfectionsByRequestedTime; 
// var SeverecasesForVentilatorsByRequestedTime = 0.02 * SsevereCasesByRequestedTime; 

// //output : dollarsInFlight for 5%
// var ImpactdollarsInFlightICU = ImpactcasesForICUByRequestedTime * avgDailyIncomeInUSD * 30;
// var SeveredollarsInFlightICU = SeverecasesForICUByRequestedTime * avgDailyIncomeInUSD * 30;

// //output : dollarsInFlight for 2%
// var ImpactdollarsInFlightVENT = ImpactcasesForVentilatorsByRequestedTime * avgDailyIncomeInUSD * 30;
// var SeveredollarsInFlightVENT = SeverecasesForVentilatorsByRequestedTime * avgDailyIncomeInUSD * 30;

 //console.log(avgDailyIncomeInUSD)

//export default covid19ImpactEstimator;
