 const fs = require('fs');

 const readData = fs.readFileSync('./src/inputData.json', 'utf8');
 const Jsondata = JSON.parse(readData);
const returnPeriod = (ImpactData) => {
    if(ImpactData === ""){
        ImpactData = Jsondata;
    }
  // 
  if (ImpactData.periodType === 'days') {
    return Math.trunc((ImpactData.timeToElapse * 1) / 3);
  }
  if (ImpactData.data.periodType === 'weeks') {
    return Math.trunc((ImpactData.timeToElapse * 7) / 3);
  }
  if (ImpactData.data.periodType === 'months') {
    return Math.trunc((ImpactData.timeToElapse * 30) / 3);
  }
  return 0;
};

const Impact = (data) => {
  const { timeToElapse } = data;
  const { avgDailyIncomePopulation } = data.region;
  const { avgDailyIncomeInUSD } = data.region;
  const { totalHospitalBeds } = data;

  const CurrentlyInfected = data.reportedCases * 10;
  const CurrentlyInfectedSevere = data.reportedCases * 50;

  const infectionsByRequestedTime = CurrentlyInfected * (2 ** returnPeriod(data));
  const infectionsByRequestedTimeSevere = CurrentlyInfectedSevere * (2 ** returnPeriod(data));

  const severeCasesByRequestedTime = parseInt(0.15 * infectionsByRequestedTime, 10);
  const severeCasesByRequestedTimeSevere = parseInt(0.15 * infectionsByRequestedTimeSevere, 10);

  const severeCovid19PositiveBeds = parseInt(0.35 * totalHospitalBeds, 10);
  const severeCovid19PositiveBedsSevere = parseInt(0.35 * totalHospitalBeds, 10);

  const hospitalBedsByRequestedTime = severeCovid19PositiveBeds - severeCasesByRequestedTime;
  const hospitalBedsByRequestedTimeSevere = severeCovid19PositiveBedsSevere
  - severeCasesByRequestedTimeSevere;

  const casesForICUByRequestedTime = 0.05 * infectionsByRequestedTime;
  const casesForICUByRequestedTimeSevere = 0.05 * infectionsByRequestedTimeSevere;

  const casesForVentilatorsByRequestedTime = 0.02 * infectionsByRequestedTime;
  const casesForVentilatorsByRequestedTimeSevere = 0.02 * infectionsByRequestedTimeSevere;

  const dollarsInFlightICU = infectionsByRequestedTime * avgDailyIncomePopulation
   * avgDailyIncomeInUSD * timeToElapse;
  const dollarsInFlightICUSevere = infectionsByRequestedTimeSevere
   * avgDailyIncomePopulation * avgDailyIncomeInUSD * timeToElapse;


  return {
    estimate: {
      impact: {
        currentlyInfectPeople: CurrentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlightICU
      },
      severeImpact: {
        currentlyInfectPeople: CurrentlyInfectedSevere,
        infectionsByRequestedTime: infectionsByRequestedTimeSevere,
        severeCasesByRequestedTime: severeCasesByRequestedTimeSevere,
        hospitalBedsByRequestedTime: hospitalBedsByRequestedTimeSevere,
        casesForICUByRequestedTime: casesForICUByRequestedTimeSevere,
        casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTimeSevere,
        dollarsInFlightICU: dollarsInFlightICUSevere
      }
    }
  };
};


exports.covid19ImpactEstimator = (data) => {
  const im = Impact(data);
  const { estimate } = im;
  return {
    data,
    estimate
  };
  //
};

// export default covid19ImpactEstimator
