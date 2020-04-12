// const fs = require('fs');

// const readData = fs.readFileSync('./src/inputData.json', 'utf8');
// const Jsondata = JSON.parse(readData);
const returnPeriod = (ImpactData) => {
  // ImpactData = Jsondata;
  if (ImpactData.periodType === 'days') {
    return Math.trunc((ImpactData.timeToElapse * 1) / 3);
  }
  if (ImpactData.periodType === 'weeks') {
    return Math.trunc((ImpactData.timeToElapse * 7) / 3);
  }
  if (ImpactData.periodType === 'months') {
    return Math.trunc((ImpactData.timeToElapse * 30) / 3);
  }
  return 0;
};

const Impact = (data) => {
  const { timeToElapse } = data;
  const { avgDailyIncomePopulation } = data.region;
  const { avgDailyIncomeInUSD } = data.region;
  const { totalHospitalBeds } = data;

  const currentlyInfected = data.reportedCases * 10;
  const currentlyInfectedSevere = data.reportedCases * 50;

  const infectionsByRequestedTime = currentlyInfected * (2 ** returnPeriod(data));
  const infectionsByRequestedTimeSevere = currentlyInfectedSevere * (2 ** returnPeriod(data));

  const severeCasesByRequestedTime = parseInt(0.15 * infectionsByRequestedTime, 10);
  const severeCasesByRequestedTimeSevere = parseInt(0.15 * infectionsByRequestedTimeSevere, 10);

  const severeCovid19PositiveBeds = parseInt(0.35 * totalHospitalBeds, 10);
  const severeCovid19PositiveBedsSevere = parseInt(0.35 * totalHospitalBeds, 10);

  const hospitalBedsByRequestedTime = Math.trunc(severeCovid19PositiveBeds - severeCasesByRequestedTime);
  const hospitalBedsByRequestedTimeSevere = Math.trunc(severeCovid19PositiveBedsSevere
  - severeCasesByRequestedTimeSevere);

  const casesForICUByRequestedTime = Math.trunc(0.05 * infectionsByRequestedTime);
  const casesForICUByRequestedTimeSevere = Math.trunc(0.05 * infectionsByRequestedTimeSevere);

  const casesForVentilatorsByRequestedTime = Math.trunc(0.02 * infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTimeSevere = Math.trunc(0.02 * infectionsByRequestedTimeSevere);

  const dollarsInFlight = infectionsByRequestedTime * avgDailyIncomePopulation
   * avgDailyIncomeInUSD * timeToElapse;
  const dollarsInFlightICUSevere = infectionsByRequestedTimeSevere
   * avgDailyIncomePopulation * avgDailyIncomeInUSD * timeToElapse;


  return {
    estimate: {
      impact: {
        // ch-1
        currentlyInfected,
        infectionsByRequestedTime,
        // ch-2
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        // ch-3
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
      },
      severeImpact: {
        currentlyInfected: currentlyInfectedSevere,
        infectionsByRequestedTime: infectionsByRequestedTimeSevere,
        severeCasesByRequestedTime: severeCasesByRequestedTimeSevere,
        hospitalBedsByRequestedTime: hospitalBedsByRequestedTimeSevere,
        casesForICUByRequestedTime: casesForICUByRequestedTimeSevere,
        casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTimeSevere,
        dollarsInFlight: dollarsInFlightICUSevere
      }
    }
  };
};


const covid19ImpactEstimator = (data) => {
  const im = Impact(data);
  const { estimate } = im;
  const { impact } = estimate;
  const { severeImpact } = estimate;

console.log({
    data,
    impact,
    severeImpact
  });
  
  return {
    data,
    impact,
    severeImpact
  };
  //
};

 module.exports = covid19ImpactEstimator
