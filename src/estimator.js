var fs = require('fs');
var readData = fs.readFileSync('./src/inputData.json', 'utf8');
const Jsondata = JSON.parse(readData);
const returnPeriod = (ImpactData)=>{
    ImpactData = Jsondata;
    if(ImpactData.periodType === 'days'){
        return Math.trunc((ImpactData.timeToElapse * 1) / 3);
    }
    if(ImpactData.data.periodType === 'weeks'){
        return Math.trunc((ImpactData.timeToElapse * 7) / 3);
    }
    if(ImpactData.data.periodType === 'months'){
        return Math.trunc((ImpactData.timeToElapse * 30) / 3);
    }
    return 0;
}

const Impact = (data)=>{
    const timeToElapse = data.timeToElapse;
    const avgDailyIncomePopulation = data.region.avgDailyIncomePopulation;
    const avgDailyIncomeInUSD = data.region.avgDailyIncomeInUSD;
    const totalHospitalBeds = data.totalHospitalBeds;

    const CurrentlyInfected = data.reportedCases * 10;
    const CurrentlyInfected_Severe = data.reportedCases * 50;

    const infectionsByRequestedTime = CurrentlyInfected * (2 ** returnPeriod(data));
    const infectionsByRequestedTime_Severe = CurrentlyInfected_Severe * (2 ** returnPeriod(data));

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



exports.covid19ImpactEstimator = (data) => {
  im= Impact(data);
  estimate = im.estimate;
  return returnData = {
    data,    
    estimate   
  }
  //
}

//export default covid19ImpactEstimator